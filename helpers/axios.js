import axios from "axios";

const Api = axios.create({
  // baseURL: "http://pizza-jungle.test/api/v1/",
  // baseURL: "http://57fa-197-210-64-233.ngrok.io/api/v1/",
  baseURL: "https://api.pizzajungleng.com/api/v1/",
  timeout: 15000,
});

export default Api;
