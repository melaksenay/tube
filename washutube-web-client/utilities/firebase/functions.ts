import {httpsCallable} from "firebase/functions";
import {functions} from "./firebase";

const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function getVideos() {
  const response: any = await getVideosFunction();
    return response.data as Video[];
}

// const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File){
    const response: any = await generateUploadUrl(
        {fileExtension: file.name.split('.').pop()}
    );

    //upload file with signed url
    await fetch(response?.data?.url,
        {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }   
        }
    );
    return;
}