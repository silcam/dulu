import axios from "axios";

export default function DuluAxios() {}

DuluAxios.get = async (url, params) => {
  console.log(`GET ${url}`);
  const response = await axios.get(url, {
    params: params
  });
  assertStatusOK(response);
  return response.data;
};

DuluAxios.post = async (url, data) => {
  console.log(`POST ${url}`);
  data.authenticity_token = getAuthToken();
  const response = await axios.post(url, data);
  assertStatusOK(response);
  return response.data;
};

DuluAxios.put = async (url, data) => {
  console.log(`PUT ${url}`);
  data.authenticity_token = getAuthToken();
  const response = await axios.put(url, data);
  assertStatusOK(response);
  return response.data;
};

DuluAxios.delete = async url => {
  console.log(`DELETE ${url}`);
  const response = await axios({
    method: "delete",
    url: url,
    data: {
      authenticity_token: getAuthToken()
    }
  });
  assertStatusOK(response);
  return response.data;
};

function assertStatusOK(response) {
  if (!statusOK(response)) throw Non200ResponseException(response);
  clearNetworkError();
}

function statusOK(response) {
  return Math.floor(response.status / 100) == 2;
}

function getAuthToken() {
  if (!DuluAxios.authToken)
    DuluAxios.authToken = document
      .querySelector("meta[name=csrf-token]")
      .getAttribute("content");
  return DuluAxios.authToken;
}

function Non200ResponseException(response) {
  this.name = "Non200ResponseException";
  this.response = response;
}

function clearNetworkError() {
  if (DuluAxios.clearNetworkError) DuluAxios.clearNetworkError();
}
