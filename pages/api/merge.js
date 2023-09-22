// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// Set the FFmpeg path for fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const config = {
  api: {
    externalResolver: true,
  },
};
export default async function handler(req, res) {

  const answer = req.query.answer;
  console.log('answer', answer);
  const request = await fetch('https://play.ht/api/v2/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PLAYHT_TOKEN}`,
      'X-User-Id': process.env.PLAYHT_USER_ID
    },
    body: JSON.stringify({
      "text": answer,
      "voice": "s3://voice-cloning-zero-shot/86cc02af-4340-4b54-8fcb-6a870b6c9bd2/toly/manifest.json",
    })
  });
  const response = await request.text();
  const regex = /"url":"(https:\/\/[^\"]+)"/;
  const match = response.match(regex);
  var url;
  if (match && match[1]) {
    url = match[1];
    console.log('Extracted URL:', url);
    const filename = `output-${Date.now()}.mp4`;
    ffmpeg().input('./public/heytoly.mp4').videoCodec('copy').input(url).audioCodec('aac').save(`./public/${filename}`)
      .on('end', () => {
        res.status(200).send({ downloadLink: `/${filename}` })
        return;
      })
      .on('error', (err) => {
        console.error("Error:", err);
        res.status(500).send({ error: 'Failed to process video' });
      });

  } else {
    const issue = 'URL not found'
    res.status(500).send({ error: issue });
    console.log(issue);
  }
}