import { useEffect, useState } from 'react'
import { ethConnect, getEthBalance, getPrice, getRemainTokenCount, getMintedTokenCount } from 'utils/web3_api'
import contractConfig from 'contracts/config.json'
import Loader from 'components/Loader'

interface Props {
}

const Home = (props: Props) => {
  const [ metamaskAccount, setMetamaskAccount ] = useState('')
  const [ price, setPrice ] = useState(0)
  const [ soldCount, setSoldCount ] = useState(0)
  const [ remainingCount, setRemainingCount ] = useState(0)
  const [ contractBalance, setContractBalance ] = useState(0)
  const [ web3, setWeb3 ] = useState<any>(null)
  const [ accountBalance, setAccountBalance ] = useState(0)
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
  }, [])

  const connectMetamask = async (e: any) => {
    setLoading(true)
    const web3Res = await ethConnect()
    if (web3Res) {
      setWeb3(web3Res)
      web3Res.eth.getAccounts().then((res: any) => {
        const account = res?.[0]
        setMetamaskAccount(account)

        getEthBalance(account).then(res => {setAccountBalance(res)}, err => {})
        getPrice().then(res => {setPrice(res)}, err => {})
        getRemainTokenCount().then(res => {setRemainingCount(res)}, err => {})
        getMintedTokenCount().then(res => {setSoldCount(res)}, err => {})
        getEthBalance(contractConfig.contractAddress).then(res => {setContractBalance(res)}, err => {})
      }).finally(() => setLoading(false))
    }
  }

  const setMint = () => {
    setLoading(true)

  }

  return (
    <div className='home-page'>
      <h1 className='text-center'>NFT Minting Demo</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '0 40px'
      }}>
        <div className="d-flex flex-column">
          <button type='button' className='d-block btn btn-primary' onClick={connectMetamask}>Connect Metamask</button>
          <div className="btn btn-secondary">
            {!web3 && (
              <>
                Please install <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank'>Metamask</a>
              </>
            )}
            {web3 && (
              <>Account: {metamaskAccount}</>
            )}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' disabled={!metamaskAccount}>Account balance</button>
          <div className="btn btn-secondary">
            {accountBalance}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' disabled={!metamaskAccount}>Price</button>
          <div className="btn btn-secondary">
            {price}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' disabled={!metamaskAccount}>Sold</button>
          <div className="btn btn-secondary">
            {soldCount}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' disabled={!metamaskAccount}>Remaining</button>
          <div className="btn btn-secondary">
            {remainingCount}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' disabled={!metamaskAccount}>Contract Balance</button>
          <div className="btn btn-secondary">
            {contractBalance}
          </div>
        </div>
      </div>
      <div className="text-center mt-4 d-flex justify-content-center">
        <button type='button' className='btn btn-dark w-50 py-2' disabled={!metamaskAccount} onClick={setMint}>
          Mint random
        </button>
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default Home
