const hre = require('hardhat')
const fs = require('fs-extra')

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const { account0 } = await getNamedAccounts();

  console.log('Deploying contracts with the account:', account0)

  console.log('------')
  console.log('network name: ', hre.network.name)
  console.log('Deployer: ' + account0)
  console.log('------')

  const baseUri = process.env.BASE_URI
  const token = await deploy('BrainDanceNft', {
    from: account0,
    args: ["BD 1129", "BD1129", baseUri],
    log: true,
  });

  const deployData = {
    contractAddress: token.address,
    tokenAmount: 10101,
    deployer: account0
  }
  fs.writeFileSync('./export/contracts/config.json', JSON.stringify(deployData, null, 2))

  const contractJson = require('../artifacts/contracts/BrainDanceNft.sol/BrainDanceNft.json')
  fs.writeFileSync('./export/contracts/BrainDanceNft.json', JSON.stringify(contractJson.abi, null, 2))

  console.log('deployData:', deployData)
}

module.exports.tags = ['BrainDanceNft'];
