const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  console.log('------')
  console.log('network name: ', hre.network.name)
  console.log('Deployer: ' + deployer)
  console.log('------')

  const BrainDanceNft = await ethers.getContractFactory('BrainDanceNft')
  const token = await BrainDanceNft.deploy("BrainDanceNFT", "BrainDance")

  const deployData = {
    contractAddress: token.address,
    tokenAmount: 10101,
    deployer: deployer.address
  }
  fs.writeFileSync('./src/contracts/config.json', JSON.stringify(deployData, null, 2))

  const contractJson = require('../artifacts/contracts/BrainDanceNft.sol/BrainDanceNft.json')
  fs.writeFileSync('./src/contracts/BrainDanceNft.json', JSON.stringify(contractJson.abi, null, 2))

  console.log('deployData:', deployData)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
