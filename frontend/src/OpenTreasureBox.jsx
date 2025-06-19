import React, { useState, useEffect } from "react";

export default function OpenTreasureBox({ userId = "testuser" }) {
  const [signedIn, setSignedIn] = useState(false);
  const [days, setDays] = useState(0);
  const [reward, setReward] = useState(null);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3333/api/user_signin_status?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSignedIn(data.todaySigned);
        setDays(data.continuousDays);
      });
  }, [userId]);

  const handleOpenBox = async () => {
    setOpening(true);
    setTimeout(async () => {
      const res = await fetch(`http://localhost:3333/api/user_signin?userId=${userId}`, {
        method: "POST"
      });
      const data = await res.json();
      setSignedIn(true);
      setDays(data.newDays);
      setReward(data.reward);
      setOpening(false);
    }, 900);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>连续开宝箱：{days}天</h2>
      <div
        style={{
          width: 120, height: 120, margin: "32px auto",
          background: signedIn ? "gold" : "#f2b233",
          borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.13)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, cursor: signedIn ? "not-allowed" : "pointer",
          transition: "background 0.5s",
          animation: opening ? "bounce 0.9s" : "none"
        }}
        onClick={!signedIn && !opening ? handleOpenBox : undefined}
      >
        {signedIn ? "🎉" : "🗝️"}
      </div>
      <button
        disabled={signedIn || opening}
        onClick={handleOpenBox}
        style={{
          marginTop: 16,
          padding: "12px 28px",
          borderRadius: 12,
          background: signedIn ? "#ccc" : "#FFC107",
          color: "#333",
          fontWeight: "bold",
          fontSize: 18,
          border: "none"
        }}
      >
        {signedIn ? "今日已开" : "开宝箱领奖励"}
      </button>
      {reward && (
        <div
          style={{
            margin: "32px auto",
            background: "#fffbe6",
            borderRadius: 20,
            padding: "24px 32px",
            fontSize: 20,
            boxShadow: "0 6px 32px rgba(0,0,0,0.13)"
          }}
        >
          <b>🎁 恭喜获得：<span style={{ color: "red" }}>{reward}</span></b>
        </div>
      )}
      <style>
        {`
          @keyframes bounce {
            0%   { transform: scale(1);}
            30%  { transform: scale(1.2);}
            60%  { transform: scale(0.95);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}
