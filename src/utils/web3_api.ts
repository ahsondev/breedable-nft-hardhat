import Web3 from 'web3'
import contractConfig from 'contracts/config.json'
import StarNft from 'contracts/StarNft.json'

const wnd = window as any

let web3: any, contract: any

export const ethConnect = async () => {
  if (wnd.ethereum) {
    try {
      await wnd.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2A' }],
      });
    } catch (switchError: any) {
    }

    await wnd.ethereum.send('eth_requestAccounts')
    web3 = new Web3(Web3.givenProvider)
    connectToContract()
    return web3
  }
  return null
}

export const connectToContract = () => {
  contract = new web3.eth.Contract(StarNft.abi, contractConfig.contractAddress)
}

export const getEthBalance = (addr: string) => new Promise((resolve: (val: number) => void, reject: any) => {
  web3.eth.getBalance(addr).then((_balance: any) => {
    const balance = web3.utils.fromWei(_balance, 'ether')
    resolve(balance)
  }, (err: any) => {})
})

export const getPrice = () => new Promise((resolve: (val: number) => void, reject: any) => {
  if (!contract) {
    reject("Contract is not defined")
  }
  contract.methods.PRICE().call().then((res: any) => {
    resolve(web3.utils.fromWei(res, 'ether'))
  }, (err: any) => {})
})

export const getMintedTokenCount = () => new Promise((resolve: (val: number) => void, reject: any) => {
  if (!contract) {
    reject("Contract is not defined")
  }
  contract.methods.mintedTokenCount().call().then((res: any) => {
    resolve(res)
  }, (err: any) => {})
})

export const getRemainTokenCount = () => new Promise((resolve: (val: number) => void, reject: any) => {
  if (!contract) {
    reject("Contract is not defined")
  }
  contract.methods.remainTokenCount().call().then((res: any) => {
    resolve(res)
  }, (err: any) => {})
})

export const setMint = () => new Promise((resolve: (val: number) => void, reject: any) => {
  if (!contract) {
    reject("Contract is not defined")
  }
  contract.methods.remainTokenCount().call().then((res: any) => {
    resolve(res)
  }, (err: any) => {})
})


export function mintNFT(addr: string, mintPricePerToken: number, amount: number = 1) {
  const priceWei = web3.utils.toWei(mintPricePerToken * amount + "", "ether"); // Convert to wei value
  const tx = {
    'from': addr,
    'to': contractConfig.contractAddress,
    'gas': 500000,
    "value": priceWei,
    'maxPriorityFeePerGas': 1999999987,
    'data': contract.methods.requestRandomNFT(addr, amount).encodeABI()
  };

  web3.eth.sendTransaction(tx).then((e: any) => {
    console.log(e);
  });
}