// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HeroFactory {
    struct Hero {
        uint256 traits;
        // ancestor
        uint256 fatherId;
        uint256 motherId;
    }

    mapping (uint256 => Hero) internal _heros;

    uint256 constant MAX_INT = 2**250 - 1;

    constructor() {}

    function _mintHero(uint256 tokenId_) internal {
        _heros[tokenId_] = Hero(0, MAX_INT, MAX_INT);
    }

    function _breedHero(uint256 heroId1_, uint256 heroId2_, uint256 tokenId_) internal {
        // create a child
        _heros[tokenId_] = Hero(0, heroId1_, heroId2_);
    }

    function _setHero(
        uint256 tokenId_
        , uint256 traits
        , uint256 fatherId
        , uint256 motherId
        , bool reset
    ) internal {
        _heros[tokenId_].traits = traits;
        if (reset) {
            _heros[tokenId_].fatherId = fatherId;
            _heros[tokenId_].motherId = motherId;
        }
    }

    function getHero(uint256 tokenId_) external view returns (Hero memory) {
        return _heros[tokenId_];
    }

    function getParent(uint256 tokenId_) external view returns (Hero[] memory) {
        Hero[] memory parent;
        Hero storage hero = _heros[tokenId_];
        if (hero.fatherId != MAX_INT) {
            parent = new Hero[](2);
            parent[0] = _heros[hero.fatherId];
            parent[1] = _heros[hero.motherId];
        }
        return parent;
    }
}
