import { ports } from "../../../services/api-constants"
import { ApiRequest } from "../../../services/apiService"
import { ApiMethods } from "../../../utils/authUtils"

// export const generateQuestions = (onSuccess,onFailoure) =>{
//     const res = ApiRequest({
//         url:ports.jdService+'',
//         method:ApiMethods.GET
//     })
// }

///http://10.17.122.250:8090/api/v1/blob_uploads/save_video_blob
// http://10.17.122.250:8090/api/v1/blob_uploads/save_audio_blob
// http://10.17.122.250:8090/api/v1/blob_uploads/save_snapshot

// Define interfaces for better type safety
interface AudioUploadOptions {
  filename?: string;
  metadata?: Record<string, any>;
}

interface ApiResponse {
  data: any;
  status: number;
  message?: string;
}

export const sendingVideoBlobs = async (
  audioFile: File | Blob,
  options: AudioUploadOptions = {},
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
  
  const formData = new FormData();
  formData.append('audio', audioFile);

  if (options.filename) {
    formData.append('filename', options.filename);
  }
  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }

  try {
    const response: ApiResponse = await ApiRequest({
      method: 'POST',
      url: 'blob_uploads/save_audio_blob',
      data: formData, 
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    onSuccess?.(response.data);
  } catch (error) {
    onFailure?.(error);
  }
};

// Define interface for video upload options
interface VideoUploadOptions {
  filename?: string;
  metadata?: Record<string, any>;
  quality?: 'low' | 'medium' | 'high';
  thumbnail?: boolean;
}

export const uploadVideoFile = async (
  videoFile: File | Blob,
  options: VideoUploadOptions = {},
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
   
  const formData = new FormData();
  formData.append('video', videoFile);

  if (options.filename) {
    formData.append('filename', options.filename);
  }
  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }
  if (options.quality) {
    formData.append('quality', options.quality);
  }
  if (options.thumbnail) {
    formData.append('generateThumbnail', 'true');
  }

  await ApiRequest({
    method: 'POST',
    url: 'blob_uploads/save_video_blob',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response: any) => onSuccess && onSuccess(response.data))
  .catch((error) => onFailure && onFailure(error));
};

// Define interface for image upload options
interface ImageUploadOptions {
  filename?: string;
  metadata?: Record<string, any>;
  resize?: {
    width: number;
    height: number;
    quality?: number;
  };
  watermark?: boolean;
  format?: 'jpeg' | 'png' | 'webp';
}

export const uploadImageFile = async (
  imageFile: File | Blob,
  options: ImageUploadOptions = {},
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
   
  const formData = new FormData();
  formData.append('image', imageFile);

  if (options.filename) {
    formData.append('filename', options.filename);
  }
  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }
  if (options.resize) {
    formData.append('resize', JSON.stringify(options.resize));
  }
  if (options.watermark) {
    formData.append('watermark', 'true');
  }
  if (options.format) {
    formData.append('outputFormat', options.format);
  }

  await ApiRequest({
    method: 'POST',
    url: 'blob_uploads/save_image_blob',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response: any) => onSuccess && onSuccess(response.data))
  .catch((error) => onFailure && onFailure(error));
};

export const startSession = async () => {
  try {
      const response = await ApiRequest({
          url: ports.jdService + "api/v1/interview/start-session/" + ports.jdRefId,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
      });
      if (!response) throw new Error("Failed to start session");
      const generateResponse = await generateQuestions();
      if (!generateResponse) throw new Error("Failed to generate questions");

      localStorage.setItem("sessionId", response.data.data);
  } catch (error) {
      console.error("Error starting session:", error);
  }
}

export const generateQuestions = async () => {
  try {
      const response = await ApiRequest({
          url: ports.jdService + `api/v1/questions/generate/${ports.jdRefId}/${ports.candidateRefId}`,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
      });
      if (!response) throw new Error("Failed to start session");
        return response.data;
  } catch (error) {
      console.error("Error starting session:", error);
  }
}

export const getNextQuestion = async (body: any) => {
  try {
      const response = await ApiRequest({
          url: ports.jdService + `api/v1/interview/next-question?sessionId=${localStorage.getItem("sessionId")}`,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          data: body,
      });
      if (!response) throw new Error("Failed to start session");
        return response.data;
  } catch (error) {
      console.error("Error starting session:", error);
  }
}