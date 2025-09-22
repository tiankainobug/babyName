"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props, { expose: __expose }) {
    __expose();
    const nameList = common_vendor.ref([]);
    onMounted(() => {
      const options = common_vendor.index.getLaunchOptionsSync();
      if (options.names) {
        try {
          const names = JSON.parse(decodeURIComponent(options.names));
          nameList.value = names.names || [];
        } catch (error) {
          console.error("解析起名结果失败:", error);
          loadMockData();
        }
      } else {
        loadMockData();
      }
    });
    const loadMockData = () => {
      nameList.value = [
        {
          fullName: "张雨涵",
          score: 95,
          meaning: "雨润万物，涵养深厚，寓意品德高尚，学识渊博",
          wuxing: "水木",
          strokes: "11-8-12"
        },
        {
          fullName: "张梓萱",
          score: 92,
          meaning: "梓树成材，萱草忘忧，寓意成才立业，快乐无忧",
          wuxing: "木木",
          strokes: "11-11-15"
        },
        {
          fullName: "张诗涵",
          score: 90,
          meaning: "诗书传家，涵养性情，寓意文采飞扬，品格高雅",
          wuxing: "金水",
          strokes: "11-13-12"
        }
      ];
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const saveToHistory = () => {
      common_vendor.index.showToast({
        title: "已保存到历史",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/history/index"
        });
      }, 1e3);
    };
    const __returned__ = { nameList, loadMockData, goBack, saveToHistory, ref: common_vendor.ref };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.nameList, (name, index, i0) => {
      return {
        a: common_vendor.t(name.fullName),
        b: common_vendor.t(name.score),
        c: common_vendor.t(name.meaning),
        d: common_vendor.t(name.wuxing),
        e: common_vendor.t(name.strokes),
        f: index
      };
    }),
    b: common_vendor.o($setup.goBack),
    c: common_vendor.o($setup.saveToHistory)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-189efbaa"], ["__file", "/Users/tiankai/myFile/code/babyName/frontend/pages/name-result/index.vue"]]);
wx.createPage(MiniProgramPage);
