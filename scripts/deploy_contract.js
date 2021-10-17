const hre = require('hardhat')
const fs = require('fs')
const config = require('../config')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())

  const ERC721Config = require('../metadata/temp/ERC721Config.json')
  const contractconfig = require('../metadata/temp/contracturi.json')
  const baseMetadataUri = ERC721Config.gatewayUrl + '/' + ERC721Config.metadataHash + '/'
  const contractUri = ERC721Config.gatewayUrl + '/' + ERC721Config.contractUriHash
  const contractName = contractconfig.name
  const contractSymbol = contractconfig.symbol
  const tokenAmount = ERC721Config.tokenAmount

  let VRFCoordinator, LinkToken, keyhash

  switch (hre.network.name) {
    case 'kovan': {
      VRFCoordinator = config.VRFContract.Kovan.VRFCoordinator
      LinkToken = config.VRFContract.Kovan.LINKToken
      keyhash = config.VRFContract.Kovan.KeyHash
      break
    }

    default:
      break
  }

  console.log('------')
  console.log('network name: ', hre.network.name)
  console.log('Deployer: ' + deployer)
  console.log('uri: ' + contractUri)
  console.log('name: ' + contractName)
  console.log('symbol: ' + contractSymbol)
  console.log('tokenAmount: ', tokenAmount)
  console.log('------')

  const StarNft = await ethers.getContractFactory('StarNft')
  const token = await StarNft.deploy(
    baseMetadataUri,
    tokenAmount,
    VRFCoordinator,
    LinkToken,
    keyhash
  )

  const deployData = {
    contractAddress: token.address,
    baseMetadataUri,
    tokenAmount,
    deployer: deployer.address
  }
  fs.writeFileSync('./src/contracts/config.json', JSON.stringify(deployData, null, 2))

  const contractJson = require('../artifacts/contracts/StarNft.sol/StarNft.json')
  fs.writeFileSync('./src/contracts/StarNft.json', JSON.stringify(contractJson, null, 2))

  console.log('Token address:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
