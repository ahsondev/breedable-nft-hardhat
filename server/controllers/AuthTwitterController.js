const oauthCallback = process.env.REDIRECT_AUTH_URL
console.log("oauthCallback: ", oauthCallback)
const oauth = require('../services/oauth-promise')(oauthCallback)
const COOKIE_NAME = 'oauth_token'
const helper = require('../services/helper')

let tokens = {}
let tokenAccessCounts = {}

// OAuth Step 1
async function getOAuthToken(req, res, next) {
  try {
    const { oauth_token, oauth_token_secret } = await oauth.getOAuthRequestToken()
    tokens[oauth_token] = { oauth_token_secret }
    console.log("getOAuthToken: ", tokens)
    res.json({ oauth_token })
  } catch (e) {
    console.log('Exception: ', e)
  }  
}

// OAuth Step 3
async function getAccessToken(req, res, next) {
  try {
    const { oauth_token, oauth_verifier } = req.body
    const oauth_token_secret = tokens[oauth_token].oauth_token_secret

    const {
      oauth_access_token,
      oauth_access_token_secret,
    } = await oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier)
    tokens[oauth_token] = {
      ...tokens[oauth_token],
      oauth_access_token,
      oauth_access_token_secret,
    }
    res.json({ success: true })
  } catch (error) {
    res.status(403).json({ message: 'Missing access token' })
  }
}

async function getProfileBanner(req, res, next) {
  try {
    const oauth_token = helper.decrypt(req.body.data);
    console.log("getProfileBanner oauth_token:", oauth_token)
    console.log("getProfileBanner oauth_token:", tokens)
    if (tokenAccessCounts[oauth_token]) {
      res.status(403).json({message: "You already minted"});
      return
    }

    tokenAccessCounts[oauth_token] = true

    const { oauth_access_token, oauth_access_token_secret } = tokens[oauth_token]; 
    const response = await oauth.getProtectedResource(
      "https://api.twitter.com/1.1/account/verify_credentials.json",
      "GET",
      oauth_access_token,
      oauth_access_token_secret
    );
    res.json(JSON.parse(response.data));
  } catch(error) {
    res.status(403).json({message: "Missing, invalid, or expired tokens"});
  }
}

async function logout(req, res, next) {
  try {
    const {oauth_token} = req.body;
    delete tokens[oauth_token];
    res.cookie(COOKIE_NAME, {}, {maxAge: -1});
    res.json({success: true});
  } catch(error) {
    res.status(403).json({message: "Missing, invalid, or expired tokens"});
  }
}

module.exports = {
  getOAuthToken,
  getAccessToken,
  getProfileBanner,
  logout,
}