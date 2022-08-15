
const cfg = {
    apiKey: "AIzaSyDDvHJB1Kq13K79FDKF7lsDT-0qLAQdS1o",
    authDomain: "my-pion.firebaseapp.com",
    databaseURL: "https://my-pion-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "my-pion",
    storageBucket: "my-pion.appspot.com",
    messagingSenderId: "1073424306265",
    appId: "1:1073424306265:web:a4c209a9b24ebed24c2148"
};

const app = firebase.initializeApp(cfg)
//const app = initializeApp(firebaseConfig);
const db = firebase.database();

const author = {
    name: 'Artur Gwoździowski',
    year: '2022',
    location: 'Resov'
}

db.ref('author').set(author);

let pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  })
  let log = msg => {
    document.getElementById('div').innerHTML += msg + '<br>'
  }
  
  pc.ontrack = function (event) {
    var el = document.createElement(event.track.kind)
    el.srcObject = event.streams[0]
    el.autoplay = true
    el.controls = true
  
    document.getElementById('remoteVideos').appendChild(el)
  }
  
  pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
  pc.onicecandidate = event => {
    if (event.candidate === null) {
        let sdl = btoa(JSON.stringify(pc.localDescription))
        document.getElementById('localSessionDescription').value = sdl
        db.ref('signaling/offer').set(sdl);
    }
  }
  
  // Offer to receive 1 audio, and 1 video track
  pc.addTransceiver('video', {'direction': 'sendrecv'})
  pc.addTransceiver('audio', {'direction': 'sendrecv'})
  
  pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)
  
  window.startSession = () => {
    let sd = document.getElementById('remoteSessionDescription').value
    if (sd === '') {
      return alert('Session Description must not be empty')
    }
  
    try {
      pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
    } catch (e) {
      alert(e)
    }
  }
  