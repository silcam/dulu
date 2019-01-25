import axios from "axios";
import DuluAxios from "util/DuluAxios";
jest.mock("axios");

const mockAuthToken = "123abc";
DuluAxios.authToken = mockAuthToken;
const mockData = { data: "data", status: 200 };
const mockParams = { a: 1, b: "2" };
const mockParamsWithAuthToken = Object.assign(mockParams, {
  authenticity_token: mockAuthToken
});
const mockUrl = "/api/languages/4";

beforeEach(() => {
  axios.get.mockResolvedValue(mockData);
  axios.post.mockResolvedValue(mockData);
  axios.put.mockResolvedValue(mockData);
  axios.mockResolvedValue({ status: 200 });
});

test("Basic get", async () => {
  expect.assertions(2);
  const resp = await DuluAxios.get(mockUrl);
  expect(resp).toEqual(mockData.data);
  expect(axios.get.mock.calls[0][0]).toEqual(mockUrl);
});

test("Get with params", async () => {
  expect.assertions(1);
  const resp = await DuluAxios.get(mockUrl, mockParams);
  expect(axios.get.mock.calls[1][1]).toEqual({ params: mockParams });
});

test("Post", async () => {
  expect.assertions(3);
  const resp = await DuluAxios.post(mockUrl, mockParams);
  expect(resp).toEqual(mockData.data);
  expect(axios.post.mock.calls[0][0]).toEqual(mockUrl);
  expect(axios.post.mock.calls[0][1]).toEqual(mockParamsWithAuthToken);
});

test("Put", async () => {
  expect.assertions(3);
  const resp = await DuluAxios.put(mockUrl, mockParams);
  expect(resp).toEqual(mockData.data);
  expect(axios.put.mock.calls[0][0]).toEqual(mockUrl);
  expect(axios.put.mock.calls[0][1]).toEqual(mockParamsWithAuthToken);
});

test("Delete", async () => {
  expect.assertions(1);
  const resp = await DuluAxios.delete(mockUrl);
  expect(axios.mock.calls[0][0]).toEqual({
    method: "delete",
    url: mockUrl,
    data: {
      authenticity_token: mockAuthToken
    }
  });
});

const non200ResponseException = {
  name: "Non200ResponseException",
  response: {
    status: 404
  }
};

test("404 throws exception", async () => {
  axios.get.mockResolvedValue({ status: 404 });
  expect.assertions(1);
  await expect(DuluAxios.get(mockUrl)).rejects.toEqual(non200ResponseException);
});
