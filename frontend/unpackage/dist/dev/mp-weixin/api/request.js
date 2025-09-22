"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8080/api";
class Request {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = 1e4;
  }
  // 通用请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      let token = "";
      try {
        token = common_vendor.index.getStorageSync("token") || "";
      } catch (error) {
        console.error("获取token失败:", error);
      }
      const header = __spreadValues({
        "Content-Type": "application/json"
      }, options.header);
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }
      common_vendor.index.request({
        url: this.baseURL + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header,
        timeout: this.timeout,
        success: (res) => {
          var _a;
          console.log("API请求成功:", res);
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            try {
              common_vendor.index.removeStorageSync("token");
            } catch (error) {
              console.error("清除token失败:", error);
            }
            common_vendor.index.navigateTo({
              url: "/pages/login/index"
            });
            reject(new Error("登录已过期"));
          } else {
            reject(new Error(((_a = res.data) == null ? void 0 : _a.message) || "请求失败"));
          }
        },
        fail: (err) => {
          console.error("API请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "error"
          });
          reject(err);
        }
      });
    });
  }
  // GET请求
  get(url, data = {}) {
    return this.request({
      url,
      method: "GET",
      data
    });
  }
  // POST请求
  post(url, data = {}) {
    return this.request({
      url,
      method: "POST",
      data
    });
  }
  // PUT请求
  put(url, data = {}) {
    return this.request({
      url,
      method: "PUT",
      data
    });
  }
  // DELETE请求
  delete(url, data = {}) {
    return this.request({
      url,
      method: "DELETE",
      data
    });
  }
}
const request = new Request();
exports.request = request;
