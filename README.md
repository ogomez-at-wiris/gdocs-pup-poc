# Introduction

To use this POC create a .env file with the following data:

```.env
EMAIL=oriol.gomez@wiris.com
PASSWORD=PASSWORD
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
```

Then all you need to do is `npm install` and then just run `node .`

You will see Chromium pop up, login to Google, display Google docs. It will try to open the URL to my document but it might not work since you need permissions, but you can change the last step.
