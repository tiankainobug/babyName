"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
const api_user = require("../../api/user.js");
const store_user = require("../../store/user.js");
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    __expose();
    const userStore = store_user.useUserStore();
    const loading = common_vendor.ref(false);
    const loadingText = common_vendor.ref("正在获取微信授权...");
    const loginError = common_vendor.ref(false);
    const errorMessage = common_vendor.ref("");
    const isLoggedIn = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      userStore.initUserInfo();
      if (userStore.hasToken) {
        isLoggedIn.value = true;
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/baby-info/index"
          });
        }, 1e3);
      } else {
        startWechatLogin();
      }
    });
    const startWechatLogin = () => __async(this, null, function* () {
      loading.value = true;
      loadingText.value = "正在获取微信授权...";
      loginError.value = false;
      try {
        const loginResult = yield getWechatAuth();
        if (loginResult.code) {
          loadingText.value = "正在登录中...";
          const result = yield api_user.userApi.wechatLogin({
            code: loginResult.code
          });
          console.log("微信登录结果:", result);
          if (result.success) {
            userStore.setToken(result.data.token, "wechat");
            userStore.setUserInfo(result.data.userInfo);
            isLoggedIn.value = true;
            loadingText.value = "登录成功，正在跳转...";
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/baby-info/index"
              });
            }, 1500);
          } else {
            throw new Error(result.message || "微信登录失败");
          }
        } else {
          throw new Error("获取微信授权失败");
        }
      } catch (error) {
        console.error("微信登录失败:", error);
        loginError.value = true;
        errorMessage.value = error.message || "网络错误，请重试";
      } finally {
        loading.value = false;
      }
    });
    const getWechatAuth = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.login({
          provider: "weixin",
          success: (loginRes) => {
            console.log("微信登录授权成功:", loginRes);
            resolve(loginRes);
          },
          fail: (error) => {
            console.error("微信登录授权失败:", error);
            reject(new Error("微信授权失败"));
          }
        });
      });
    };
    const retryWechatLogin = () => {
      startWechatLogin();
    };
    const __returned__ = { userStore, loading, loadingText, loginError, errorMessage, isLoggedIn, startWechatLogin, getWechatAuth, retryWechatLogin, ref: common_vendor.ref, onMounted: common_vendor.onMounted, get useUserStore() {
      return store_user.useUserStore;
    }, get userApi() {
      return api_user.userApi;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$setup.loading && !$setup.isLoggedIn
  }, !$setup.loading && !$setup.isLoggedIn ? {} : {}, {
    b: $setup.loading
  }, $setup.loading ? {
    c: common_vendor.t($setup.loadingText)
  } : {}, {
    d: $setup.loginError
  }, $setup.loginError ? {
    e: common_vendor.t($setup.errorMessage),
    f: common_vendor.o($setup.retryWechatLogin)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d08ef7d4"], ["__file", "/Users/tiankai/myFile/code/babyName/frontend/pages/login/index.vue"]]);
wx.createPage(MiniProgramPage);
