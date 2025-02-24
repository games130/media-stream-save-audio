# Connect Basic Demo

This is a basic server application that consumes audio from Twilio Media Streams and save the audio to file.

This is using a library from https://github.com/jremi/twilio-media-stream-save-audio-file, if you want to write your own logic you can also refer to this https://stackoverflow.com/questions/58439005/is-there-any-way-to-save-mulaw-audio-stream-from-twilio-in-a-file


## Setup

1. Run `npm install`
2. By default, the app will be bound to localhost on port 3000
3. To expose the app to the internet, you can use ngrok by running the command `ngrok http 3000`
4. In the Twilio Console, use the ngrok URL as your Voice URL, appending /twiml for the phone number you would like to use. For example - https://123456789.ngrok.io/twiml
5. You will also need to replace the URL in variable name `SERVER_URL` in the server.js file, for example - 123456789.ngrok.io
6. Run the app by running `node ./server.js`
