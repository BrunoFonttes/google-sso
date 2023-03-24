const loginPage =`<!DOCTYPE html>
<html>
  <head>
    <script src="https://accounts.google.com/gsi/client" onload="initClient()" async defer></script>
  </head>
  <body>
    <script>
      var client;
      function initClient() {
        client = google.accounts.oauth2.initCodeClient({
          client_id: '${process.env.GOOGLE_CLIENT_ID}',
          scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly',
          ux_mode: 'popup',
          callback: (response) => {
            baseurl = '/oauth2callback?code='
            var code_receiver_uri = baseurl.concat('',response.code)
            // Send auth code to your backend platform
            const xhr = new XMLHttpRequest();
            xhr.open('GET', code_receiver_uri, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onload = function() {
              console.log('Signed in as: ' + xhr.responseText);
            };
            xhr.send();
            // After receipt, the code is exchanged for an access token and
            // refresh token, and the platform then updates this web app
            // running in user's browser with the requested calendar info.
          },
        });
      }
      function getAuthCode() {
        // Request authorization code and obtain user consent
          client.requestCode();
      }
    </script>
    <button onclick="getAuthCode();">Load Your Calendar</button>
  </body>
</html>`


export { loginPage }