import { useEffect, useState } from 'react'
import {
  ethConnect,
  getEthBalance,
  getPrice,
  getRemainTokenCount,
  getMintedTokenCount,
  mintNFT,
} from 'utils/web3_api'
import contractConfig from 'contracts/config.json'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'

const wnd = window as any

interface Props {}

const Home1 = (props: Props) => {
  const [metamaskAccount, setMetamaskAccount] = useState('')
  const [price, setPrice] = useState(0)
  const [soldCount, setSoldCount] = useState(0)
  const [remainingCount, setRemainingCount] = useState(0)
  const [contractBalance, setContractBalance] = useState(0)
  const [web3, setWeb3] = useState<any>(null)
  const [accountBalance, setAccountBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [contract, setContract] = useState<any>(null)

  const connectMetamask = async (e: any) => {
    const connectRes = await ethConnect()
    if (connectRes) {
      setWeb3(connectRes.web3)
      setContract(connectRes.contract)
      const account = wnd.ethereum.selectedAddress
      setMetamaskAccount(account)

      getEthBalance(account).then(
        (res) => {
          setAccountBalance(res)
        },
        (err) => {}
      )
      getPrice().then(
        (res) => {
          setPrice(res)
        },
        (err) => {}
      )
      getRemainTokenCount().then(
        (res) => {
          setRemainingCount(res)
        },
        (err) => {}
      )
      getMintedTokenCount().then(
        (res) => {
          setSoldCount(res)
        },
        (err) => {}
      )
      getEthBalance(contractConfig.contractAddress).then(
        (res) => {
          setContractBalance(res)
        },
        (err) => {}
      )
    }
  }

  const setMint = () => {
    setLoading(true)
    mintNFT(metamaskAccount, price)
      .then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        }
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    connectMetamask(null)
  }, [])

  useEffect(() => {
    // NotificationManager.success('Success message', 'Title here')
    if (contract) {
      contract.events.MintedNewNFT({}, (error: any, event: any) => {
        console.log('event: ', error, event)
        if (error) {
          return
        }
        
        const msg = `Token ${event.returnValues} minted. ${event.remainCount} token${event.remainCount <= 1 ? '' : 's'} are available`
        NotificationManager.info(msg, 'Minted new NFT')
      })
    }
  }, [contract])

  return (
    <div className='home-page'>
      <h1 className='text-center'>NFT Minting Demo</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '0 40px',
        }}
      >
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='d-block btn btn-primary'
            onClick={connectMetamask}
          >
            Connect Metamask
          </button>
          <div className='btn btn-secondary'>
            {!web3 && (
              <>
                Please install{' '}
                <a
                  href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
                  target='_blank'
                >
                  Metamask
                </a>
              </>
            )}
            {web3 && <>Account: {metamaskAccount}</>}
          </div>
        </div>
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='btn btn-success'
            disabled={!metamaskAccount}
          >
            Account balance
          </button>
          <div className='btn btn-secondary'>{accountBalance}</div>
        </div>
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='btn btn-success'
            disabled={!metamaskAccount}
          >
            Price
          </button>
          <div className='btn btn-secondary'>{price}</div>
        </div>
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='btn btn-success'
            disabled={!metamaskAccount}
          >
            Sold
          </button>
          <div className='btn btn-secondary'>{soldCount}</div>
        </div>
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='btn btn-success'
            disabled={!metamaskAccount}
          >
            Remaining
          </button>
          <div className='btn btn-secondary'>{remainingCount}</div>
        </div>
        <div className='d-flex flex-column'>
          <button
            type='button'
            className='btn btn-success'
            disabled={!metamaskAccount}
          >
            Contract Balance
          </button>
          <div className='btn btn-secondary'>{contractBalance}</div>
        </div>
      </div>
      <div className='text-center mt-4 d-flex justify-content-center row'>
        <button
          type='button'
          className='btn btn-dark col-3 py-2'
          disabled={!metamaskAccount}
          onClick={setMint}
        >
          Mint random
        </button>
      </div>

      {loading && <Loader />}
    </div>
  )
}

export default Home1
