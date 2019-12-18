import axios, { AxiosError } from "axios";
import { AnyObj } from "../models/TypeBucket";

type MaybeAnyObj = AnyObj | undefined;

interface IDuluAxios {
  get: (url: string, params?: {}) => Promise<MaybeAnyObj>;
  post: (url: string, data: PostParams) => Promise<MaybeAnyObj>;
  put: (url: string, data: PostParams) => Promise<MaybeAnyObj>;
  delete: (url: string) => Promise<MaybeAnyObj>;
  authToken?: string;
  setNetworkError?: (error: DuluAxiosError) => void;
  clearNetworkError?: () => void;
  addLoading: () => void;
  subtractLoading: () => void;
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
      DuluAxios.addLoading();
      console.log(`GET ${url} ${params ? JSON.stringify(params) : ""}`);
      const response = await axios.get(url, {
        params: params
      });
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      DuluAxios.subtractLoading();
    }
  },

  post: async (url, data) => {
    try {
      DuluAxios.addLoading();
      console.log(`POST ${url} ${JSON.stringify(data)}`);
      data.authenticity_token = getAuthToken();
      const response = await axios.post(url, data);
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      DuluAxios.subtractLoading();
    }
  },

  put: async (url, data) => {
    try {
      DuluAxios.addLoading();
      console.log(`PUT ${url} ${JSON.stringify(data)}`);
      data.authenticity_token = getAuthToken();
      const response = await axios.put(url, data);
      clearNetworkError();
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      DuluAxios.subtractLoading();
    }
  },

  delete: async url => {
    try {
      DuluAxios.addLoading();
      console.log(`DELETE ${url}`);
      const response = await axios({
        method: "delete",
        url: url,
        data: {
          authenticity_token: getAuthToken()
        }
      });
      clearNetworkError();
      return response.data || true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      DuluAxios.subtractLoading();
    }
  },

  addLoading: () => {}, // Added in by DuluApp
  subtractLoading: () => {} // Added in by DuluApp
};

function handleError(error: AxiosError) {
  if (!DuluAxios.setNetworkError) throw error;
  if (error.response) DuluAxios.setNetworkError({ type: "server" });
  else DuluAxios.setNetworkError({ type: "connection" });
}

function getAuthToken() {
  if (!DuluAxios.authToken) {
    try {
      DuluAxios.authToken = document!
        .querySelector("meta[name=csrf-token]")!
        .getAttribute("content")!;
    } catch (err) {
      // In Rails test environment there is no csrf token
      DuluAxios.authToken = "None";
    }
  }
  return DuluAxios.authToken;
}

function clearNetworkError() {
  if (DuluAxios.clearNetworkError) DuluAxios.clearNetworkError();
}

export default DuluAxios;
