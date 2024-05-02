const userVideo = document.getElementById('user-video');
const connectVideo = document.getElementById('connect');
const startVideo = document.getElementById('start');
const state = {media: null};

let socket;
window.onload= function(){
 socket = io();
}

connectVideo.addEventListener('click', async () => {
  const media = await navigator.mediaDevices.getDisplayMedia({ video: true });
  state.media = media;
  userVideo.srcObject = media;
});

startVideo.addEventListener('click', () => {
  const mediaRecorder = new MediaRecorder(state.media,{
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 250000,
    framerate: 25
  });

  mediaRecorder.ondataavailable = e => {
    console.log('Binary Stream is Available:', e.data);
    socket.emit('binarystream', e.data);
  }
  mediaRecorder.start(25);
});
