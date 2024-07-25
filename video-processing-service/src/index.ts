import express from 'express';
import { 
  uploadProcessedVideo,
  downloadRawVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';

setupDirectories(); 

const app = express();
app.use(express.json());

app.post('/process-video', async (req, res) => {
    
  //get the bucket and filename from the Google Cloud Pub/Sub message
  let data;
  try{
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch(error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const importFileName = data.name;
  const outputFileName = `processed-${importFileName}`;

  //download raw vid from cloud storage
  await downloadRawVideo(importFileName);

  //convert the video
  try {
    await convertVideo(importFileName, outputFileName);
  } catch(err) {
    //delete raw and processed vid because we may now have a corrupted file.
    await Promise.all([deleteRawVideo(importFileName),
      deleteProcessedVideo(outputFileName)]);
    console.error(err);
    return res.status(500).send('Internal Server Error: video processing failed.')
  }

  //upload vid to cloud storage
  await uploadProcessedVideo(outputFileName);

  //delete raw and processed vids
  await Promise.all([deleteRawVideo(importFileName),
    deleteProcessedVideo(outputFileName)]);

  return res.status(200).send('Video processing complete!')
  
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
