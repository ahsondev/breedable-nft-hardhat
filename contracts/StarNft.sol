// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract StarNft is ERC721, VRFConsumerBase, Ownable {
    using SafeMath for uint256;

    // initial token count
    uint256 public constant INITIAL_TOKEN_COUNT = 10101;

    // initial token price
    uint256 public constant PRICE = 0.001 ether;
    
    // creator's addresses
    address public constant DEV_ADDRESS = 0xA5DBC34d69B745d5ee9494E6960a811613B9ae32;

    // for VRF function
    bytes32 private _vrfKeyHash;
    uint256 private _vrfFee = 0.1 * 10**18; // 0.1 LINK
    address private _vrfLinkToken;
    address private _vrfCoordinator;

    // state variable for VRF
    mapping(bytes32 => address) requestToSender;

    // avaiable _okenIds, (start from 0)
    uint256[] private _tokenIds;

    // whitelist
    mapping (address => bool) public whiteList;
    uint private _startTime;
    uint public constant WHITE_LIST_HOURS = 4;

    // special Token #00000
    bool private _specialTokenMinted = false;

    // if true, stops minting
    bool private _bPaused = false;

    // baseToken's URI
    string private _baseTokenURI;

    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId, uint256 indexed remainCount);
    event MintedSpecialNFT();

    constructor(
        string memory baseURI,
        address vrfCoordinator,
        address vrfLinkToken,
        bytes32 vrfKeyhash
    ) ERC721("StarNft", "Star") VRFConsumerBase(vrfCoordinator, vrfLinkToken) {
        setBaseURI(baseURI);
        _vrfCoordinator = vrfCoordinator;
        _vrfLinkToken = vrfLinkToken;
        _vrfKeyHash = vrfKeyhash;

        // mark start time for whitelist
        _startTime = block.timestamp;

        _initTokenIds();

        // hard coded whiteList
        addWhiteList(0xA5DBC34d69B745d5ee9494E6960a811613B9ae32);
    }

    modifier saleIsOpen() {
        require(remainTokenCount() >= 0, "Soldout!");
        require(!_bPaused, "Sales not open");
        _;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // init token ids
    function _initTokenIds() internal {
        for (uint256 i = 0; i < INITIAL_TOKEN_COUNT; i += 1) {
            _tokenIds.push(i);
        }
    }

    function remainTokenCount() public view returns (uint256) {
        return _tokenIds.length;
    }

    function mintedTokenCount() public view returns (uint256) {
        return INITIAL_TOKEN_COUNT - remainTokenCount();
    }

    // endpoint for mint nft
    function requestRandomNFT(address _to, uint8 amount)
        public
        payable
        saleIsOpen
    {
        uint256 total = mintedTokenCount();
        if (block.timestamp <= _startTime + WHITE_LIST_HOURS * 1 hours) {
            require(isWhiteList(_to), "Address is not included in whiteList");
        }
        require(amount <= 1, "Max limit");
        require(
            total + amount + (_specialTokenMinted ? 0 : 1) <= INITIAL_TOKEN_COUNT,
            "Max limit"
        );
        require(msg.value >= mintMoney(amount), "Value below price");
        require(
            LINK.balanceOf(address(this)) >= _vrfFee * amount,
            "Not enough LINK - fill contract with faucet"
        );

        for (uint8 i = 0; i < amount; i += 1) {
            bytes32 requestId = requestRandomness(_vrfKeyHash, _vrfFee);
            requestToSender[requestId] = _to;
        }
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 availableCount = _tokenIds.length - (_specialTokenMinted ? 0 : 1);
        require(availableCount > 0, "Sold out");

        uint256 index = randomness % availableCount;
        address _to = requestToSender[requestId];
        _starmint(_to, _tokenIds[index]);
    }

    function _starmint(address _to, uint256 _tokenId) private {
        _mintAnElement(_to, _tokenId);
        _removeTokenId(_tokenId);
    }

    function _mintAnElement(address _to, uint256 _tokenId) private {
        _safeMint(_to, _tokenId);

        emit MintedNewNFT(_tokenId, remainTokenCount());
    }

    function mintMoney(uint256 _count) public pure returns (uint256) {
        return PRICE.mul(_count);
    }

    function walletOfOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < tokenCount; i++) {
            if (ownerOf(i) == owner) {
                tokensId[iToken++] = i;
            }
        }
        return tokensId;
    }

    function setPause(bool pause) public onlyOwner {
        _bPaused = pause;
        emit PauseEvent(_bPaused);
    }

    function getPause() public view returns (bool) {
        return _bPaused;
    }

    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        _widthdraw(DEV_ADDRESS, balance.mul(100).div(100));
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function getUnsoldTokens(uint256 offset, uint256 limit)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory tokens = new uint256[](limit);

        for (uint256 i = 0; i < limit; i++) {
            uint256 key = i + offset;
            if (ownerOf(key) == address(0)) {
                tokens[i] = key;
            }
        }

        return tokens;
    }

    function mintTokens(uint256[] memory tokensId) public onlyOwner {
        require(_bPaused, "Pause is disable");

        for (uint256 i = 0; i < tokensId.length; i++) {
            if (ownerOf(tokensId[i]) == address(0)) {
                _mintAnElement(owner(), tokensId[i]);
            }
        }
    }

    function _findTokenIdIndex(uint256 tokenId)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (tokenId == _tokenIds[i]) {
                return i;
            }
        }
        return _tokenIds.length + 100;
    }

    // remove minted token id
    function _removeTokenId(uint256 _tokenId) internal {
        require(_tokenIds.length > 0, "_tokenIds is empty");
        //get index for _tokenId
        uint256 index = _findTokenIdIndex(_tokenId);
        require(
            index <= _tokenIds.length,
            "Cannot find _tokenIds Index - removeTokenId"
        );
        _tokenIds[index] = _tokenIds[_tokenIds.length - 1];
        _tokenIds.pop();
    }

    // add whitelist
    function addWhiteList(address addr) public onlyOwner {
        require(!whiteList[addr], "Already Added");
        whiteList[addr] = true;
    }

    function isWhiteList(address addr) public view onlyOwner returns(bool) {
        return whiteList[addr];
    }

    // remove whitelist
    function removeWhiteList(address addr) public onlyOwner {
        require(whiteList[addr], "Already removed");
        whiteList[addr] = false;
    }

    function mintSpecialToken(address to) public onlyOwner {
        require(!_specialTokenMinted, "Already minted");
        _starmint(to, 0);
        _specialTokenMinted = true;
        emit MintedSpecialNFT();
    }
}
