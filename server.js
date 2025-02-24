const express = require('express');
const fs = require("fs");
const twilio = require('twilio');
const path = require("path");
const TwilioMediaStreamSaveAudioFile = require("twilio-media-stream-save-audio-file");
var http = require("http");
const { Server } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const SERVER_URL = "d254a78a65fc.ngrok.app";

const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: "my-twilio-media-stream-output",
  onSaved: () => console.log("File was saved!"),
});


  // 📢 Twilio XML Response to Connect WebSocket
  app.post('/twiml', (req, res) => {
    console.log("📞 Incoming call from Twilio");

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Hello! Welcome to to this test call. Please say something");
    
    twiml.connect().stream({
        url: `wss://`+SERVER_URL+`/`
    });

    console.log("🛠️ Twilio Stream URL:" + SERVER_URL);
    
    res.type('text/xml').send(twiml.toString());
  });

  // 🎤 WebSocket Server for Streaming Audio
  wss.on('connection', (ws) => {
    console.log("🔗 WebSocket Connected! Waiting for audio input...");

    ws.on('message', (message) => {
      console.log(`🔊 Received ${message.length} bytes of audio from Twilio`);
      const msg = JSON.parse(message);
      switch (msg.event) {
        case "connected":
          console.log("A new call has connected");
          break;
        case "start":
          console.log(`Starting media stream...`);
          mediaStreamSaver.twilioStreamStart();
          break;
        case "media":
          console.log("Receiving audio...");
          mediaStreamSaver.twilioStreamMedia(msg.media.payload);
          break;
        case "stop":
          console.log("Call has ended");
          mediaStreamSaver.twilioStreamStop();
          break;
        default:
          break;
      }
    });

    ws.on('close', () => {
      console.log("❌ WebSocket Disconnected!");
    });
  });

// ✅ Start Server
server.listen(3000, () => console.log("✅ Server running on port 3000"));
