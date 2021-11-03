import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import TwitterLogin from 'react-twitter-auth'
import config from 'utils/config'
import api from 'utils/api'

import './MintButton.scoped.scss'

const MintButton = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [twitterAuth, setTwitterAuth] = useState<{
    isAuthenticated: boolean
    user: any
    token: string
  }>({
    isAuthenticated: false,
    user: null,
    token: '',
  })

  const onTwitterLogin = () => {
    (async () => {
      
      try {
        //OAuth Step 1
        const response = await api.post('/twitter/oauth/request_token')
        const { oauth_token } = response.data;
        //Oauth Step 2
        window.open(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`)
      } catch (error) {
        console.error(error); 
      }
      
    })();
  }

  const onTwitterSuccess = (response: any) => {
    const token = response.headers.get('x-auth-token')
    response.json().then((user: any) => {
      if (token) {
        setTwitterAuth({ isAuthenticated: true, user, token })
      }
    })
  }

  const onTwitterFailure = (error: any) => {
    alert(error)
  }

  const handleSubmit = async (data: any) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    try {
      const newToken = await executeRecaptcha('MS_Pyme_DatosEmpresa')
      console.log({ data, newToken })
    } catch (err) {
      throw new Error('Token error')
    }
  }

  return (
    <div>
    <button onClick={onTwitterLogin} type='button' className='mint'>
      Jack In
    </button>
    </div>
  )
}

export default MintButton
