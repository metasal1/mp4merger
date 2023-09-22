// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// Set the FFmpeg path for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export default function handler(req, res) {
  const a = ffmpeg().input('./public/heytoly.mp4').videoCodec('copy').input('./public/heytoly.mp3').audioCodec('aac').save('output.mp4');
  res.status(200).json({ name: 'John Doe', a });
}
