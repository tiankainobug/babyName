"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const token = common_vendor.ref("");
  const userInfo = common_vendor.ref({});
  const isLoggedIn = common_vendor.ref(false);
  const loginType = common_vendor.ref("");
  const hasToken = common_vendor.computed(() => !!token.value);
  const isWechatLogin = common_vendor.computed(() => loginType.value === "wechat");
  const setToken = (newToken, type = "normal") => {
    token.value = newToken;
    isLoggedIn.value = true;
    loginType.value = type;
    try {
      common_vendor.index.setStorageSync("token", newToken);
      common_vendor.index.setStorageSync("loginType", type);
    } catch (error) {
      console.error("保存token失败:", error);
    }
  };
  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo;
    try {
      common_vendor.index.setStorageSync("userInfo", newUserInfo);
    } catch (error) {
      console.error("保存用户信息失败:", error);
    }
  };
  const logout = () => {
    token.value = "";
    userInfo.value = {};
    isLoggedIn.value = false;
    loginType.value = "";
    try {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.removeStorageSync("loginType");
    } catch (error) {
      console.error("清除用户信息失败:", error);
    }
  };
  const initUserInfo = () => {
    try {
      const savedToken = common_vendor.index.getStorageSync("token");
      const savedUserInfo = common_vendor.index.getStorageSync("userInfo");
      const savedLoginType = common_vendor.index.getStorageSync("loginType");
      if (savedToken) {
        token.value = savedToken;
        isLoggedIn.value = true;
      }
      if (savedUserInfo) {
        userInfo.value = savedUserInfo;
      }
      if (savedLoginType) {
        loginType.value = savedLoginType;
      }
    } catch (error) {
      console.error("初始化用户信息失败:", error);
    }
  };
  return {
    token,
    userInfo,
    isLoggedIn,
    loginType,
    hasToken,
    isWechatLogin,
    setToken,
    setUserInfo,
    logout,
    initUserInfo
  };
});
exports.useUserStore = useUserStore;
