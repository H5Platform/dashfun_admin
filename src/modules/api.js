import axios from "axios";

const testUrl = "https://tma-server-test.dashfun.games";
const prodUrl = "https://tma-server.dashfun.games";
const devUrl = "http://localhost:8088"

let serverUrl = devUrl;
console.log("HostName", window.location.hostname);

if (window.location.hostname.startsWith("admin-test.dashfun.games")) {
  serverUrl = testUrl
} else if (window.location.hostname.startsWith("admin.dashfun.games")) {
  serverUrl = prodUrl;
}

console.log("ServerUrl", serverUrl);

export const getImageUrl = (id, url) =>
  `https://res.dashfun.games/images/${id}/${url}`;

export const requestWithAuthHeader = axios.create();
// requestWithAuthHeader.defaults.headers.common["Authorization"] =
//   DataCenter.authHeaderValue;

const API = {
  userLogin: serverUrl + "/api/v1/admin/login",
  loginCheck: serverUrl + "/api/v1/admin/login_check",
  userCreate: serverUrl + "/api/v1/admin/user/create",

  gameCreate: serverUrl + "/api/v1/admin/game/create",
  gameSearch: serverUrl + "/api/v1/admin/game/search",
  gameUpdate: serverUrl + "/api/v1/admin/game/update",
  gameApiSecret: (gameId) => serverUrl + `/api/v1/admin/game/${gameId}/api_sec`,

  updateImage: serverUrl + "/api/v1/admin/game/upload_image",

  userSearch: serverUrl + "/api/v1/admin/user/search",

  resetPassword: serverUrl + "/api/v1/admin/user/reset_password",
  updateUserInfo: serverUrl + "/api/v1/admin/user/update_base_info",
  updateUserStatus: serverUrl + "/api/v1/admin/user/update_status",

  taskSearch: serverUrl + "/api/v1/admin/task/search",
  taskForGame: serverUrl + "/api/v1/admin/task/get_by_game/",
  taskUpdate: serverUrl + "/api/v1/admin/task/update",
  taskCreate: serverUrl + "/api/v1/admin/task/create",

  coinGet: (gameId) => serverUrl + `/api/v1/admin/coin/get/${gameId}`,
  coinUpdate: (gameId) => serverUrl + `/api/v1/admin/coin/update/${gameId}`,

  activateUser: serverUrl + "/api/v1/admin/user/active",
};

export default API;
