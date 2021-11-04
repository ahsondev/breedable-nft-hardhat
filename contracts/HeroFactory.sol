// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract HeroFactory {
    using Strings for uint256;

    struct Hero {
        uint8 psychologicalTrait;
        uint8 datingTrait;
        uint8 visualItem0;
        uint8 visualItem1;
        uint8 visualItem2;
        uint8 visualItem3;
        uint8 visualItem4;
        uint8 visualItem5;
        uint8 visualItem6;
        uint8 visualItem7;
        uint8 visualItem8;
        uint8 visualItem9; // 96
        uint8 gender; // 1: male, 2: female
        uint8 extra8;
        uint16 extra16;
        uint128 extra128;
        // ancestor
        uint256 fatherId;
        uint256 motherId;
        uint256[] childrenIds;
    }

    Hero[] internal _heros;

    uint256 MAX_INT = 2**256 - 1;

    constructor() {}

    function _mintHero(uint256 dna) internal returns (uint256) {
        _heros.push(_createHero(dna, uint8((_heros.length + 1) % 2)));
        return _heros.length - 1;
    }

    function _breedHero(uint256 heroId1_, uint256 heroId2_) internal returns (uint256) {
        require(_heros[heroId1_].gender != _heros[heroId2_].gender, "Same gender");

        // set father and mother
        Hero storage hero1 = _heros[heroId1_].gender == 0 ? _heros[heroId1_] :  _heros[heroId2_];
        Hero storage hero2 = _heros[heroId1_].gender == 0 ? _heros[heroId2_] :  _heros[heroId1_];

        // create a child
        uint256 seed = (hero1.psychologicalTrait + 1) * (hero1.datingTrait + 1)
            + (hero2.psychologicalTrait + 1) * (hero2.datingTrait + 1)
            + (hero1.psychologicalTrait + 1) * (hero2.datingTrait + 1);
        Hero memory hero = _createHero(_random(seed), 2);
        uint256 newId = _heros.length;

        // set parent
        hero.fatherId = heroId1_;
        hero.motherId = heroId2_;
        _heros.push(hero);

        // add child id
        hero1.childrenIds.push(newId);
        hero2.childrenIds.push(newId);
        return _heros.length - 1;
    }

    function _random(uint256 seed) internal pure returns (uint256) {
        return uint(keccak256(abi.encodePacked((seed * 9 / 11).toString())));
    }

    function _createHero(uint256 dna, uint8 gender) internal view returns (Hero memory) {
        return Hero(
            (uint8)(dna % 32),
            (uint8)(dna % 8),
            (uint8)(_random(dna + 1) % 10),
            (uint8)(_random(dna + 2) % 10),
            (uint8)(_random(dna + 3) % 10),
            (uint8)(_random(dna + 4) % 10),
            (uint8)(_random(dna + 5) % 10),
            (uint8)(_random(dna + 6) % 10),
            (uint8)(_random(dna + 7) % 10),
            (uint8)(_random(dna + 8) % 10),
            (uint8)(_random(dna + 9) % 10),
            (uint8)(_random(dna + 10) % 10),
            gender == 2 ? (uint8)(_random(dna + 11) % 2) : gender,
            0,
            0,
            0,
            MAX_INT,
            MAX_INT,
            new uint256[](0)
        );
    }

    function getHero(uint256 index) external view returns (Hero memory) {
        require(index >= 0 && index < _heros.length, "index out of range");
        return _heros[index];
    }

    function getParent(uint256 index) external view returns (Hero[] memory) {
        require(index >= 0 && index < _heros.length, "index out of range");

        Hero[] memory parent;
        Hero storage hero = _heros[index];
        if (hero.fatherId == MAX_INT) {
            return parent;
        } else {
            parent = new Hero[](2);
            parent[0] = _heros[hero.fatherId];
            parent[1] = _heros[hero.motherId];
            return parent;
        }
    }

    function getChildren(uint256 index) external view returns (Hero[] memory) {
        require(index >= 0 && index < _heros.length, "index out of range");

        Hero storage hero = _heros[index];
        Hero[] memory children = new Hero[](hero.childrenIds.length);
        for (uint i = 0; i < hero.childrenIds.length; i += 1) {
            children[i] = _heros[hero.childrenIds[i]];
        }
        return children;
    }

    function getChildrenIdsWithParent(uint256 heroId1_, uint256 heroId2_) public view returns (uint256[] memory) {
        require(_heros[heroId1_].gender != _heros[heroId2_].gender, "Same gender");

        Hero storage hero1 = _heros[heroId1_];
        uint256 count = 0;
        uint256[] memory ret = new uint256[](hero1.childrenIds.length);
        count = 0;
        for (uint i = 0; i < hero1.childrenIds.length; i += 1) {
            if (findIndex(_heros[heroId2_].childrenIds, hero1.childrenIds[i]) >= _heros[heroId2_].childrenIds.length) {
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
