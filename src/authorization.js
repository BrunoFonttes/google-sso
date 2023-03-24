import { google } from "googleapis"
import { GoogleAuth } from 'google-auth-library'
const admin = google.admin('directory_v1');

async function getJWTAuthTokenSource() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/admin.directory.group.member.readonly'],
  });

  const client = await auth.getClient();
  client.subject = process.env.GOOGLE_CLIENT_SUBJECT;

  return client;
}
const Authorization = () => {
  const isAuthorized = async ({ member }) => {
    const authClient = await getJWTAuthTokenSource();
    google.options({ auth: authClient });
    const res = await admin.members.hasMember({
      groupKey: process.env.GOOGLE_AUTHORIZED_GROUP,
      memberKey: member
    })
    return res.data.isMember
  }
  return { isAuthorized }
}

const authorization = Authorization()

export { authorization }