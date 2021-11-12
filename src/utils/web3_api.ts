import Web3 from 'web3'
import contractConfig from 'contracts/config.json'
import BrainDanceNft from 'contracts/BrainDanceNft.json'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import config from './config'

const wnd = window as any

let web3: any

export class BrainDance {
  nativeContract: any = null

  mintNFT(addr: string, mintPricePerToken: number, amount: number = 1 ) {
    const priceWei = web3.utils.toWei(mintPricePerToken * amount + '', 'ether') // Convert to wei value
    console.log('mintPricePerToken: ', mintPricePerToken, priceWei)
    // this.nativeContract.methods.requestRandomNFT(addr, amount).send({
    //   from: addr,
    //   value: priceWei,
    // }).then((res: any) => {
    //   resolve(res)
    // }, (err: any) => {
    //   reject(err)
    // })

    // real gas = gas * maxPriorityFeePerGas / 10^18
    const tx = {
      from: addr,
      to: contractConfig.contractAddress,
      // gas: 50000, // 500 000 gas
      value: priceWei,
      // maxPriorityFeePerGas: 1999999987, // 199...987 wei
      data: this.nativeContract.methods.requestRandomNFT(addr, amount).encodeABI(),
    }

    return web3.eth.sendTransaction(tx)
  }

  withdrawEth(address: string) {
    new Promise((resolve, reject) => {
      const tx = {
        from: address,
        to: contractConfig.contractAddress,
        data: this.nativeContract.methods.withdrawAll().encodeABI(),
      }
      web3.eth.sendTransaction(tx).then((e: any) => {
        console.log(e)
        resolve(e)
      })
      web3.eth.accounts.signTransaction(
        tx,
        process.env.REACT_APP_ACCOUNT_PRIVATE_KEY
      )
    })
  }

  setPause (address: string, value: boolean) {
    new Promise((resolve, reject) => {
      const tx = {
        from: address,
        to: contractConfig.contractAddress,
        data: this.nativeContract.methods.setPause(value + '').encodeABI(),
      }
      web3.eth.sendTransaction(tx).then((e: any) => {
        console.log(e)
        resolve(e)
      })
      web3.eth.accounts.signTransaction(
        tx,
        process.env.REACT_APP_ACCOUNT_PRIVATE_KEY
      )
    })
  }

  addWhiteList(address: string, _address: string) {
    new Promise((resolve, reject) => {
      if (!contract) {
        reject('Contract is not defined')
      }

      const tx = {
        from: address,
        to: contractConfig.contractAddress,
        data: this.nativeContract.methods.addWhiteList(_address).encodeABI(),
      }
      web3.eth.sendTransaction(tx).then((e: any) => {
        console.log(e)
        resolve(e)
      })
      web3.eth.accounts.signTransaction(
        tx,
        process.env.REACT_APP_ACCOUNT_PRIVATE_KEY
      )
    })
  }

  removeWhiteList(address: string, _address: string) {
    new Promise((resolve, reject) => {
      if (!contract) {
        reject('Contract is not defined')
      }

      const tx = {
        from: address,
        to: contractConfig.contractAddress,
        data: this.nativeContract.methods.removeWhiteList(_address).encodeABI(),
      }

      web3.eth.sendTransaction(tx).then((e: any) => {
        resolve(e)
        console.log(e)
      })

      web3.eth.accounts.signTransaction(
        tx,
        process.env.REACT_APP_ACCOUNT_PRIVATE_KEY
      )
    })
  }
}

let contract: BrainDance

export const connectToWallet = async () => {
  try {
    if (wnd.ethereum) {
      await wnd.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.networks[config.network].chainId }],
      })

      await wnd.ethereum.send('eth_requestAccounts')
      web3 = createAlchemyWeb3(config.networks[config.network].alchemyWssUrl)
      // web3 = new Web3('wss://eth-kovan.alchemyapi.io/v2/IROGTMfjIr-d3od_IUeYNDzpSVbMHQZY')
      console.log('provider: ', wnd.ethereum.selectedAddress)
      contract.nativeContract = connectToContract()
      return {
        web3,
        contract,
      }
    }
  } catch (switchError) {}

  return null
}

export const connectToContract = () => {
  const contract = new web3.eth.Contract(
    BrainDanceNft,
    contractConfig.contractAddress
  )
  return contract
}

export const getEthBalance = (addr: string) =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    web3.eth.getBalance(addr).then(
      (_balance: any) => {
        const balance = web3.utils.fromWei(_balance, 'ether')
        resolve(balance)
      },
      (err: any) => {}
    )
  })
