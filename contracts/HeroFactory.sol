// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract HeroFactory {
    using Strings for uint256;

    struct Hero {
        uint256 traits;
        // ancestor
        uint256 fatherId;
        uint256 motherId;
        uint256[] childrenIds;
    }

    mapping (uint256 => Hero) internal _heros;

    uint256 constant MAX_INT = 2**256 - 1;

    constructor() {}

    function _mintHero(uint256 tokenId_) internal {
        _heros[tokenId_] = Hero(0, MAX_INT, MAX_INT, new uint256[](0));
    }

    function _breedHero(uint256 heroId1_, uint256 heroId2_, uint256 tokenId_) internal {
        // create a child
        _heros[tokenId_] = Hero(0, heroId1_, heroId2_, new uint256[](0));

        // add child id
        _heros[heroId1_].childrenIds.push(tokenId_);
        _heros[heroId2_].childrenIds.push(tokenId_);
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

    function getChildren(uint256 tokenId_) external view returns (Hero[] memory) {
        Hero storage hero = _heros[tokenId_];
        Hero[] memory children = new Hero[](hero.childrenIds.length);
        for (uint i = 0; i < hero.childrenIds.length; i += 1) {
            children[i] = _heros[hero.childrenIds[i]];
        }
        return children;
    }

    function getChildrenIdsWithParent(uint256 heroId1_, uint256 heroId2_) public view returns (uint256[] memory) {
        Hero storage hero1 = _heros[heroId1_];
        uint256 count = 0;
        uint256[] memory ret = new uint256[](hero1.childrenIds.length);
        count = 0;
        for (uint i = 0; i < hero1.childrenIds.length; i += 1) {
            if (findIndex(_heros[heroId2_].childrenIds, hero1.childrenIds[i]) < _heros[heroId2_].childrenIds.length) {
                ret[count++] = hero1.childrenIds[i];
            }
        }

        uint256[] memory ret1 = new uint256[](count);
        count = 0;
        for (uint i = 0; i < ret.length; i += 1) {
            ret1[i] = ret[i];
        }

        return ret1;
    }

    function getChildrenWithParent(uint256 heroId1_, uint256 heroId2_) external view returns (Hero[] memory) {
        uint256[] memory ids = getChildrenIdsWithParent(heroId1_, heroId2_);
        Hero[] memory ret = new Hero[](ids.length);
        for (uint i = 0; i < ids.length; i += 1) {
            ret[i] = _heros[ids[i]];
        }
        return ret;
    }

    function findIndex(uint256[] memory array, uint256 val) public pure returns (uint256) {
        for (uint i = 0; i < array.length; i += 1) {
            if (array[i] == val) {
                return i;
            }
        }
        return array.length;
    }
}
