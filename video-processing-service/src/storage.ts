// Will do GCS file interactions and local file interactions here.
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


const storage = new Storage();

const rawVideoBucketName = "melak-raw-videos";
const processedVideoBucketName = "melak-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

//create local directories for raw and processed vids.
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
    
}



/**
 * @param rawVideoName - name of file to convert from {@link localRawVideoPath}
 * @param processedVideoName - name of file to convert to {@link localProcessedVideoPath}
 * @returns a promise that resolves once vid has been converted
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
    .outputOptions('-vf', 'scale=-1:360') // 360p
    .on('end', function() {
        console.log('Processing finished successfully');
        resolve();
    })
    .on('error', function(err: any) {
        console.log('An error occurred: ' + err.message);
        reject(err);
    })
    .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - The name of the file to download
 * {@link rawVideoBucketName} - bucket into the {@link localRawVideoPath} folder
 * @returns a promise that resolves once the file has been downloaded
 */
export async function downloadRawVideo(fileName: string) {
  await storage.bucket(rawVideoBucketName).file(fileName)
  .download({destination: `${localRawVideoPath}/${fileName}`});

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
  
  );

}

/**
 * @param fileName - The name of the file to upload
 * {@link localProcessedVideoPath} - folder into the {@link processedVideoBucketName}
 * @returns a promise that resolves once the file has been uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`,{
    destination: fileName
  });
  console.log(`${fileName} has been uploaded to gs://${processedVideoBucketName}/${fileName}.`);
  await bucket.file(fileName).makePublic();
  
}

/**
 * @param fileName - The name of the file to delete 
 * from {@link localRawVideoPath} folder
 * 
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete from 
 * {@link localProcessedVideoPath} folder
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)){
      fs.unlink(filePath, (err) => {
        if(err){
          console.log(`Failed to delete file at ${filePath}`,err);
          reject(err);
        } else{
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
        })
    }
    else{
    console.log(`File not found at ${filePath}, skipping the delete.`);
    resolve();
  }
  })
}

/**
 * Ensures a directory exists, creating it if needed.
 * @param {string} dirPath - The directory to check
 */
function ensureDirectoryExistence(dirPath: string){
  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, {recursive: true}); // recursive means we make nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}


