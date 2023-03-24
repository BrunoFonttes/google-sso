import { authorization } from './authorization.js';
import { oauth2Client } from  './config/google.js'

const authenticationMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization
        const tokenInfo = await oauth2Client.getTokenInfo(
            accessToken
        );
        console.log({ tokenInfo })
        req.user_email = tokenInfo.email
        next()
    } catch (e) {
        res.sendStatus(403)
    }
}
const authorizationMiddleware = async (req, res, next) => {
    try {
        const isAuthorized = await authorization.isAuthorized({ member: req.user_email })
        if (!isAuthorized) {
            res.sendStatus(401)
            return
        }
        next()
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}
const cookiesSetupMiddleware = (req, res) => {
    try {
        let options = {
            signed: true,
            sameSite: true
        }
        res.cookie('access_token', req.headers.accessToken, options)
        res.cookie('refresh_token', req.headers.refresh_token, options)
        res.redirect('/app')
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export { authenticationMiddleware, authorizationMiddleware, cookiesSetupMiddleware }