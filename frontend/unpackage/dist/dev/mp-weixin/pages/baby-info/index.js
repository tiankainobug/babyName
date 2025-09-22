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
const api_user = require("../../api/user.js");
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    __expose();
    const loading = common_vendor.ref(false);
    const babyInfo = common_vendor.reactive({
      surname: "",
      gender: "",
      birthDate: "",
      birthTime: "",
      preferences: []
    });
    const preferences = common_vendor.ref([
      { label: "寓意美好", value: "good_meaning" },
      { label: "朗朗上口", value: "easy_pronounce" },
      { label: "文雅诗意", value: "poetic" },
      { label: "寓意智慧", value: "wisdom" },
      { label: "寓意健康", value: "health" },
      { label: "寓意富贵", value: "wealth" }
    ]);
    const selectGender = (gender) => {
      babyInfo.gender = gender;
    };
    const onDateChange = (e) => {
      babyInfo.birthDate = e.detail.value;
    };
    const onTimeChange = (e) => {
      babyInfo.birthTime = e.detail.value;
    };
    const togglePreference = (value) => {
      const index = babyInfo.preferences.indexOf(value);
      if (index > -1) {
        babyInfo.preferences.splice(index, 1);
      } else {
        babyInfo.preferences.push(value);
      }
    };
    const generateNames = () => __async(this, null, function* () {
      if (!babyInfo.surname) {
        common_vendor.index.showToast({
          title: "请输入姓氏",
          icon: "error"
        });
        return;
      }
      if (!babyInfo.gender) {
        common_vendor.index.showToast({
          title: "请选择性别",
          icon: "error"
        });
        return;
      }
      if (!babyInfo.birthDate) {
        common_vendor.index.showToast({
          title: "请选择出生日期",
          icon: "error"
        });
        return;
      }
      loading.value = true;
      try {
        const result = yield api_user.nameApi.generateNames(babyInfo);
        if (result.success) {
          common_vendor.index.navigateTo({
            url: `/pages/name-result/index?names=${encodeURIComponent(JSON.stringify(result.data))}`
          });
        } else {
          common_vendor.index.showToast({
            title: result.message || "起名失败",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("起名失败:", error);
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    });
    const __returned__ = { loading, babyInfo, preferences, selectGender, onDateChange, onTimeChange, togglePreference, generateNames, reactive: common_vendor.reactive, ref: common_vendor.ref, get nameApi() {
      return api_user.nameApi;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.babyInfo.surname,
    b: common_vendor.o(($event) => $setup.babyInfo.surname = $event.detail.value),
    c: $setup.babyInfo.gender === "male" ? 1 : "",
    d: common_vendor.o(($event) => $setup.selectGender("male")),
    e: $setup.babyInfo.gender === "female" ? 1 : "",
    f: common_vendor.o(($event) => $setup.selectGender("female")),
    g: common_vendor.t($setup.babyInfo.birthDate || "请选择出生日期"),
    h: $setup.babyInfo.birthDate,
    i: common_vendor.o($setup.onDateChange),
    j: common_vendor.t($setup.babyInfo.birthTime || "请选择出生时间"),
    k: $setup.babyInfo.birthTime,
    l: common_vendor.o($setup.onTimeChange),
    m: common_vendor.f($setup.preferences, (pref, index, i0) => {
      return {
        a: common_vendor.t(pref.label),
        b: index,
        c: $setup.babyInfo.preferences.includes(pref.value) ? 1 : "",
        d: common_vendor.o(($event) => $setup.togglePreference(pref.value), index)
      };
    }),
    n: common_vendor.t($setup.loading ? "正在生成..." : "开始起名"),
    o: common_vendor.o($setup.generateNames),
    p: $setup.loading
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-313b02f5"], ["__file", "/Users/tiankai/myFile/code/babyName/frontend/pages/baby-info/index.vue"]]);
wx.createPage(MiniProgramPage);
