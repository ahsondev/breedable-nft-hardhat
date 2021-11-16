const hre = require('hardhat')
const fs = require('fs-extra')
const ERC721Config = require('../metadata/temp/ERC721Config.json')

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const { account0 } = await getNamedAccounts();

  console.log('Deploying contracts with the account:', account0)

  console.log('------')
  console.log('network name: ', hre.network.name)
  console.log('Deployer: ' + account0)
  console.log('------')

  const baseUri = ERC721Config.gatewayUrl + ERC721Config.metadataHash + '/'
  const token = await deploy('BrainDanceNft', {
    from: account0,
    args: ["Brain Dance", "BrainDance", baseUri],
    log: true,
  });

  const deployData = {
    contractAddress: token.address,
    tokenAmount: 10101,
    deployer: account0
  }
  fs.writeFileSync('./src/contracts/config.json', JSON.stringify(deployData, null, 2))

  const contractJson = require('../artifacts/contracts/BrainDanceNft.sol/BrainDanceNft.json')
  fs.writeFileSync('./src/contracts/BrainDanceNft.json', JSON.stringify(contractJson.abi, null, 2))

  console.log('deployData:', deployData)
}

module.exports.tags = ['BrainDanceNft'];