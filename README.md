This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# To use

## You need to install node

## Add API Key

Because I was too lazy to make this an input field because this was only supposed to be used this once.

Add your api key to `src/App.tsx`
replace 
```
 const client_id = 'YOUR_CLIENT_ID_HERE';
 ```

 With your api key from registering your app as a client for the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) and adding a callback url of `http://localhost:3000/callback`

## `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You need to pass in a list of track ID's to `src/App.tsx` for this to work on.  It gets the song name, artists, genres, and some info about the track like loudness, energy, etc

```
const trackIds = ["127QTOFJsJQp5LbJbu3A1y","22LAwLoDA5b4AaGSkg6bKW","0VjIjW4GlUZAMYd2vXMi3b"...]
```

The data should be able to be copy pasted into excel, its semi colon delemited with an initial row of column names as well.
