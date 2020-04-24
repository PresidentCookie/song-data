// @ts-ignore
import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function getHashParams():any {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
    // @ts-ignore
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

function App() {

  const [data, setData] = useState<any>()

  const splitList = (list : any) => {
    let size = list.length;
    if(!size){size = list.size}

    const listOfLists = []
    let listPart = []

    for(var i = 0; i < size; i++){
      listPart.push(list[i])
      if((i + 1) % 10 === 0){
        listOfLists.push(listPart)
        listPart = []
      }
    }

    if(size % 10 !== 0){
      listOfLists.push(listPart)
    }

    return listOfLists
  }

  useEffect(() => {
    const params = getHashParams();

    if (!params.access_token) {
      const client_id = 'YOUR_CLIENT_ID_HERE'; 
      const redirect_uri = 'http://localhost:3000/callback'; 

      var scope = 'user-read-private user-read-email';

      var url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

      window.location.replace(url);
    } else if(!data) {
      const tracks: any = []
      const trackFeatures: any = []
      const artists: any = []

      const trackPromises: any = []
      const trackInfoPromises: any = []
      const artistPromises: any = []

      const artistIds: any = new Set();
      
      console.log(params.access_token)
      
      const trackIds = ["127QTOFJsJQp5LbJbu3A1y","22LAwLoDA5b4AaGSkg6bKW","0VjIjW4GlUZAMYd2vXMi3b","0nbXyq5TXYPCO7pr3N8S4I","24Yi9hE78yPEbZ4kxyoXAI","1jaTQ3nqY3oAAYyCTbIvnM","3Dv1eDb0MEgF93GpLXlucZ","3PfIrDoz19wz7qK7tYeu62","55CHeLEfn5iJ0IIkgaa4si","7eJMfftS33KTjuF7lTsMCx","4umIPjkehX1r7uhmGvXiSV","5yY9lUy8nbvjM1Uyo1Uqoc","1Cv1YLb4q0RzL6pybtaMLo","21jGcNKet2qwijlDFuPiPb","07KXEDMj78x68D884wgVEm","4cSSL3YafYjM3yjgFO1vJg","2rRJrJEo19S2J82BDsQ3F7","696DnlkuDOXcMAnKlTgXXK","1lGHa2pwYzxQHFBUynhLtO","0lSZh5W0wDeurkGzLYY6hf","3jjujdWJ72nww5eGnfs2E7","56uXDJRCuoS7abX3SkzHKQ","3kW4z2pIj5VY5fLjBrMRL5","4nK5YrxbMGZstTLbvj6Gxw","7szuecWAPwGoV1e5vGu8tl","1rgnBhdG2JDFTbYkYRZAku","2ajzBr7vwHTEBeqDzcsNRC","7FIWs0pqAYbP91WWM0vlTQ","3QzAOrNlsabgbMwlZt7TAY","017PF4Q3l4DBUiWoXk4OWT","6xZ4Q2k2ompmDppyeESIY8","4S2uhQE8L9V6p7rj7SiauJ","3jT2LKH0RSbQ8jIUNFzXm5","0RiRZpuVRbi7oqRdSMwhQY","7qEHsqek33rTcFNT9PFqLf","78qd8dvwea0Gosb6Fe6j3k","7aiClxsDWFRQ0Kzk5KI5ku","4xqIYGwwZTEem9U8A42SPF","6Ozh9Ok6h4Oi1wUSLtBseN","2p8IUWQDrpjuFltbdgLOag","285pBltuF7vW8TeWk8hdRR","6Gg1gjgKi2AK4e0qzsR7sd","3ZCTVFBt2Brf31RLEnCkWJ","0SqqAgdovOE24BzxIClpjw","4QnC1bIaMSfDQvF4XDhV5M","2kJwzbxV2ppxnQoYw4GLBZ","7wsmIIm0xWmtP7TmACXkJn","6bnF93Rx87YqUBLSgjiMU8","6ap9lSRJ0iLriGLqoJ44cq","6fWa5CRgy0z30OeGZyMBvD"]

      const groupedTracks:any = splitList(trackIds)

      console.log({groupedTracks})
    
      groupedTracks.map((thoseTracks : any) => {
        let trackList = ''
        for(var i = 0; i < thoseTracks.length; i++){
          trackList += `${thoseTracks[i]}`
          if(!(i === thoseTracks.length - 1)) {
            trackList += ','
          }
        }
        trackPromises.push(axios.request({
          method: 'get',
          url: `https://api.spotify.com/v1/tracks?ids=${trackList}`,
          headers: {
            Authorization: `Bearer ${params.access_token}`,
            Accept: 'application/json'
          }
        }).then(response => {
          tracks.push(...response.data.tracks)        
        }))

        trackInfoPromises.push(axios.request({
          method: 'get',
          url: `https://api.spotify.com/v1/audio-features?ids=${trackList}`,
          headers: {
            Authorization: `Bearer ${params.access_token}`,
            Accept: 'application/json'
          }
        }).then(response => {
          trackFeatures.push(...response.data.audio_features)        
        }))
      })

      Promise.all(trackPromises).then(() => {
        tracks.map(( track : any) => track.artists.map((artist : any) => artistIds.add(artist.id)))        

        const groupedArtists:any = splitList([...artistIds])
        console.log({groupedArtists})

        groupedArtists.map((thoseArtists : any) => {
          let artistList = ''
          for(var i = 0; i < thoseArtists.length; i++){
            artistList += `${thoseArtists[i]}`
            if(!(i === thoseArtists.length - 1)) {
              artistList += ','
            }
          }

          artistPromises.push(axios.request({
            method: 'get',
            url: `https://api.spotify.com/v1/artists?ids=${artistList}`,
            headers: {
              Authorization: `Bearer ${params.access_token}`,
              Accept: 'application/json'
            }
          }).then(response => {
            artists.push(...response.data.artists)          
          }))
        })

        Promise.all(artistPromises).then(() => {
          let artistMap = new Map()

          artists.map((artist: any) => artistMap.set(artist.id, artist.genres))

          Promise.all(trackInfoPromises).then(() => {

            let trackFeatureMap = new Map()

            trackFeatures.map((trackFeature: any) => trackFeatureMap.set(trackFeature.id, trackFeature))

            const final = tracks.map((track : any) => {
              return {
                name: track.name,
                track_id: track.id,
                artists: track.artists.map((artist : any) => artist.name),
                genres: track.artists.map((artist : any) => artistMap.get(artist.id)),
                info: {
                  acousticness: trackFeatureMap.get(track.id).acousticness,
                  danceability: trackFeatureMap.get(track.id).danceability,
                  energy: trackFeatureMap.get(track.id).energy,
                  instrumentalness: trackFeatureMap.get(track.id).instrumentalness,
                  liveness: trackFeatureMap.get(track.id).liveness,
                  loudness: trackFeatureMap.get(track.id).loudness,
                  speechiness: trackFeatureMap.get(track.id).speechiness,
                  tempo: trackFeatureMap.get(track.id).tempo,
                  valence: trackFeatureMap.get(track.id).valence
                }
              }
            })

            console.log({final})

            console.log(`track_id;track_name;track_artists;track_genres;acousticness;danceability;energy;instrumentalness;liveness;loudness;speechiness;tempo;valence`)

            final.map((thing: any) => {
              console.log(`${thing.track_id};${thing.name};${thing.artists};${thing.genres};${thing.info.acousticness};${thing.info.danceability};${thing.info.energy};${thing.info.instrumentalness};${thing.info.liveness};${thing.info.loudness};${thing.info.speechiness};${thing.info.tempo};${thing.info.valence}`)
            })

            setData(final)
          })
      })

      })
    }
    
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Your Song Data
        </p>
        </header>
        {`track_id;track_name;track_artists;track_genres;acousticness;danceability;energy;instrumentalness;liveness;loudness;speechiness;tempo;valence`}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        {data && (data.map((thing: any) => {
            return (
              <React.Fragment>
                <br/>
                {`${thing.track_id};${thing.name};${thing.artists};${thing.genres};${thing.info.acousticness};${thing.info.danceability};${thing.info.energy};${thing.info.instrumentalness};${thing.info.liveness};${thing.info.loudness};${thing.info.speechiness};${thing.info.tempo};${thing.info.valence}`}
              </React.Fragment>
            )
          }
          ))}
    </div>
  );
}

export default App;
