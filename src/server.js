import express from 'express'
import bodyParser from 'body-parser'
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser';
import { appPage } from './pages/app.js';
import { loginPage } from './pages/login.js';
import { authorization } from './authorization.js';

const PORT = 4000
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET

const oauthClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

const app = express()

app.use(express.json())
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));

const LocalStorage = () => {
    const tokens = {}
    const getToken = (jti) => tokens[jti]
    const saveToken = (jti, jwt) => {
        tokens[jti] = jwt
    }
    return {
        getToken,
        saveToken
    }
}

const localStorage = LocalStorage()

const verify = async (credentials) => {
    const ticket = await oauthClient.verifyIdToken({
        idToken: credentials,
        audience: CLIENT_ID,
    });
    return ticket.getPayload();
}

app.get('/login', (req, res) => {
    res.send(loginPage);
})

app.get('/app', async (req, res) => {
    const { jti } = req.signedCookies
    const jwt = localStorage.getToken(jti)
    const payload = await verify(jwt).catch(console.error);
    res.send(appPage(`${payload.given_name} ${payload.family_name}`));
})

app.post('/handle-credentials-response', async (req, res) => {
    const payload = await verify(req.body.credential).catch(console.error);
    const isAuthorized = await authorization.isAuthorized({member:payload.email})
    if(!isAuthorized){
        res.status(401).send('please verify if you are in the required app group')
        return
    }
    let options = {
        maxAge: payload.exp + 1000 * 60, 
        signed: true,
        sameSite: true
    }
    localStorage.saveToken(payload.jti, req.body.credential)
    res.cookie('jti', payload.jti, options)
    res.redirect('/app')
})

app.listen(PORT, () => {
    console.log('listening in port ', PORT)
})

