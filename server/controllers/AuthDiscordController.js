const axios = require('axios')
const oauthCallback = process.env.REDIRECT_AUTH_URL

let tokenAccessCounts = {}

async function getProfile(req, res, next) {
  const creds = btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)
  const code = req.body.code

  if (tokenAccessCounts[code]) {
    res.status(403).json({message: 'Duplicated code'})
    return
  }

  try {
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${oauthCallback}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
      }
    )

    const json = await response.json();
    console.log(json)
    const access_token = json.access_token
    axios.get("https://discordapp.com/api/users/@me", {
      headers:{
        "authorization":`Bearer ${access_token}`
      }
    }).then(response=>{
      res.json(response.data)
    })
  } catch (error) {
    console.error(error)
    res.status(403).json(error)
  }
};

module.exports = {
  getProfile,
}
