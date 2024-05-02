import http from 'http';
import express from 'express';
import path from 'path';
import {Server as SocketIO} from 'socket.io';
import {spawn} from 'child_process';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const options = [
  '-i',
  '-',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-r', `${25}`,
  '-g', `${25 * 2}`,
  '-keyint_min', 25,
  '-crf', '25',
  '-pix_fmt', 'yuv420p',
  '-sc_threshold', '0',
  '-profile:v', 'main',
  '-level', '3.1',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', 128000 / 4,
  '-f', 'flv',
  // 'rtmp://a.rtmp.youtube.com/live2/wrhq-wkbu-481v-b7j8-9zer'
  'rtmp://live.twitch.tv/app/live_1053315066_X29oBqGTCA8fYk0n2MYisAxwkWI8hv'
];
const ffmpegProcess = spawn('ffmpeg',  options);

ffmpegProcess.stdout.on('data', (data) => {
  console.log(`ffmpeg stdout: ${data}`);
});

ffmpegProcess.stderr.on('data', (data) => {
  console.error(`ffmpeg stderr: ${data}`);
});

ffmpegProcess.on('close', (code) => {
  console.log(`ffmpeg process exited with code ${code}`);
});

io.on('connection', socket => {
  console.log('Socket Connected: ', socket.id);
  socket.on('binarystream', stream => {
    console.log('Stream Incoming.....');
    ffmpegProcess.stdin.write(stream, (err) => {
      if(err)
      console.log('Error: ',err);
    });
  });
});

app.use(express.static(path.resolve('./public')));
server.listen(8000, () => console.log('Server is running on PORT 8000'));