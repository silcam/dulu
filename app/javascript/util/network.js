import axios from "axios";

export async function axiosDelete(url, data) {
  return await axios({
    method: "delete",
    url: url,
    data: data
  });
}

export function statusOK(response) {
  return Math.floor(response.status / 100) == 2;
}
