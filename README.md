# learning
bits and pieces created while self-teaching PHP, Python and other delights.


## Art-tab v0.1 spec

A Google Chrome Extension that shows artworks in each new tab.

###Description

Art-tab is a Google Chrome Extension that mimics the functionality of the [Google Cultural Institute] (https://chrome.google.com/webstore/detail/google-art-project/akimgimeeoiognljlfchpbkpfbmeapkh?hl=en) extension. It shows the user artworks from a range of galleries - pulling directly from their APIs.

###User stories

| Number | Behaviour | Result |
|--------|-----------|--------|
| 1 |User installs the extension| User is shown the settings panel|
| 2 |User clicks the extension item in the toolbar| User is shown the settings panel|
| 3 |User has opened the settings panel| User can alter the galleries works are selected from (ticklist)|
| 4 |User opens a new tab|User sees an artwork filling the browser window. It has a small watermark logo in the bottom left|
| 5 |User hovers over the logo| The paintings title, artist and other info displayed over the painting|
| 6 |User clicks the painting info| User is taken to the paintings page in the galleries online collection|

###Build requirements

4 - Make http request to museum API in PHP!