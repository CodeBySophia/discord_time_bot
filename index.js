import fetch from "node-fetch";

async function updateChannelName() {
  const dt = new Date();
  const options = {
    timeZone: "Asia/Bangkok",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  };

  // Get actual Bangkok time
  const formatted = new Intl.DateTimeFormat("en-GB", options).format(dt);
  let [hour, minute] = formatted.split(":").map(x => parseInt(x, 10));

  // Rounding to the quarter hour
  const quarters = [0, 15, 30, 45];
  const rounded = quarters.reduce((a, b) =>
    Math.abs(b - minute) < Math.abs(a - minute) ? b : a
  );

  if (rounded === 60) {
    hour = (hour + 1) % 24;
    minute = 0;
  } else {
    minute = rounded;
  }

  const hh = hour.toString().padStart(2, "0");
  const mm = minute.toString().padStart(2, "0");
  const newName = `🕒-bangkok-${hh}h${mm}`;

  // Cannel update via Discord API
  const response = await fetch(`https://discord.com/api/v10/channels/${process.env.CHANNEL_ID}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: newName })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Discord API error: ${response.status} ${err}`);
  }

  console.log("✅ Updated channel name to:", newName);
}

updateChannelName().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
