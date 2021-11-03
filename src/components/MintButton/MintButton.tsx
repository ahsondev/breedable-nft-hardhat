import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import TwitterLogin from 'react-twitter-auth'
import config from 'utils/config'

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
    <button onClick={handleSubmit} type='button' className='mint'>
      Jack In
    </button>
      <TwitterLogin
        loginUrl={config.apiUrl + "/auth/twitter"}
        requestTokenUrl={config.apiUrl + "/auth/twitter/reverse"}
        onFailure={onTwitterFailure} onSuccess={onTwitterSuccess}
      />
    </div>
  )
}

export default MintButton
