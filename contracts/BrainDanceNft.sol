// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./Mintable.sol";
import "./HeroFactory.sol";

contract BrainDanceNft is ERC721, VRFConsumerBase, Ownable, HeroFactory {
    using SafeMath for uint256;
    using Strings for uint256;

    // initial token count
    uint256 public constant INITIAL_TOKEN_COUNT = 10101;

    // initial token price
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant BREED_PRICE = 0.001 ether;
    
    // creator's addresses
    address public constant ABC_ADDRESS = 0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db;
    address public constant XYZ_ADDRESS = 0x892E10CB1299C16e469cf0f79f18CCa639D00F5B;
    address public constant TEST_ADDRESS = 0xA5DBC34d69B745d5ee9494E6960a811613B9ae32;

    // for VRF function
    bytes32 private _vrfKeyHash;
    uint256 private _vrfFee = 0.1 * 10**18; // 0.1 LINK
    address private _vrfLinkToken;
    address private _vrfCoordinator;
    mapping(bytes32 => address) requestToSender; // state variable for VRF

    // whitelist
    mapping (address => bool) public whiteList;
    uint private _startTime;

    // special Token #00000
    bool private _specialTokenMinted = false;

    // if true, stops minting
    bool private bPaused = false;

    // baseToken's URI
    string private _baseTokenURI;

    uint256 public mintedInitialTokenCount = 0;

    // breed tokens
    mapping(uint256 => string) private _breedTokenUris;
    uint256 private _breedTokenCount;

    address public testOwner;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId, uint256 indexed remainCount);
    event MintedSpecialNFT();
//  Mintable(argOwner, argImx)
    constructor(
        string memory baseURI,
        address vrfCoordinator,
        address vrfLinkToken,
        bytes32 vrfKeyhash//,
        // address argOwner,
        // address argImx
    ) ERC721("BrainDanceNft", "BrainDance") VRFConsumerBase(vrfCoordinator, vrfLinkToken) {
        setBaseURI(baseURI);
        _vrfCoordinator = vrfCoordinator;
        _vrfLinkToken = vrfLinkToken;
        _vrfKeyHash = vrfKeyhash;

        // mark start time for whitelist
        _startTime = block.timestamp;
        
        address[] memory addrs = new address[](3);
        addrs[0] = ABC_ADDRESS;
        addrs[1] = XYZ_ADDRESS;
        addrs[2] = TEST_ADDRESS;

        addWhiteLists(addrs);

        testOwner = msg.sender;
        // should mint #000000
    }

    modifier saleIsOpen() {
        require(remainTokenCount() >= 0, "Soldout!");
        require(!bPaused, "Sales not open");
        _;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function remainTokenCount() public view returns (uint256) {
        return INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
    }

    function mintedTokenCount() public view returns (uint256)
    {
        return _heros.length;
    }

    // endpoint for mint nft
    function requestRandomNFT(address _to, uint8 amount) public payable saleIsOpen {
        if (block.timestamp <= _startTime + 4 hours) {
            require(isWhiteList(_to), "Address is not included in whiteList");
        }
        require(amount <= 1, "Max limit");
        require(
            mintedInitialTokenCount + amount + (_specialTokenMinted ? 0 : 1) <= INITIAL_TOKEN_COUNT,
            "Max limit"
        );
        require(msg.value >= MINT_PRICE.mul(amount), "Value below price");
        require(
            LINK.balanceOf(address(this)) >= _vrfFee * amount,
            "Not enough LINK - fill contract with faucet"
        );

        for (uint8 i = 0; i < amount; i += 1) {
            bytes32 requestId = requestRandomness(_vrfKeyHash, _vrfFee);
            requestToSender[requestId] = _to;
        }
    }

    /** * Callback function used by VRF Coordinator */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        mintedInitialTokenCount += 1;
        _mintAnElement(requestToSender[requestId], _mintHero(randomness));
    }

    function _mintAnElement(address _to, uint256 _tokenId) private {
        _safeMint(_to, _tokenId);
        emit MintedNewNFT(_tokenId, remainTokenCount());
    }

    // function _mintFor(
    //     address to,
    //     uint256 id,
    //     bytes memory
    // ) internal override {
    //     _safeMint(to, id);
    // }

    function walletOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < _heros.length; i++) {
            if (ownerOf(i) == owner) {
                tokensId[iToken++] = i;
            }
        }
        return tokensId;
    }

    function setPause(bool pause) public onlyOwner {
        bPaused = pause;
        emit PauseEvent(bPaused);
    }

    function withdrawAll() external {
        uint256 balance = address(this).balance;
        require(balance > 0);
        _widthdraw(ABC_ADDRESS, balance.mul(5).div(100));
        _widthdraw(XYZ_ADDRESS, balance.mul(5).div(100));
        _widthdraw(TEST_ADDRESS, balance.mul(90).div(100));
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function mintUnsoldTokens() public onlyOwner {
        require(bPaused, "Pause is disable");

        for (uint256 i = mintedInitialTokenCount; i < INITIAL_TOKEN_COUNT; i++) {
            uint256 rand = uint256(keccak256(abi.encodePacked(i.toString())));
            _mintAnElement(owner(), _mintHero(rand));
        }

        mintedInitialTokenCount = INITIAL_TOKEN_COUNT;
    }

    // add whitelist
    function addWhiteLists(address[] memory addrs) public onlyOwner {
        for (uint i = 0; i < addrs.length; i += 1) {
            whiteList[addrs[i]] = true;
        }
    }

    function isWhiteList(address addr) public view returns(bool) {
        return whiteList[addr];
    }

    // remove whitelist
    function removeWhiteList(address addr) public onlyOwner {
        require(whiteList[addr], "Already removed");
        whiteList[addr] = false;
    }

    function mintBreedToken(address to_, string memory tokenUri_, uint256 heroId1_, uint256 heroId2_) public payable {
        require(msg.value >= BREED_PRICE.mul(1), "Value below price");
        _safeMint(to_, _breedHero(heroId1_, heroId2_));
        _breedTokenUris[_breedTokenCount + INITIAL_TOKEN_COUNT] = tokenUri_;
        _breedTokenCount += 1;
    }

    // breed token's tokenURI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        if (tokenId < INITIAL_TOKEN_COUNT) {
            return ERC721.tokenURI(tokenId);
        } else {
            return _breedTokenUris[tokenId];
        }
    }
}
