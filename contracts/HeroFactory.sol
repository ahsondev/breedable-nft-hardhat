// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HeroFactory {
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
        // last child
        uint256 lactChildId;
        // prev brother Id
        uint256 prevBrotherId;
    }

    Hero[] internal _heros;

    constructor() {}

    function _mintHero(uint256 dna) internal returns (uint256) {
        _heros.push(_createHero(dna));
        return _heros.length - 1;
    }

    function _breedHero(uint256 heroId1_, uint256 heroId2_) internal returns (uint256) {
        Hero storage hero1 = _heros[heroId1_];
        Hero storage hero2 = _heros[heroId2_];
        require(hero1.gender != hero2.gender, "Same gender");
        Hero memory hero = _createHero(2);
        hero.fatherId = hero1.gender == 0 ? heroId1_ : heroId2_;
        hero.motherId = hero1.gender == 0 ? heroId2_ : heroId1_;
        _heros.push(hero);
        return _heros.length - 1;
    }

    function _createHero(uint256 dna) internal pure returns (Hero memory) {
        return Hero(
            (uint8)(dna % 32),
            (uint8)(dna % 8),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 10),
            (uint8)(dna % 2),
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
    }
}
