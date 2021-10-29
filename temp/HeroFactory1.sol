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

        // // last child
        // uint256[] lastChildId;
        // // prev brother Id
        // uint256 prevBrotherFatherId;
        // uint256 prevBrotherMotherId;
    }

    Hero[] internal _heros;

    constructor() {}

    function _mintHero(uint256 dna) internal returns (uint256) {
        _heros.push(_createHero(dna));
        return _heros.length - 1;
    }

    function _breedHero(uint256 heroId1_, uint256 heroId2_) internal returns (uint256) {
        require(_heros[heroId1_].gender != _heros[heroId2_].gender, "Same gender");
        Hero storage hero1;
        Hero storage hero2;
        if (hero1.gender == 0) {
            hero1 = _heros[heroId1_];
            hero2 = _heros[heroId2_];
        } else {
            hero1 = _heros[heroId2_];
            hero2 = _heros[heroId1_];
        }

        uint256 seed = (hero1.psychologicalTrait + 1) * (hero1.datingTrait + 1)
            + (hero2.psychologicalTrait + 1) * (hero2.datingTrait + 1)
            + (hero1.psychologicalTrait + 1) * (hero2.datingTrait + 1);
        Hero memory hero = _createHero(uint(keccak256(abi.encodePacked(seed))));
        uint256 newId = _heros.length;


        hero.fatherId = heroId1_;
        hero.motherId = heroId2_;
        // hero.prevBrotherFatherId = hero1.lastChildId;
        // hero.prevBrotherMotherId = hero2.lastChildId;
        // hero1.lastChildId = newId;
        // hero2.lastChildId = newId;
        _heros.push(hero);

        hero1.childrenIds.push(newId);
        hero2.childrenIds.push(newId);
        return _heros.length - 1;
    }

    function _createHero(uint256 dna) internal pure returns (Hero memory) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return Hero(
            (uint8)(dna % 32),
            (uint8)((uint(keccak256(abi.encodePacked(dna.toString())))) % 8),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 1).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 2).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 3).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 4).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 5).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 6).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 7).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 8).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 9).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 10).toString())))) % 10),
            (uint8)((uint(keccak256(abi.encodePacked((dna + 11).toString())))) % 2),
            0,
            0,
            0,
            uint256(-1),
            uint256(-1),
            uint256(-1),
            uint256(-1),
            uint256(-1)
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
        if (hero.fatherId == uint256(-1)) {
            return parent;
        } else {
            parent = new Hero[](2);
            parent[0] = _heros[hero.fatherId];
            parent[1] = _heros[hero.motherId];
            return parent;
        }
    }

    // function getChildrenIds(uint256 index) public view returns (uint256[] memory) {
    //     require(index >= 0 && index < _heros.length, "index out of range");

    //     Hero storage hero = _heros[index];
    //     uint256[] storage ids;
    //     if (hero.lastChildId == uint256(-1)) {
    //         return ids;
    //     }
    //     ids.push(hero.lastChildId);
    //     if (hero.gender == 0)
    //     {
    //         // we should follow brothers that have same father
    //         while (hero.prevBrotherFatherId != uint256(-1)) {
    //             ids.push(hero.prevBrotherFatherId);
    //             hero = _heros[hero.prevBrotherFatherId];
    //         }
    //     } else {
    //         // we should follow brothers that have same mother
    //         while (hero.prevBrotherMotherId != uint256(-1)) {
    //             ids.push(hero.prevBrotherMotherId);
    //             hero = _heros[hero.prevBrotherMotherId];
    //         }
    //     }
    //     Hero[] memory ret = new Hero[](ids.length);
    //     for (uint i = ids.length - 1; i >= 0; i -= 1) {
    //         ret[ids.length -1 - i] = ids[i];
    //     }
    //     return ret;
    // }
}
