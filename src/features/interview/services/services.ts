import { ports } from "../../../services/api-constants"
import { ApiRequest } from "../../../services/apiService"
import { ApiMethods } from "../../../utils/authUtils"

export interface ApiResponse {
  data: any;
  status: number;
  message?: string;
}

export const uploadAudioBlobs = async (
  formData: FormData,
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
  await ApiRequest({
    method: 'POST',
    url: 'blob_uploads/save_audio_blob',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response: ApiResponse) => onSuccess && onSuccess(response.data))
    .catch((error) => onFailure && onFailure(error));
};

export const uploadVideoBlobs = async (
  formData: FormData,
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
  await ApiRequest({
    method: 'POST',
    url: 'blob_uploads/save_video_blob',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response: ApiResponse) => onSuccess && onSuccess(response.data))
    .catch((error) => onFailure && onFailure(error));
};

export const uploadImageFile = async  (
  formData: FormData,
  onSuccess?: (data: any) => void,
  onFailure?: (error: any) => void
): Promise<void> => {
  await ApiRequest({
    method: 'POST',
    url: 'blob_uploads/save_snapshot',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response: ApiResponse) => onSuccess && onSuccess(response.data))
    .catch((error) => onFailure && onFailure(error));
};

export const startSession = async () => {
  try {
      const response = await ApiRequest({
          url: "interview/start-session/" + ports.candidateRefId,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
      });
      if (!response) throw new Error("Failed to start session");
      const generateResponse = await generateQuestions();
      if (!generateResponse) console.warn("Failed to generate questions"); //409 treating it as success
      localStorage.setItem("sessionId", response.data.data);
  } catch (error) {
      console.error("Error starting session:", error);
  }
}

export const generateQuestions = async () => {
  try {
      const response = await ApiRequest({
          url: `questions/generate/${ports.jdRefId}/${ports.candidateRefId}`,
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
          url: `interview/next-question?sessionId=${localStorage.getItem("sessionId")}`,
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