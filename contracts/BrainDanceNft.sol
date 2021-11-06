// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./HeroFactory.sol";

contract BrainDanceNft is ERC721Enumerable, Ownable, HeroFactory {
    using SafeMath for uint256;
    using Strings for uint256;

    // initial token count
    uint256 public constant INITIAL_TOKEN_COUNT = 10101;

    // initial token price
    uint256 public constant MINT_PRICE = 0.07 ether;
    uint256 public constant BREED_PRICE = 0.026 ether;
    
    // creator's addresses
    address public constant ABC_ADDRESS = 0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db;
    address public constant XYZ_ADDRESS = 0x892E10CB1299C16e469cf0f79f18CCa639D00F5B;
    address public constant TEST_ADDRESS = 0xA5DBC34d69B745d5ee9494E6960a811613B9ae32;

    // whitelist
    mapping (address => bool) public whiteList;
    uint public startTime;

    // if true, stops minting
    bool private bPaused = false;

    // token's URI
    mapping (uint256 => string) private _tokenUris;

    uint256 public mintedInitialTokenCount = 0;

    // breed tokens
    uint256 private breedTokenCount = 0;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        // mark start time for whitelist
        startTime = block.timestamp;
        
        address[] memory addrs = new address[](3);
        addrs[0] = ABC_ADDRESS;
        addrs[1] = XYZ_ADDRESS;
        addrs[2] = TEST_ADDRESS;

        addWhiteLists(addrs);

        // should mint #000000
    }

    function setTokenURI(uint256 tokenId_, string memory tokenUri_) public onlyOwner {
        _tokenUris[tokenId_] = tokenUri_;
    }

    function remainTokenCount() public view returns (uint256) {
        return INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
    }

    function mint(string memory tokenUri_) public payable {
        require(!bPaused, "Sale Paused");
        if (block.timestamp <= startTime + 4 hours) {
            require(isWhiteList(msg.sender), "Address is not included in whiteList");
        }
        require(mintedInitialTokenCount < INITIAL_TOKEN_COUNT, "Max limit");
        require(msg.value >= MINT_PRICE, "Value below price");

        _tokenUris[mintedInitialTokenCount] = tokenUri_;
        _mintHero(mintedInitialTokenCount);
        _safeMint(msg.sender, mintedInitialTokenCount);
        emit MintedNewNFT(mintedInitialTokenCount);
        mintedInitialTokenCount += 1;
    }

    function walletOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        uint256 iToken = 0;
        uint256 total = totalSupply();
        for (uint256 i = 0; i < total; i++) {
            if (ownerOf(tokenByIndex(i)) == owner) {
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

    function mintUnsoldTokens(address to_, string[] memory tokenUris_) public onlyOwner {
        require(tokenUris_.length == INITIAL_TOKEN_COUNT - mintedInitialTokenCount + 1, "TokenUris should match");

        for (uint256 i = mintedInitialTokenCount; i < INITIAL_TOKEN_COUNT; i++) {
            _tokenUris[mintedInitialTokenCount + i] = tokenUris_[i - mintedInitialTokenCount];
            _mintHero(mintedInitialTokenCount + i);
            _safeMint(to_, mintedInitialTokenCount + i);
        }
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

    function mintBreedToken(string memory tokenUri_, uint256 heroId1_, uint256 heroId2_) public payable {
        require(msg.value >= BREED_PRICE, "Value below price");
        uint256 tokenId = breedTokenCount + INITIAL_TOKEN_COUNT;
        _breedHero(heroId1_, heroId2_, tokenId);
        _safeMint(msg.sender, tokenId);
        _tokenUris[tokenId] = tokenUri_;
        breedTokenCount += 1;
        emit MintedNewNFT(tokenId);
    }

    // breed token's tokenURI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenUris[tokenId];
    }

    function setStarttime() public onlyOwner {
        startTime = block.timestamp;
    }
}
