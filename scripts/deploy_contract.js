const hre = require("hardhat")

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
      VRFCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";
      LinkToken = "0xa36085F69e2889c224210F603D836748e7dC0088";
      keyhash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
      break
    }

    default:
      break
  }

  console.log("------")
  console.log("network name: ", hre.network.name)
  console.log("Deployer: " + deployer);
  console.log("uri: " + contractUri);
  console.log("name: " + contractName);
  console.log("symbol: " + contractSymbol);
  console.log('tokenAmount: ', tokenAmount);
  console.log("------")

  const StarNft = await ethers.getContractFactory('StarNft')
  const token = await StarNft.deploy(
    baseMetadataUri,
    tokenAmount,
    VRFCoordinator,
    LinkToken,
    keyhash
  )

  console.log('Token address:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
