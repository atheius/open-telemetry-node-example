const express = require("express");
const axios = require("axios");
const processMessage = require("./processing");

const port = process.env.PORT || 3000;

const appName = "a";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(`Hello from app ${appName}!`);
});

app.post("/message/send/:dest", async (req, res) => {
  const destination = req.params.dest;

  console.log(
    `Sending message "${JSON.stringify(req.body)}" to ${destination}`
  );

  try {
    await axios.post(`http://app-${destination}:3000/message`, {
      from: appName,
      to: destination,
      message: req.body.message,
    });
  } catch (error) {
    console.error("Error sending message", error);
    return res.status(500).json({ error: "Error sending message" });
  }

  return res.status(200).json({ data: `Message sent to ${destination}!` });
});

app.post("/message", async (req, res) => {
  console.log("Received message", req.body.message);

  await processMessage();

  return res.status(200).json({ data: "Message received!" });
});

app.listen(port, () => {
  console.log(`App ${appName} started!`);
});
