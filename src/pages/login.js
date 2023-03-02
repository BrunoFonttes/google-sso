const loginPage =`<!DOCTYPE html>
<html>
<script src="https://accounts.google.com/gsi/client" async defer></script>
<head>
    <p>Google SSO Demo</p>
</head>

<div id="g_id_onload"
     data-client_id="${process.env.GOOGLE_CLIENT_ID}"
     data-context="signin"
     data-login_uri="/handle-credentials-response"
     data-nonce="${process.env.GOOGLE_DATA_NONCE}"
     data-skip_prompt_cookie="jti"
     data-itp_support="true">
</div>
</body>
</html>`


export { loginPage }