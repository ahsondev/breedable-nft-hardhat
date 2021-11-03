import React from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
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
    <button onClick={handleSubmit} type='button' className='mint'>
      Jack In
    </button>
  )
}

export default MintButton
