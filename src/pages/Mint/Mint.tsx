import { useEffect, useState } from 'react'
import Loader from 'components/Loader'
import { NotificationManager } from 'components/Notification'
import queryString from 'query-string'
import api from 'utils/api'
import { useCookies } from 'react-cookie'

interface Props {}

const Mint = (props: Props) => {
  const [twitterLogin, setTwitterLogin] = useState({
    isLoggedIn: false,
    name: '',
    imageUrl: '',
    status: '',
    url: ''
  })

  const [cookies, setCookie] = useCookies(['oauth_token']);

  useEffect(() => {
    ;(async () => {
      const { oauth_token, oauth_verifier } = queryString.parse(window.location.search)
      if (oauth_token && oauth_verifier) {
        try {
          // Oauth Step 3
          await api.post('/auth/twitter/access_token', {oauth_token, oauth_verifier, oauth_token1: cookies?.oauth_token})
        } catch (error) {
          console.error(error)
        }
      }

      try {
        // Authenticated Resource Access
        const {
          data: { name, profile_image_url_https, status, entities },
        } = await api.get('/auth/twitter/profile_banner?oauth_token=' + cookies?.oauth_token)

        setTwitterLogin({
          isLoggedIn: true,
          name,
          imageUrl: profile_image_url_https,
          status: status.text,
          url: entities.url.urls[0].expanded_url
        })
      } catch (error) {
        console.error(error)
      }
    })()
  }, [cookies])

  return (
    <div className='mint-page'>
      {twitterLogin.isLoggedIn && (<button type='button'>Confirm</button>)}
    </div>
  )
}

export default Mint
