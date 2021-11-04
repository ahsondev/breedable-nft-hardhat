import { useEffect, useState } from 'react'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'
import queryString from 'query-string'
import api from 'utils/api'
import { encrypt, decrypt, getStorageItem } from 'utils/helper'

interface Props {}

const Mint = (props: Props) => {
  const [twitterLogin, setTwitterLogin] = useState<{
    isLoggedIn: boolean,
    profile: any
  }>({
    isLoggedIn: false,
    profile: {}
  })

  useEffect(() => {
    ;(async () => {
      const { oauth_token, oauth_verifier } = queryString.parse(window.location.search)
      if (oauth_token && oauth_verifier) {
        try {
          // Oauth Step 3
          await api.post('/auth/twitter/access_token', {oauth_token, oauth_verifier})
        } catch (error) {
          console.error(error)
        }
      }

      try {
        // Authenticated Resource Access
        const {data: profile} = await api.post('/auth/twitter/profile_banner', {
          data: getStorageItem('oauth_token', '')
        })

        setTwitterLogin({
          isLoggedIn: true,
          profile,
        })
        console.log(profile)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <div className='mint-page'>
      {twitterLogin.isLoggedIn && (<button type='button'>Confirm {twitterLogin.profile.name}</button>)}
    </div>
  )
}

export default Mint
