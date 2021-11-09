import { useEffect, useState } from 'react'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'
import queryString from 'query-string'
import api from 'utils/api'
import { encrypt, decrypt, getStorageItem } from 'utils/helper'
import axios from 'axios'

interface Props {}

const Mint = (props: Props) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [twitterLogin, setTwitterLogin] = useState<{
    isLoggedIn: boolean,
    profile: any
  }>({
    isLoggedIn: false,
    profile: {}
  })

  const [discordLogin, setDiscordLogin] = useState({
    isLoggedIn: false
  })

  

  return (
    <div className='mint-page'>
      {loggedIn && (<button type='button'>Confirm {username}</button>)}
    </div>
  )
}

export default Mint
