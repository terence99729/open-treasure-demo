const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

let userSignInDB = {};

app.get("/api/user_signin_status", (req, res) => {
  const { userId } = req.query;
  const info = userSignInDB[userId] || { lastSign: null, days: 0 };
  const today = new Date().toISOString().slice(0, 10);
  const todaySigned = info.lastSign === today;
  res.json({ todaySigned, continuousDays: info.days });
});

app.post("/api/user_signin", (req, res) => {
  const userId = req.query.userId;
  const today = new Date().toISOString().slice(0, 10);
  let info = userSignInDB[userId] || { lastSign: null, days: 0 };

  if (info.lastSign === today) {
    return res.json({ code: 1, msg: "今天已领奖", reward: null, newDays: info.days });
  }

  const yest = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  let days = (info.lastSign === yest) ? info.days + 1 : 1;
  let reward = days >= 7 ? "10元红包" : "1元红包";

  userSignInDB[userId] = { lastSign: today, days };
  res.json({ code: 0, reward, newDays: days });
});

app.listen(PORT, () => {
  console.log(`后端已启动: http://localhost:${PORT}`);
});
