const express = require("express");
const { sendToToken, sendToTopic } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Hardcoded topics the mobile client can subscribe to.
const TOPICS = ["general", "announcement", "update", "promotion"];

// Example route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Send a push notification to a specific FCM token
app.post("/notifications/token", async (req, res) => {
  const { fcmToken, title, body, data } = req.body ?? {};
  if (typeof fcmToken !== "string" || !fcmToken.trim()) {
    return res.status(400).json({ error: "fcmToken (string) is required" });
  }
  if (!title || !body) {
    return res.status(400).json({ error: "title and body are required" });
  }

  try {
    const messageId = await sendToToken(fcmToken, { title, body, data });
    res.json({ messageId, token: fcmToken, title, body, data });
  } catch (err) {
    res.status(502).json({ error: err.message, code: err.code });
  }
});

// Send a push notification to all devices subscribed to a topic
app.post("/notifications/topic", async (req, res) => {
  const { topic, title, body, data } = req.body ?? {};
  if (!TOPICS.includes(topic)) {
    return res
      .status(400)
      .json({ error: `topic must be one of: ${TOPICS.join(", ")}` });
  }
  if (!title || !body) {
    return res.status(400).json({ error: "title and body are required" });
  }

  try {
    const messageId = await sendToTopic(topic, { title, body, data });
    res.json({ messageId, topic });
  } catch (err) {
    res.status(502).json({ error: err.message, code: err.code });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
