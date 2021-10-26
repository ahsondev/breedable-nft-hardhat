const { expect } = require('chai')
const config = require('../config')
const ERC721Config = require('../metadata/temp/ERC721Config.json')

let owner, addr1, addr2, addr3
let Token
let hardhatToken

beforeEach(async function () {
  ;[owner, addr1, addr2, addr3] = await ethers.getSigners()
  Token = await ethers.getContractFactory('StarNft')

  hardhatToken = await Token.deploy(
    'https://gateway.pinata.cloud/ipfs/' + ERC721Config.metadataHash,
    // ERC721Config.tokenAmount,
    config.VRFContract.Kovan.VRFCoordinator,
    config.VRFContract.Kovan.LINKToken,
    config.VRFContract.Kovan.KeyHash
  )
})

describe('Token contract', function () {
  it('StarNft token test', async function () {
    const remainTokenCount = await hardhatToken.remainTokenCount()
    console.log("remainTokenCount: ", remainTokenCount)
    // expect(remainTokenCount).to.equal(ERC721Config.tokenAmount)
  })
  
  // it('Mint', async function() {
  //   const token = await hardhatToken.requestRandomNFT(owner.address, 1)
  //   const remainTokenAmount = await hardhatToken.remainTokenCount()
  //   expect(1).to.equal(1)
  // })
})
