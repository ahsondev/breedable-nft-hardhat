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
    
    // creator's addresses
    address public constant ABC_ADDRESS = 0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db;
    address public constant ARTIST_ADDRESS = 0x892E10CB1299C16e469cf0f79f18CCa639D00F5B;
    address public constant OWNER_ADDRESS = 0x3de2f28435F5E1110F7C2a4a0FB963b7509d2C85;

    // whitelist
    mapping (address => bool) public whiteList;
    uint public startTime;

    // if true, stops minting
    bool public bPaused = false;

    // token's URI
    mapping (uint256 => string) private _tokenUris;
    string public baseURI;

    uint256 public mintedInitialTokenCount = 0;

    // breed tokens
    uint256 private breedTokenCount = 0;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId);
    event BreededNewNFT(uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) {
        // mark start time for whitelist
        startTime = block.timestamp;
        baseURI = baseURI_;
        
        address[] memory addrs = new address[](2);
        addrs[0] = ABC_ADDRESS;
        addrs[1] = OWNER_ADDRESS;

        addWhiteLists(addrs);

        // should mint #00000
        _tokenUris[0] = string(abi.encodePacked(baseURI, "0"));
        _mintHero(0);
        _safeMint(OWNER_ADDRESS, 0);

        // should mint #00001
        _tokenUris[1] = string(abi.encodePacked(baseURI, "1"));
        _mintHero(1);
        _safeMint(ABC_ADDRESS, 1);

        // should mint #00002
        _tokenUris[2] = string(abi.encodePacked(baseURI, "2"));
        _mintHero(2);
        _safeMint(ARTIST_ADDRESS, 2);
        mintedInitialTokenCount += 3;
    }

    function setTokenURI(uint256 tokenId_, string memory tokenUri_) public onlyOwner {
        _tokenUris[tokenId_] = tokenUri_;
    }

    function remainTokenCount() public view returns (uint256) {
        return INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
    }

    function mint() public payable {
        require(!bPaused, "Sale Paused");
        if (block.timestamp <= startTime + 24 hours) {
            require(isWhiteList(msg.sender), "Address is not included in whiteList");
        }
        require(mintedInitialTokenCount < INITIAL_TOKEN_COUNT, "Max limit");
        require(msg.value >= MINT_PRICE, "Value below price");

        _tokenUris[mintedInitialTokenCount] = string(abi.encodePacked(baseURI, mintedInitialTokenCount.toString()));
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
        require(msg.sender == ABC_ADDRESS || msg.sender == OWNER_ADDRESS || msg.sender == owner(), "You don't have withdrawing priviledge");
        uint256 balance = address(this).balance;
        require(balance >= 10000000000, "Balance is too small");
        uint256 balance_5p = balance.mul(5).div(100);
        _widthdraw(ABC_ADDRESS, balance_5p);
        _widthdraw(OWNER_ADDRESS, balance - balance_5p - 1000);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function mintUnsoldTokens(address to_, string[] memory tokenUris_) public onlyOwner {
        require(mintedInitialTokenCount < INITIAL_TOKEN_COUNT, "No unsold tokens");
        require(tokenUris_.length == INITIAL_TOKEN_COUNT - mintedInitialTokenCount, "TokenUris should match");

        for (uint256 i = mintedInitialTokenCount; i < INITIAL_TOKEN_COUNT; i++) {
            _tokenUris[i] = tokenUris_[i - mintedInitialTokenCount];
            _mintHero(i);
            _safeMint(to_, i);
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
    function removeWhiteLists(address[] memory addrs) public onlyOwner {
        for (uint i = 0; i < addrs.length; i += 1) {
            whiteList[addrs[i]] = false;
        }
    }

    function mintBreedToken(string memory tokenUri_, uint256 heroId1_, uint256 heroId2_) public {
        require(_exists(heroId1_) && _exists(heroId2_), "Parents not exist");
        require(heroId1_ != heroId2_, "Parents should not be same");
        uint256 tokenId = breedTokenCount + INITIAL_TOKEN_COUNT;
        _breedHero(heroId1_, heroId2_, tokenId);
        _safeMint(msg.sender, tokenId);
        _tokenUris[tokenId] = tokenUri_;
        breedTokenCount += 1;
        emit BreededNewNFT(tokenId);
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
