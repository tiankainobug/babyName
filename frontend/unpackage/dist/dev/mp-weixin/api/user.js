"use strict";
const api_request = require("./request.js");
const userApi = {
  // 用户登录
  login(data) {
    return api_request.request.post("/user/login", data);
  },
  // 用户注册
  register(data) {
    return api_request.request.post("/user/register", data);
  },
  // 微信登录
  wechatLogin(data) {
    return api_request.request.post("/user/wechat-login", data);
  },
  // 获取用户信息
  getUserInfo() {
    return api_request.request.get("/user/info");
  }
};
const nameApi = {
  // 提交宝宝信息并获取起名结果
  generateNames(data) {
    return api_request.request.post("/names/generate", data);
  },
  // 获取历史起名记录
  getHistory() {
    return api_request.request.get("/names/history");
  },
  // 删除历史记录
  deleteHistory(id) {
    return api_request.request.delete(`/names/history/${id}`);
  },
  // 获取收藏列表
  getFavorites() {
    return api_request.request.get("/names/favorites");
  },
  // 添加收藏
  addFavorite(data) {
    return api_request.request.post("/names/favorites", data);
  },
  // 取消收藏
  removeFavorite(id) {
    return api_request.request.delete(`/names/favorites/${id}`);
  }
};
exports.nameApi = nameApi;
exports.userApi = userApi;
