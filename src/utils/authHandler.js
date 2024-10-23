// import { btoa } from "btoa";
import { requestWithAuthHeader } from "../modules/api";
import DataCenter from "../modules/DataCenter";
import Events from "../modules/Events";
import JSEvent from "./JSEvent";

const saveAuthInfo = (data, username = "admin") => {
  const { id, token } = data;
  DataCenter.isLoggedIn = true;
  DataCenter.userInfo.token = token;
  DataCenter.userInfo.username = username;
  DataCenter.userInfo.userId = id;
  setAuthHeader(id, token);
  saveToLocalStorage(id, token, username);
};

const setAuthHeader = (id, token) => {
  // console.log("data", data);
  console.log("set auth header", id, token);
  const auth = {
    user_id: id,
    token: token,
  };
  console.log("auth", auth);
  const authToken = btoa(JSON.stringify(auth));
  const authHeaderValue = `Bearer ${authToken}`;
  requestWithAuthHeader.defaults.headers.common["Authorization"] =
    authHeaderValue;
  // DataCenter.authHeaderValue = authHeaderValue;
};

const saveToLocalStorage = (id, token, username) => {
  console.log("save to local storage", id, token, username);
  localStorage.setItem("user_id", id);
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
};

const getFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  console.log("get from local storage", token, id, username);
  return { token, id, username };
};

const validateToken = () => {
  const { token } = getFromLocalStorage();
  if (token === null) {
    return false;
  }
  return true;
};

const logoutHandler = () => {
  DataCenter.isLoggedIn = false;
  DataCenter.userInfo = {
    userId: "",
    username: "",
    token: "",
  };
  localStorage.removeItem("user_id");
  localStorage.removeItem("token");
  requestWithAuthHeader.defaults.headers.common["Authorization"] = "";
  JSEvent.emit(Events.Account.Logout);
};

export {
  setAuthHeader,
  saveAuthInfo,
  validateToken,
  getFromLocalStorage,
  logoutHandler,
};
