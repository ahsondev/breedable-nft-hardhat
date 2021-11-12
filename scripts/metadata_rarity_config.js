const weights = {
  Eyes: [
    { name: 'Regular Blue', weight: 8 },
    { name: 'Regular Green', weight: 8 },
    { name: 'Regular Orange', weight: 8 },
    { name: 'Regular Purple', weight: 8 },
    { name: 'Regular Red', weight: 8 },
    { name: 'Regular Yellow', weight: 8 },
    { name: 'Cybernetics Blue', weight: 5 },
    { name: 'Cybernetics Green', weight: 5 },
    { name: 'Cybernetics Orange', weight: 5 },
    { name: 'Cybernetics Purple', weight: 5 },
    { name: 'Cybernetics Red', weight: 5 },
    { name: 'Cybernetics Yellow', weight: 5 },
    { name: 'Laser Eyes', weight: 3 },
    { name: 'GhostInTheShell', weight: 10 },
    { name: 'Bitcorn', weight: 5 },
    { name: 'Eth coin', weight: 8 },
    { name: 'baked', weight: 7 },
  ],
  Glasses: [
    { name: 'None', weight: 35 },
    { name: 'Matrix', weight: 5 },
    { name: 'VR', weight: 3 },
    { name: 'Cyberpunk', weight: 8 },
    { name: 'Nerdy', weight: 10 },
    { name: 'Versace', weight: 3 },
    { name: 'Dieselpunk', weight: 5 },
    { name: 'Smart Cyberpunk', weight: 5 },
    { name: 'Steampunk', weight: 5 },
    { name: 'Raven', weight: 7 },
    { name: 'AR', weight: 5 },
    { name: 'Cyberpunk wires', weight: 3 },
    { name: 'Cyborg', weight: 5 },
    { name: 'Hololens', weight: 3 },
    { name: 'Mirror', weight: 3 },
  ],
  Mouth: [
    { name: 'Excited_1', weight: 10 },
    { name: 'Cool_2', weight: 9 },
    { name: 'Irritated_3', weight: 8 },
    { name: 'Smiling_4', weight: 7 },
    { name: 'Angry Teeth_5', weight: 7 },
    { name: 'Angry Teeths_6', weight: 6 },
    { name: 'Jackpot_7', weight: 10 },
    { name: 'Chisel_8', weight: 5 },
    { name: 'Delicious_9', weight: 10 },
    { name: 'Oof_10', weight: 10 },
    { name: 'Ouch_11', weight: 10 },
    { name: 'Tongue out_14', weight: 10 },
    { name: 'Excited', weight: 10 },
  ],
  'Facial Costume': [
    { name: 'None', weight: 30 },
    { name: 'Blue Line', weight: 15 },
    { name: 'Red Line', weight: 15 },
    { name: 'Robobrain', weight: 5 },
    { name: 'Robojaw', weight: 3 },
    { name: 'Skulljaw', weight: 3 },
    { name: 'Samurai Hat', weight: 10 },
    { name: 'Brainhat', weight: 8 },
    { name: 'Exposed Human Brain', weight: 5 },
    { name: 'Tron', weight: 3 },
    { name: 'Tinfoil', weight: 8 },
  ],
  Body: [{ name: 'Male', weight: 50 }, { name: 'Female', weight: 50 }],
  'Male Hair': [
    { name: 'None', weight: 10 },
    { name: 'Chain', weight: 2 },
    { name: 'Dreads', weight: 5 },
    { name: 'Black Fade', weight: 5 },
    { name: 'Orange Fade', weight: 5 },
    { name: 'Purple Fade', weight: 5 },
    { name: 'Green Fade', weight: 5 },
    { name: 'Blue Fade', weight: 5 },
    { name: 'White Fade', weight: 5 },
    { name: 'Black Flattop', weight: 5 },
    { name: 'Orange Flattop', weight: 5 },
    { name: 'Purple Flattop', weight: 5 },
    { name: 'Green Flattop', weight: 5 },
    { name: 'Blue Flattop', weight: 5 },
    { name: 'White Flattop', weight: 5 },
    { name: 'Geralt', weight: 3 },
    { name: 'Goon', weight: 3 },
    { name: 'Black Mohawk', weight: 5 },
    { name: 'Orange Mohawk', weight: 5 },
    { name: 'Purple Mohawk', weight: 5 },
    { name: 'Green Mohawk', weight: 5 },
    { name: 'Blue Mohawk', weight: 5 },
    { name: 'White Mohawk', weight: 5 },
    { name: 'Mullet', weight: 8 },
    { name: 'Naruto', weight: 5 },
    { name: 'Saiyan', weight: 3 },
    { name: 'White Beaded', weight: 8 },
    { name: 'Yellow Banana', weight: 2 },
    { name: 'Orange Banana', weight: 2 },
    { name: 'Purple Banana', weight: 2 },
    { name: 'Green Banana', weight: 2 },
    { name: 'Blue Banana', weight: 2 },
    { name: 'White Banana', weight: 2 },
  ],
  'Female Hair': [
    { name: 'None', weight: 2 },
    { name: 'Asari', weight: 2 },
    { name: 'Cyberpunk_White', weight: 10 },
    { name: 'Geisha', weight: 10 },
    { name: 'HarleyQuinn', weight: 3 },
    { name: 'Padme', weight: 3 },
    { name: 'Panam Black', weight: 5 },
    { name: 'Panam Brown', weight: 5 },
    { name: 'Panam Blonde', weight: 5 },
    { name: 'Panam Red Hair', weight: 5 },
    { name: 'Panam Purple', weight: 5 },
    { name: 'Panam Blue', weight: 5 },
    { name: 'Saiyan', weight: 3 },
    { name: 'Scarlett Black', weight: 5 },
    { name: 'Scarlett Brown', weight: 5 },
    { name: 'Scarlett Blonde', weight: 5 },
    { name: 'Scarlett Red', weight: 5 },
    { name: 'Scarlett Blue', weight: 5 },
    { name: 'Scarlett Purple', weight: 5 },
    { name: 'V Black', weight: 5 },
    { name: 'V Brown', weight: 5 },
    { name: 'V Blonde', weight: 5 },
    { name: 'V Blue', weight: 5 },
    { name: 'V Red', weight: 5 },
    { name: 'V Purple', weight: 5 },
    { name: 'White Beaded', weight: 5 },
    { name: 'Black Beaded', weight: 5 },
    { name: 'Brown Beaded', weight: 5 },
    { name: 'Blonde Beaded', weight: 5 },
    { name: 'Blue Beaded', weight: 5 },
    { name: 'Red Beaded', weight: 5 },
    { name: 'Purple Beaded', weight: 5 },
  ],
  Beard: [
    { name: 'None', weight: 50 },
    { name: 'Goatee', weight: 10 },
    { name: 'Joe Exotic', weight: 3 },
    { name: 'Professor', weight: 8 },
    { name: 'Swanson', weight: 10 },
    { name: 'Santa', weight: 3 },
    { name: 'Viking', weight: 5 },
    { name: 'Wizard', weight: 3 },
  ],
  Makeup: [
    { name: 'None', weight: 60 },
    { name: 'Blue Skin + Red Makeup', weight: 3 },
    { name: 'Makeup Bubbles', weight: 5 },
    { name: 'Makeup Hand', weight: 15 },
    { name: 'Makeup Arm', weight: 15 },
    { name: 'Black + Gold Male', weight: 3 },
    { name: 'Black + Gold Female', weight: 3 },
    { name: 'Blue UV', weight: 7 },
    { name: 'Horizon', weight: 3 },
    { name: 'God of War', weight: 3 },
    { name: 'Spidey', weight: 3 },
  ],
  'Skin Color': [
    { name: 'Female - Regular', weight: 60 },
    { name: 'Female - Black', weight: 15 },
    { name: 'Female - Black and White', weight: 3 },
    { name: 'Female - Blue', weight: 5 },
    { name: 'Female - Galaxy', weight: 3 },
    { name: 'Female - Green', weight: 3 },
    { name: 'Female - Halfcolor', weight: 5 },
    { name: 'Female - Hex', weight: 10 },
    { name: 'Female - Purple', weight: 3 },
    { name: 'Female - Rainbow', weight: 2 },
    { name: 'Female - Red', weight: 3 },
    { name: 'Female - Pale White', weight: 10 },
    { name: 'Male - Regular', weight: 60 },
    { name: 'Male - Black', weight: 15 },
    { name: 'Male - Black and White', weight: 3 },
    { name: 'Male - Blue', weight: 5 },
    { name: 'Male - Galaxy', weight: 3 },
    { name: 'Male - Green', weight: 3 },
    { name: 'Male - Halfcolor', weight: 5 },
    { name: 'Male - Hex', weight: 10 },
    { name: 'Male - Purple', weight: 3 },
    { name: 'Male - Rainbow', weight: 2 },
    { name: 'Male - Red', weight: 3 },
    { name: 'Male - Pale White', weight: 10 },
  ],
  Mods: [
    { name: 'None', weight: 50 },
    { name: 'Cyber Ears', weight: 10 },
    { name: 'Mantis Blades', weight: 5 },
    { name: 'Missile', weight: 3 },
    { name: 'Roboarm Left', weight: 15 },
    { name: 'Roboarm Right Female', weight: 15 },
    { name: 'Roboarms both Female', weight: 5 },
    { name: 'Roboarms both Male', weight: 5 },
    { name: 'Roboarm Right Male', weight: 15 },
    { name: 'Roboleg Left', weight: 15 },
    { name: 'Roboleg Right', weight: 15 },
    { name: 'Robolegs both', weight: 5 },
    { name: 'Exoskeleton', weight: 3 },
    { name: 'Silverhand', weight: 3 },
  ],
  'Primary Role': [
    { name: 'Soldier', weight: 15 },
    { name: 'Engineer', weight: 15 },
    { name: 'Adept', weight: 15 },
    { name: 'Assassin', weight: 15 },
    { name: 'Sentinel', weight: 15 },
    { name: 'Vanguard', weight: 15 },
  ],
  'Secondary Role': [
    { name: 'Attorney General', weight: 15 },
    { name: 'Scientist', weight: 15 },
    { name: 'Resource Trader', weight: 15 },
    { name: 'Immigration Officer', weight: 15 },
    { name: 'Financer', weight: 15 },
    { name: 'Politician', weight: 15 },
  ],
  Weapon: [
    { name: 'Handgun', weight: 15 },
    { name: 'Rifle', weight: 15 },
    { name: '3 Barrel Handgun', weight: 15 },

    { name: 'Handgun - 2', weight: 15 },
    { name: 'Laser Sword', weight: 15 },

    { name: 'Grenade Launcher', weight: 15 },
    { name: 'Flying Dagger', weight: 15 },
    { name: 'Trident', weight: 15 },

    { name: 'Knife', weight: 15 },
    { name: 'Katana', weight: 15 },

    { name: 'Light Handgun', weight: 15 },
    { name: 'BowArrow', weight: 15 },

    { name: 'Shotgun', weight: 15 },
  ],
  'Special Ability': [
    { name: 'CryptoScan', weight: 50 },
    { name: 'Biotic', weight: 50 },
  ],
  'Female Suit': [
    { name: '3', weight: 15 },
    { name: '8', weight: 15 },
    { name: '11', weight: 15 },
    { name: '12', weight: 15 },
    { name: "Major's Suit", weight: 15 },

    { name: 'Blackcoat', weight: 15 },
    { name: "Miranda's Suit", weight: 15 },
    { name: 'Asari', weight: 15 },

    { name: '10', weight: 15 },
    { name: 'Golden Armor', weight: 15 },
    { name: 'Tron', weight: 15 },
    { name: 'WhiteCoat', weight: 15 },

    { name: '1', weight: 15 },
    { name: '4', weight: 15 },
    { name: '7', weight: 15 },
    { name: 'CP2077', weight: 15 },
    { name: 'Assassin', weight: 15 },
    { name: 'Storm Shaw', weight: 15 },
    { name: 'No Sleeve', weight: 15 },

    { name: '6', weight: 15 },
    { name: 'Ex Machina', weight: 15 },
    { name: 'NeoPunk', weight: 15 },
    { name: 'Pinup', weight: 15 },
    { name: 'CP Shorts', weight: 15 },
    { name: '2', weight: 15 },

    { name: '5', weight: 15 },
    { name: 'Metalic Suit', weight: 15 },
    { name: 'Body Suit', weight: 15 },
    { name: 'Body Suit Leggings', weight: 15 },
    { name: 'Formal Suit', weight: 15 },
  ],
  'Male Suit': [
    { name: '1 Men', weight: 15 },
    { name: '3 Men', weight: 15 },
    { name: '10 Men', weight: 15 },
    { name: '11 Men', weight: 15 },
    { name: 'CP2077 Men', weight: 15 },

    { name: '7 Men', weight: 15 },
    { name: '8 Men', weight: 15 },
    { name: 'Engineer Men', weight: 15 },
    { name: 'Second Engineer Men', weight: 15 },

    { name: '4 Men', weight: 15 },
    { name: 'Tron Men', weight: 15 },
    { name: 'Dis Men', weight: 15 },

    { name: '2 Men', weight: 15 },
    { name: '9 Men', weight: 15 },
    { name: 'Mafia Suit', weight: 15 },
    { name: 'Assassin Cape', weight: 15 },
    { name: 'Dis 2 Men', weight: 15 },

    { name: 'Tron no ring Men', weight: 15 },
    { name: 'Ex machina Men', weight: 15 },
    { name: 'Exohands Men', weight: 15 },
    { name: 'Boxer Men', weight: 15 },
    { name: 'Johnny Men', weight: 15 },

    { name: '6 Men', weight: 15 },
    { name: 'Neon Men', weight: 15 },
    { name: 'Formal Men', weight: 15 },
    { name: 'Cape Mouse Men', weight: 15 },
    { name: '3', weight: 15 },
    { name: 'General Men', weight: 15 },
  ],
  Stance: [
    { name: 'Hexacon', weight: 15 },
    { name: 'Hexacon 3D', weight: 15 },
    { name: "McDonald's Logo", weight: 15 },
    { name: '3', weight: 15 },
    { name: 'In BW', weight: 15 },
    { name: 'Out BW', weight: 15 },
    { name: 'Bitcorn Stance', weight: 15 },
    { name: 'Etherum Stance', weight: 15 },
    { name: 'Blackhole', weight: 15 },
    { name: 'Game over', weight: 15 },
    { name: 'The grid', weight: 15 },
    { name: 'Ying Yang', weight: 15 },
    { name: 'Portal', weight: 15 },
    { name: 'Bubble', weight: 15 },
  ],
  Background: [
    { name: 'DMT', weight: 10 },
    { name: 'Circuit', weight: 20 },
    { name: 'Cube', weight: 10 },
    { name: 'Cyberpunk City', weight: 25 },
    { name: 'Glitched Heaven', weight: 15 },
    { name: 'Halfcircle', weight: 10 },
    { name: 'Halo', weight: 25 },
    { name: 'Out BW BG', weight: 8 },
    { name: 'In BW BG', weight: 8 },
    { name: 'Matrix', weight: 2 },
    { name: 'Neonhall', weight: 8 },
    { name: 'Psychedelic', weight: 8 },
    { name: 'Screens', weight: 15 },
    { name: 'Spacetrip', weight: 7 },
    { name: 'Starzoom', weight: 15 },
    { name: 'Trippy', weight: 7 },
    { name: 'Wires', weight: 9 },
    { name: 'UpsideDown', weight: 20 },
  ],
}

const traitSequence = [
  'Background',
  'Stance',
  'Body',
  'Makeup',
  'Eyes',
  'Male Hair',
  'Female Hair',
  'Facial Costume',
  'Mouth',
  'Beard',
  'Glasses',
  'Male Suit',
  'Female Suit',
  'Mods',
  'Weapon',
  'Offhand/special weapon (edited)',
]

const prime = [
  281, 283, 293, 307, 311, 313, 317, 331, 337, 347,
  349, 353, 359, 367, 373, 379, 383, 389, 397, 401,
  409, 419, 421, 431, 433, 439, 443, 449, 457, 461,
  463, 467, 479, 487, 491, 499, 503, 509, 521, 523,
  541, 547, 557, 563, 569, 571, 577, 587, 593, 599,
  601, 607, 613, 617, 619, 631, 641, 643, 647, 653,
  659, 661, 673, 677, 683, 691, 701, 709, 719, 727,
  733, 739, 743, 751, 757, 761, 769, 773, 787, 797,
  809, 811, 821, 823, 827, 829, 839, 853, 857, 859,
  863, 877, 881, 883, 887, 907, 911, 919, 929, 937,
  941, 947, 953, 967, 971, 977, 983, 991, 997
]

const godMetadata = {
  name: 'NeuroDance #00000',
  external_url: 'https://api.neurodance.io/metadata/00000.json',
  image: 'https://api.neurodance.io/dancers/00000.png',
  description: 'One of 10101 rare and powerful experiences!\nJoin us: https://discord.gg/neurodance',
  attributes: [
    {
      trait_type: 'Background',
      value: 'Lucid'
    },
    {
      trait_type: 'Stance',
      value: 'Portal'
    },
    {
      trait_type: 'Body',
      value: 'Male'
    },
    {
      trait_type: 'Skin',
      value: 'Gold'
    },
    {
      trait_type: 'Makeup',
      value: 'Matrix_Guy'
    },
    {
      trait_type: 'Eyes',
      value: 'Illuminati'
    },
    {
      trait_type: 'Hair',
      value: 'Bald_Guy'
    },
    {
      trait_type: 'Mouth',
      value: 'chisel_8'
    },
    {
      trait_type: 'Facial Costume',
      value: 'Lucid_Helmet'
    },
    {
      trait_type: 'Beard',
      value: 'None'
    },
    {
      trait_type: 'Glasses',
      value: 'None'
    },
    {
      trait_type: 'Guy clothes',
      value: 'Lucid_Suit'
    },
    {
      trait_type: 'Mods',
      value: 'None'
    },
    {
      trait_type: 'Weapon hand',
      value: 'Open'
    },
    {
      trait_type: 'Weapon',
      value: 'None'
    },
    {
      trait_type: 'Special Weapon',
      value: 'None'
    },
    {
      trait_type: 'psychology',
      value: 'INTJ'
    },
    {
      trait_type: 'dating_trait',
      value: 'None'
    }
  ],
}

const preDefinedTraits = ['Body', 'Primary Role']

const exclusiveTraits = {
  Body: {
    Male: ['Female Hair', 'Female Suit'],
    Female: ['Male Hair', 'Beard', 'Male Suit']
  }
}

const exclusivePrimaryRole = {
  Soldier: {
    Weapon: ['Handgun', 'Rifle', '3 barrel handgun'],
    'Special Weapon': ['CryptoScan'],
    'Female Suit': ['#3', '#8 No Helmet', '#11', '#12', "Major's suit"],
    'Male Suit': ['#1', '#3 Same as #8 Female', '#10 First row, second on the', '#11', 'Cyberpunk 2077'],
    'Suit Color': ['Black', 'Grey', 'Silver', 'Gold']
  },
  Engineer: {
    Weapon: ['Handgun', 'Handgun #2', 'Laser sword'],
    'Special Weapon': ['CryptoScan'],
    'Female Suit': ['This one', 'Miranda Lawson', 'This suit'],
    'Male Suit': ['#7', '#8', 'Engineer suit', 'Second eng suit'],
    'Suit Color': ['Matt Black', 'Shiney Black', 'White']
  },
  Adept: {
    Weapon: ['Handgun', 'Grenade Launcher', 'Flying dagger', 'Trident'],
    'Special Weapon': ['CryptoScan', 'Biotic'],
    'Female Suit': ['#10', '#4 the second ones from left', '#11', '#12', "Major's suit"],
    'Male Suit': ['#1', '#3 Same as #8 Female', '#10 First row, second on the', '#11', 'Cyberpunk 2077'],
    'Suit Color': ['Black', 'Grey', 'Silver', 'Gold']
  },
  Assassin: {
    Weapon: ['Handgun', 'Rifle', '3 barrel handgun'],
    'Special Weapon': ['CryptoScan'],
    'Female Suit': ['#3', '#8 No Helmet', '#11', '#12', "Major's suit"],
    'Male Suit': ['#1', '#3 Same as #8 Female', '#10 First row, second on the', '#11', 'Cyberpunk 2077'],
    'Suit Color': ['Black', 'Grey', 'Silver', 'Gold']
  },
  Sentinel: {
    Weapon: ['Handgun', 'Rifle', '3 barrel handgun'],
    'Special Weapon': ['CryptoScan'],
    'Female Suit': ['#3', '#8 No Helmet', '#11', '#12', "Major's suit"],
    'Male Suit': ['#1', '#3 Same as #8 Female', '#10 First row, second on the', '#11', 'Cyberpunk 2077'],
    'Suit Color': ['Black', 'Grey', 'Silver', 'Gold']
  },
  Vanguard: {
    Weapon: ['Handgun', 'Rifle', '3 barrel handgun'],
    'Special Weapon': ['CryptoScan'],
    'Female Suit': ['#3', '#8 No Helmet', '#11', '#12', "Major's suit"],
    'Male Suit': ['#1', '#3 Same as #8 Female', '#10 First row, second on the', '#11', 'Cyberpunk 2077'],
    'Suit Color': ['Black', 'Grey', 'Silver', 'Gold']
  },
}

module.exports = {
  weights,
  traitSequence,
  prime,
  godMetadata,
  preDefinedTraits,
  exclusiveTraits,
  exclusivePrimaryRole
}
