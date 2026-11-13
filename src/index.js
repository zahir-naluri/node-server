const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Example route
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
