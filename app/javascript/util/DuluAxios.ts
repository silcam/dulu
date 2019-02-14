import axios, { AxiosError } from "axios";

interface IDuluAxios {
  get: (url: string, params?: {}) => any;
  post: (url: string, data: PostParams) => any;
  put: (url: string, data: PostParams) => any;
  delete: (url: string) => any;
  authToken?: string;
  setNetworkError?: (error: DuluAxiosError) => void;
  clearNetworkError?: () => void;
}

interface PostParams {
  authenticity_token?: string;
  [other: string]: any;
}

export interface DuluAxiosError {
  type: "server" | "connection";
}

const DuluAxios: IDuluAxios = {
  get: async (url, params) => {
    try {
      console.log(`GET ${url}`);
      const response = await axios.get(url, {
        params: params
      });
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  post: async (url, data) => {
    try {
      console.log(`POST ${url}`);
      data.authenticity_token = getAuthToken();
      const response = await axios.post(url, data);
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  put: async (url, data) => {
    try {
      console.log(`PUT ${url}`);
      data.authenticity_token = getAuthToken();
      const response = await axios.put(url, data);
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async url => {
    try {
      console.log(`DELETE ${url}`);
      const response = await axios({
        method: "delete",
        url: url,
        data: {
          authenticity_token: getAuthToken()
        }
      });
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

function handleError(error: AxiosError) {
  if (!DuluAxios.setNetworkError) throw error;
  if (error.response) DuluAxios.setNetworkError({ type: "server" });
  else DuluAxios.setNetworkError({ type: "connection" });
}

function getAuthToken() {
  if (!DuluAxios.authToken) {
    DuluAxios.authToken = document!
      .querySelector("meta[name=csrf-token]")!
      .getAttribute("content")!;
  }
  return DuluAxios.authToken;
}

function clearNetworkError() {
  if (DuluAxios.clearNetworkError) DuluAxios.clearNetworkError();
}

export default DuluAxios;
