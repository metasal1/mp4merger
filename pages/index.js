const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

// Set the FFmpeg path for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export default function handler(req, res) {
  const basePath = path.resolve(process.cwd(), 'public');
  const inputVideo = path.join(basePath, 'heytoly.mp4');
  const inputAudio = path.join(basePath, 'heytoly.mp3');
  const outputFile = path.join(basePath, 'output.mp4');

  // Log the paths to verify
  console.log("Base Path:", basePath);
  console.log("Input Video Path:", inputVideo);
  console.log("Input Audio Path:", inputAudio);
  console.log("Output File Path:", outputFile);

  ffmpeg()
    .input(inputVideo)
    .videoCodec('copy')
    .input(inputAudio)
    .audioCodec('aac')
    .on('end', () => {
      // Send the file as a response once processing is complete
      res.setHeader('Content-Disposition', 'attachment; filename=output.mp4');
      const fileStream = fs.createReadStream(outputFile);
      fileStream.pipe(res);
    })
    .on('error', (err) => {
      console.error("FFmpeg Error:", err);
      res.status(500).json({ error: 'Failed to process video' });
    })
    .save(outputFile);
}
