import express from 'express'
import bodyParser from 'body-parser'

import cookieParser from 'cookie-parser';
import { appPage } from './pages/app.js';
import { loginPage } from './pages/login.js';

import {
    authenticationMiddleware,
    authorizationMiddleware,
    cookiesSetupMiddleware
} from './middlewares.js';
import { oauth2CallbackHandler } from './controllers.js';

const PORT = process.env.PORT
const COOKIE_SECRET = process.env.COOKIE_SECRET

const app = express()

app.use(express.json())
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.send(loginPage);
})

app.get('/oauth2callback', oauth2CallbackHandler)
    .use(authenticationMiddleware)
    .use(authorizationMiddleware)
    .use(cookiesSetupMiddleware)

app.use(authenticationMiddleware)
app.use(authorizationMiddleware)
app.get('/app', async (req, res) => {
    res.send(appPage(`${payload.given_name} ${payload.family_name}`));
})
app.listen(PORT, () => {
    console.log('listening in port ', PORT)
})

