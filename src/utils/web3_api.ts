import Web3 from 'web3'
import contractConfig from 'contracts/config.json'
import StarNft from 'contracts/StarNft.json'
import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import config from './config'

const wnd = window as any

let web3: any, contract: any


export const ethConnect = async () => {
  if (wnd.ethereum) {
    try {
      await wnd.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.networks[config.network].chainId }],
      })
    } catch (switchError: any) {}

    await wnd.ethereum.send('eth_requestAccounts')
    web3 = createAlchemyWeb3(config.networks[config.network].alchemyWssUrl)
    // web3 = new Web3('wss://eth-kovan.alchemyapi.io/v2/IROGTMfjIr-d3od_IUeYNDzpSVbMHQZY')
    console.log("provider: ", wnd.ethereum.selectedAddress)
    connectToContract()
    return {
      web3,
      contract
    }
  }
  return null
}

export const connectToContract = () => {
  contract = new web3.eth.Contract(StarNft.abi, contractConfig.contractAddress)
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

export const getPrice = () =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    if (!contract) {
      reject('Contract is not defined')
    }

    contract.methods
      .MINT_PRICE()
      .call()
      .then(
        (res: any) => {
          resolve(web3.utils.fromWei(res, 'ether'))
        },
        (err: any) => {}
      )
  })

export const getMintedTokenCount = () =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    if (!contract) {
      reject('Contract is not defined')
    }
    contract.methods
      .mintedTokenCount()
      .call()
      .then(
        (res: any) => {
          resolve(res)
        },
        (err: any) => {}
      )
  })

export const getRemainTokenCount = () =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    if (!contract) {
      reject('Contract is not defined')
    }
    contract.methods
      .remainTokenCount()
      .call()
      .then(
        (res: any) => {
          resolve(res)
        },
        (err: any) => {}
      )
  })

export const mintNFT = (
  addr: string,
  mintPricePerToken: number,
  amount: number = 1
) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }
    
    const priceWei = web3.utils.toWei(mintPricePerToken * amount + '', 'ether') // Convert to wei value
    console.log("mintPricePerToken: ", mintPricePerToken, priceWei)
    // contract.methods.requestRandomNFT(addr, amount).send({
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
      data: contract.methods.requestRandomNFT(addr, amount).encodeABI(),
    }

    web3.eth.sendTransaction(tx).then((e: any) => {
      resolve(e)
    }, (err: any) => {
      reject(err)
    })
  })

export const withdrawEth = (address: string) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }

    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: contract.methods.withdrawAll().encodeABI(),
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

export const setPause = (address: string, value: boolean) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }

    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: contract.methods.setPause(value + '').encodeABI(),
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

export const addWhiteList = (address: string, _address: string) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }

    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: contract.methods.addWhiteList(_address).encodeABI(),
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

export const removeWhiteList = (address: string, _address: string) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }
    
    const tx = {
      from: address,
      to: contractConfig.contractAddress,
      data: contract.methods.removeWhiteList(_address).encodeABI(),
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

export const isWhiteList = (address: string) =>
  new Promise((resolve, reject) => {
    if (!contract) {
      reject('Contract is not defined')
    }

    contract.methods
      .isWhiteList1()
      .call()
      .then(
        (res: any) => {
          console.log("whitelist: ", res)
          resolve(res)
        },
        (err: any) => {
          reject(err)
        }
      )
      .catch((err: any) => {
        console.log(err)
      })
  })
