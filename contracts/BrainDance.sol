// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./HeroFactory.sol";

contract BrainDance is ERC721, Ownable, HeroFactory {
    using Strings for uint256;

    // initial token count
    uint256 public constant INITIAL_TOKEN_COUNT = 10101;

    // initial token price
    uint256[] public prices = [0, 0.06 ether, 0.09 ether, 0.12 ether, 0.15 ether];
    uint256 public breedPrice = 0 ether;
    uint256 public upgradePrice = 0 ether;
    
    // creator's addresses
    address public OWNER1_ADDRESS = 0x52A9351CCF73Db3f0ab25977a30eE592c3F1b9fa;
    address public constant ARTIST_ADDRESS = 0xeDc30Ac05A1C72e97fDb0748F757aB45b0E72C9F;
    address public constant OWNER_ADDRESS = 0xb0112A55BB1cEbAd70401B3C223170A06F419fDf;
    address public constant CREATIVE_TRND_ADDRESS = 0x0f55c825c0ED2C43EBdfAC5B424604C7386ba4e1;

    // 0: not started
    // 1: gold vip
    // 2: silver vip
    // 3: bronze vip
    // 4: public sale
    // 5: sale ended
    // 6: stopped
    uint8 public statusFlag = 0;

    // token's URI
    mapping (uint256 => string) private _tokenUris;
    string private _baseUri;

    // token count
    uint256 public mintedInitialTokenCount = 0;
    uint256 public breedTokenCount = 0;
    uint256[] public countLimit = [0, 2, 2, 2, 3];
    mapping(uint256 => mapping(address => uint256)) public stepBalance;

    // merkle tree
    bytes32[] private _rootVips = [bytes32(0), bytes32(0), bytes32(0), bytes32(0)];
    bytes32 private _rootSign = 0;
    mapping (address => bool) private _leafUsed;

    // events
    event PauseEvent(bool pause);
    event MintedNewNFT(uint256 indexed tokenId, uint256 indexed count);
    event BreededNewNFT(uint256 indexed tokenId);

    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) {
        // mark start time for whitelist
        _baseUri = baseURI_;

        // should mint #00000
        _mintHero(0);
        _safeMint(OWNER_ADDRESS, 0);

        // should mint #00001, #00002
        _mintHero(1);
        _safeMint(OWNER1_ADDRESS, 1);
        _mintHero(2);
        _safeMint(OWNER1_ADDRESS, 2);

        // should mint #00003, #00004
        _mintHero(3);
        _safeMint(ARTIST_ADDRESS, 3);
        _mintHero(4);
        _safeMint(ARTIST_ADDRESS, 4);

        // reserved mints
        for (uint i = 5; i < 25; i++) {
            _mintHero(i);
            _safeMint(OWNER_ADDRESS, i);
        }
        mintedInitialTokenCount += 25;
    }

    // ---------------- Begin interface ------------------------------------------------------------

    function mintVip(bytes32[] memory proof, uint256 count) public payable {
        require(statusFlag >=1 && statusFlag <= 3 && verifyCode(msg.sender, proof, _rootVips[statusFlag]), "Paused or permission error");
        require(count >= 1 && count + stepBalance[statusFlag][msg.sender] <= countLimit[statusFlag] && mintedInitialTokenCount + count <= INITIAL_TOKEN_COUNT, "count error");
        require(msg.value >= prices[statusFlag] * count, "Value below price");

        for (uint256 i = 0; i < count; i++) {
            _mintHero(mintedInitialTokenCount + i);
            _safeMint(msg.sender, mintedInitialTokenCount + i);
        }
        mintedInitialTokenCount += count;
        stepBalance[statusFlag][msg.sender] = stepBalance[statusFlag][msg.sender] + count;
        emit MintedNewNFT(mintedInitialTokenCount, count);
    }
    
    function mint(uint256 count) public payable {
        require(statusFlag == 4, "Paused");
        require(count >= 1 && count + stepBalance[statusFlag][msg.sender] <= countLimit[statusFlag] && mintedInitialTokenCount + count <= INITIAL_TOKEN_COUNT, "count error");
        require(msg.value >= prices[statusFlag] * count, "Value below price");

        for (uint256 i = 0; i < count; i++) {
            _mintHero(mintedInitialTokenCount + i);
            _safeMint(msg.sender, mintedInitialTokenCount + i);
        }
        mintedInitialTokenCount += count;
        stepBalance[statusFlag][msg.sender] = stepBalance[statusFlag][msg.sender] + count;
        emit MintedNewNFT(mintedInitialTokenCount, count);
    }

    function walletOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < mintedInitialTokenCount; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                tokensId[iToken++] = i;
            }
        }
        for (uint256 i = 0; i < breedTokenCount; i++) {
            if (_exists(i + INITIAL_TOKEN_COUNT) && ownerOf(i + INITIAL_TOKEN_COUNT) == owner) {
                tokensId[iToken++] = i + INITIAL_TOKEN_COUNT;
            }
        }
        return tokensId;
    }

    function mintBreedToken(
        bytes32[] memory proof
        , address leaf
        , string memory tokenUri_
        , uint256 heroId1_
        , uint256 heroId2_
    ) public payable {
        require(statusFlag != 6 && !_leafUsed[leaf] && verifyCode(leaf, proof, _rootSign), "Breed Paused or permission error");
        _leafUsed[leaf] = true;
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
            return string(abi.encodePacked(_baseUri, tokenId.toString()));
        }
        return _tokenUris[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        uint256 cnt = 0;
        for (uint256 i = 0; i < mintedInitialTokenCount; i++) {
            if (_exists(i)) {
                cnt++;
            }
        }
        for (uint256 i = INITIAL_TOKEN_COUNT; i < INITIAL_TOKEN_COUNT + breedTokenCount; i++) {
            if (_exists(i)) {
                cnt++;
            }
        }
        return cnt;
    }

    function totalSupplyTokens() external view returns (uint256[] memory) {
        uint256[] memory tokensId = new uint256[](mintedInitialTokenCount + breedTokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < mintedInitialTokenCount; i++) {
            if (_exists(i)) {
                tokensId[iToken++] = i;
            }
        }
        for (uint256 i = INITIAL_TOKEN_COUNT; i < INITIAL_TOKEN_COUNT + breedTokenCount; i++) {
            if (_exists(i)) {
                tokensId[iToken++] = i;
            }
        }

        uint256[] memory ret1 = new uint256[](iToken);
        for (uint i = 0; i < iToken; i += 1) {
            ret1[i] = tokensId[i];
        }

        return ret1;
    }

    function getChildren(uint256 tokenId_) external view returns (uint256[] memory) {
        uint256[] memory tokensId = new uint256[](mintedInitialTokenCount + breedTokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < mintedInitialTokenCount; i++) {
            if (_heros[i].fatherId == tokenId_ || _heros[i].motherId == tokenId_) {
                tokensId[iToken++] = i;
            }
        }
        for (uint256 i = INITIAL_TOKEN_COUNT; i < INITIAL_TOKEN_COUNT + breedTokenCount; i++) {
            if (_heros[i].fatherId == tokenId_ || _heros[i].motherId == tokenId_) {
                tokensId[iToken++] = i;
            }
        }

        uint256[] memory ret1 = new uint256[](iToken);
        for (uint i = 0; i < iToken; i += 1) {
            ret1[i] = tokensId[i];
        }

        return ret1;
    }

    function getChildrenIdsWithParent(uint256 heroId1_, uint256 heroId2_) public view returns (uint256[] memory) {
        uint256[] memory tokensId = new uint256[](mintedInitialTokenCount + breedTokenCount);
        uint256 iToken = 0;
        for (uint256 i = 0; i < mintedInitialTokenCount; i++) {
            if ((_heros[i].fatherId == heroId1_ && _heros[i].motherId == heroId2_)
            || (_heros[i].fatherId == heroId2_ && _heros[i].motherId == heroId1_)) {
                tokensId[iToken++] = i;
            }
        }
        for (uint256 i = INITIAL_TOKEN_COUNT; i < INITIAL_TOKEN_COUNT + breedTokenCount; i++) {
            if ((_heros[i].fatherId == heroId1_ && _heros[i].motherId == heroId2_)
            || (_heros[i].fatherId == heroId2_ && _heros[i].motherId == heroId1_)) {
                tokensId[iToken++] = i;
            }
        }

        uint256[] memory ret1 = new uint256[](iToken);
        for (uint i = 0; i < iToken; i += 1) {
            ret1[i] = tokensId[i];
        }

        return ret1;
    }

    // ---------------- End interface ------------------------------------------------------------


    // ---------------- Begin Admin ------------------------------------------------------------

    function mintUnsoldTokens(address to_, uint256 count_) external onlyStarOwner {
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
        require(isStarOwner() || msg.sender == CREATIVE_TRND_ADDRESS, "You don't have withdrawing priviledge");
        uint256 balance = address(this).balance;
        require(balance >= 10000000000, "Balance is too small");
        uint256 balance_5p = balance * 5 / 100;
        _widthdraw(OWNER1_ADDRESS, balance_5p);
        _widthdraw(ARTIST_ADDRESS, balance_5p);
        _widthdraw(CREATIVE_TRND_ADDRESS, balance_5p);
        _widthdraw(OWNER_ADDRESS, balance - 3 * balance_5p - 1000);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function setBaseUri(string memory uri_) external onlyStarOwner {
        _baseUri = uri_;
    }

    function setPrice(uint256[] memory price) external onlyStarOwner {
        prices = price;
    }

    function setBreedPrice(uint256 price) external onlyStarOwner {
        breedPrice = price;
    }

    function setUpgradePrice(uint256 price) external onlyStarOwner {
        upgradePrice = price;
    }

    function setStatusFlag(uint8 flag) external onlyStarOwner {
        statusFlag = flag;
    }

    function setToken(
        bytes32[] memory proof
        , address leaf
        , uint256 tokenId_
        , string memory uri_
        , uint256 heroTraits_
        , uint256 fId_
        , uint256 mId_
        , bool reset_
    ) external payable {
        require(statusFlag != 6 && _exists(tokenId_), "Paused or Token not exist");
        bool bOwner = isStarOwner();
        if (!bOwner) {
            require(ownerOf(tokenId_) == msg.sender && !_leafUsed[leaf] && verifyCode(leaf, proof, _rootSign), "permission error");
            _leafUsed[leaf] = true;
            require(msg.value >= upgradePrice, "Value below price");
        } else {
        }

        bytes memory tempEmptyStringTest = bytes(uri_);
        if (tempEmptyStringTest.length > 0) {
            _tokenUris[tokenId_] = uri_;
        }

        _setHero(tokenId_, heroTraits_, fId_, mId_, reset_ && bOwner);
    }

    modifier onlyStarOwner() {
        require(msg.sender == OWNER1_ADDRESS || msg.sender == OWNER_ADDRESS || msg.sender == owner(), "Star Ownable: caller is not the owner");
        _;
    }

    function isStarOwner() private view returns (bool) {
        return (msg.sender == OWNER1_ADDRESS || msg.sender == OWNER_ADDRESS || msg.sender == owner());
    }

    function burn(uint256 tokenId) external onlyStarOwner {
        require(_exists(tokenId), "Token not exist");
        _burn(tokenId);
    }

    modifier onlyStarOwner1() {
        require(msg.sender == OWNER1_ADDRESS, "Star Ownable: caller is not the owner");
        _;
    }

    function setOwner1Address(address owner1) external onlyStarOwner1 {
        OWNER1_ADDRESS = owner1;
    }

    function setRootVip(uint256 step, bytes32 v) external onlyStarOwner {
        _rootVips[step] = v;
    }

    function setRootSign(bytes32 v) external onlyStarOwner {
        _rootSign = v;
    }

    function setCountLimit(uint256[] memory v) external onlyStarOwner {
        countLimit = v;
    }

    // ---------------- End Admin ------------------------------------------------------------

    // ----------------- Begin Private functions ---------------------------------------------

    function verifyCode(address leaf, bytes32[] memory proof, bytes32 root) private pure returns (bool) {
        bytes32 computedHash = keccak256(abi.encodePacked(leaf));
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

        return root == computedHash;
    }

    // ----------------- End Private functions ---------------------------------------------
}
