import axios from "axios";
import { appConfig } from "@/configs/app.config";

const mainApi = axios.create({
  baseURL: appConfig.baseApi,
  timeout: 10000,
  withCredentials: true,
  validateStatus: (status) => {
    // Accept all statuses except for 401 and 500
    return status !== 401 && status !== 500; // Reject 401 and 500 statuses
  },
});

// Add a request interceptor
mainApi.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // const getToken = localStorage.getItem("token");
    // if (getToken) {
    //   const token = getToken.replace(/['"]+/g, "");
    //   config.headers["Authorization"] = `Bearer ${token}`;
    //   config.headers["ngrok-skip-browser-warning"] = "69420";
    // }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
mainApi.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default mainApi;
