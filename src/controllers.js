import { oauth2Client } from './config/google.js'

export const oauth2CallbackHandler = async (req, res, next) => {
    try {
        let { tokens } = await oauth2Client.getToken(req.query.code)
        console.log({tokens})
        req.headers.authorization = tokens.access_token
        req.headers.refresh_token = tokens.refresh_token
        next()
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}