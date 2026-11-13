// Firebase Admin setup — messaging (FCM) only.
// Uses the modular entry points so no other Firebase services (Firestore, Auth, etc.) are loaded.
//
// Credentials: set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON.
// Not wired into index.js yet; require it where you need to send push notifications.
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const app = getApps()[0] || initializeApp({ credential: applicationDefault() });
const messaging = getMessaging(app);

async function sendPushNotification(token, title, body, data = {}) {
  return messaging.send({
    token,
    notification: { title, body },
    data,
  });
}

module.exports = { messaging, sendPushNotification };
