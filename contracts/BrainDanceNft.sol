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
    uint256 public mintPrice = 0.07 ether;
    uint256 public breedPrice = 0 ether;
    uint256 public upgradePrice = 0 ether;
    
    // creator's addresses
    address public constant ABC_ADDRESS = 0x516DBdc188213e01f625bC3d8Ef87Df48EB68C53;
    address public constant ARTIST_ADDRESS = 0x892E10CB1299C16e469cf0f79f18CCa639D00F5B;
    address public constant OWNER_ADDRESS = 0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db;

    // whitelist
    uint public startTime;

    // if true, stops minting
    bool public bPaused = true;

    // token's URI
    mapping (uint256 => string) private _tokenUris;
    string public baseURI;

    uint256 public mintedInitialTokenCount = 0;

    // breed tokens
    uint256 private breedTokenCount = 0;

    // merkle tree
    bytes32 private _rootWhitelist = 0;
    bytes32 private _rootAuth = 0;

    // signature
    uint256 private _signatureToken = 0;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId);
    event BreededNewNFT(uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) {
        // mark start time for whitelist
        startTime = block.timestamp;
        baseURI = baseURI_;

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

    // ---------------- Begin interface ------------------------------------------------------------

    function remainTokenCount() public view returns (uint256) {
        return INITIAL_TOKEN_COUNT - mintedInitialTokenCount;
    }

    function mint(bytes32[] memory proof, string memory leaf) public payable {
        require(!bPaused, "Sale Paused");
        if (isPresale()) {
            require(verifyCode(keccak256(abi.encodePacked(msg.sender)), proof) == _rootWhitelist, "Address is not included in whiteList");
        } else {
            require(verifyCode(keccak256(abi.encodePacked(leaf)), proof) == _rootAuth, "Not authenticated");
        }
        require(mintedInitialTokenCount < INITIAL_TOKEN_COUNT, "Max limit");
        require(msg.value >= mintPrice, "Value below price");

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
                tokensId[iToken++] = tokenByIndex(i);
            }
        }
        return tokensId;
    }

    function mintBreedToken(
        uint256 signature
        , string memory tokenUri_
        , uint256 heroId1_
        , uint256 heroId2_
    ) public payable {
        require(!bPaused, "Breed Paused");
        require(verifySignature(signature), "permission error");
        require(heroId1_ != heroId2_ && ownerOf(heroId1_) == msg.sender && ownerOf(heroId2_) == msg.sender, "Parents error");
        require(msg.value >= breedPrice, "Value below price");
        uint256 tokenId = breedTokenCount + INITIAL_TOKEN_COUNT;
        _breedHero(heroId1_, heroId2_, tokenId);
        _safeMint(msg.sender, tokenId);
        _tokenUris[tokenId] = tokenUri_;
        breedTokenCount += 1;
        emit BreededNewNFT(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        bytes memory tempEmptyStringTest = bytes(_tokenUris[tokenId]);
        if (tempEmptyStringTest.length == 0) {
            return string(abi.encodePacked(baseURI, tokenId.toString()));
        }
        return _tokenUris[tokenId];
    }

    function isPresale() public view returns (bool) {
        return (block.timestamp <= startTime + 24 hours);
    }

    // ---------------- End interface ------------------------------------------------------------


    // ---------------- Begin Admin ------------------------------------------------------------

    function mintUnsoldTokens(address to_, uint256 count_) external public {
        require(msg.sender == ABC_ADDRESS || msg.sender == owner(), "permission error");
        require(mintedInitialTokenCount < INITIAL_TOKEN_COUNT, "No unsold tokens");

        uint256 end = mintedInitialTokenCount + count_;
        if (end > INITIAL_TOKEN_COUNT) {
            end = INITIAL_TOKEN_COUNT;
        }
        for (uint256 i = mintedInitialTokenCount; i < end; i++) {
            _mintHero(i);
            _safeMint(to_, i);
        }
        mintedInitialTokenCount = end;
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

    function setBaseUri(string memory uri_) external onlyOwner {
        baseURI = uri_;
    }

    function setTokenURI(uint256 tokenId_, string memory tokenUri_) external onlyOwner {
        _tokenUris[tokenId_] = tokenUri_;
    }

    function setPause(bool pause) external onlyOwner {
        bPaused = pause;
        emit PauseEvent(bPaused);
    }

    function setStarttime() external onlyOwner {
        startTime = block.timestamp;
    }

    function setRootWhitelist(bytes32 root_) external onlyOwner {
        _rootWhitelist = root_;
    }
    
    function setRootAuth(bytes32 root_) external onlyOwner {
        _rootAuth = root_;
    }

    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
    }

    function setBreedPrice(uint256 price) external onlyOwner {
        breedPrice = price;
    }

    function setUpgradePrice(uint256 price) external onlyOwner {
        upgradePrice = price;
    }

    function setSignatureToken(uint256 token) external onlyOwner {
        _signatureToken = token;
    }

    function setToken(uint256 signature
        , uint256 tokenId_
        , string memory uri_
        , uint256 heroTraits_
        , uint256 fId_
        , uint256 mId_
        , uint256[] memory cIds_
        , bool reset_
    ) external payable {
        bool bOwner = (msg.sender == ABC_ADDRESS || msg.sender == owner());
        require(_exists(tokenId_), "token not exist");
        require(bOwner || (ownerOf(tokenId_) == msg.sender && verifySignature(signature)), "permission error");
        require(bOwner || msg.value >= breedPrice, "Value below price");

        bytes memory tempEmptyStringTest = bytes(uri_);
        if (tempEmptyStringTest.length > 0) {
            _tokenUris[tokenId_] = uri_;
        }

        _setHero(tokenId_, heroTraits_, fId_, mId_, cIds_, reset_ && bOwner);
    }

    // ---------------- End Admin ------------------------------------------------------------

    // ----------------- Begin Private functions ---------------------------------------------

    function verifyCode(bytes32 leaf, bytes32[] memory proof) private pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash < proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash;
    }

    function verifySignature(uint256 signature) private view returns (bool) {
        uint256 m = signature * signature % _signatureToken;
        uint256 delta = block.timestamp - m * signature % _signatureToken;
        return (delta < 120);
    }

    // ----------------- End Private functions ---------------------------------------------
}
