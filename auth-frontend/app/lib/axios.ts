import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_BACKEND_URL
    : process.env.LOCAL_BACKEND_URL;

axios.defaults.withCredentials = true; // Enable sending cookies with requests

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log(
      "Sending request to backend:",
      config.baseURL! + config.url,
      "Request Data:",
      config.data
    );

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    console.log(
      "Receiving response to frontend:",
      response.config.baseURL! + response.config.url,
      "Response Data:",
      JSON.stringify(response.config.data, null, 2)
    );
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
