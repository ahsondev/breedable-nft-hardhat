const { expect } = require('chai')

describe('Token contract', function () {
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const [owner] = await ethers.getSigners()

    const Token = await ethers.getContractFactory('Token')

    const hardhatToken = await Token.deploy()
    // await hardhatToken.transfer(0xead9c93b79ae7c1591b1fb5323bd777e86e150d4, 10)
    const ownerBalance = await hardhatToken.balanceOf(owner.address)
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
  })
})
