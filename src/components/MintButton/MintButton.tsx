import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import api from 'utils/api'
import { encrypt, decrypt, setStorageItem } from 'utils/helper'

import './MintButton.scoped.scss'

const MintButton = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const onTwitterLogin = () => {
    (async () => {
      
      try {
        // OAuth Step 1
        const response = await api.post('/auth/twitter/request_token')
        const { oauth_token } = response.data;
        setStorageItem('oauth_token', encrypt(oauth_token))
        
        // Oauth Step 2
        window.location.href = (`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`)
      } catch (error) {
        console.error(error); 
      }
    })();
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
