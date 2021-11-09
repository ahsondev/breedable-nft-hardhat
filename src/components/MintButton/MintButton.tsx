import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import api from 'utils/api'
import { encrypt, decrypt, setStorageItem } from 'utils/helper'

import './MintButton.scoped.scss'

const MintButton = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

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
