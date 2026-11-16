// Firebase Admin setup — messaging (FCM) only.
// Uses the modular entry points so no other Firebase services (Firestore, Auth, etc.) are loaded.
const path = require("path");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  "..",
  "service",
  "telebantuan-mvp-firebase-adminsdk-fbsvc-b984a8fd51.json",
);

const app =
  getApps()[0] ||
  initializeApp({ credential: cert(require(SERVICE_ACCOUNT_PATH)) });
const messaging = getMessaging(app);

// FCM requires every value in `data` to be a string.
function stringifyData(data = {}) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      typeof v === "string" ? v : JSON.stringify(v),
    ]),
  );
}

function sendToToken(token, { title, body, data }) {
  return messaging.send({
    token,
    notification: { title, body },
    data: stringifyData(data),
  });
}

function sendToTopic(topic, { title, body, data }) {
  return messaging.send({
    topic,
    notification: { title, body },
    data: stringifyData(data),
  });
}

module.exports = { messaging, sendToToken, sendToTopic };
