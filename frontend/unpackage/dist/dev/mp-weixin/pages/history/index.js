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
    const historyList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      loadHistory();
    });
    const loadHistory = () => __async(this, null, function* () {
      loading.value = true;
      try {
        const result = yield api_user.nameApi.getHistory();
        if (result.success) {
          historyList.value = result.data || [];
        } else {
          loadMockHistory();
        }
      } catch (error) {
        console.error("加载历史记录失败:", error);
        loadMockHistory();
      } finally {
        loading.value = false;
      }
    });
    const loadMockHistory = () => {
      historyList.value = [
        {
          id: 1,
          babyInfo: {
            surname: "张",
            gender: "female",
            birthDate: "2024-01-15",
            birthTime: "10:30"
          },
          names: [
            { fullName: "张雨涵", score: 95, meaning: "雨润万物，涵养深厚" },
            { fullName: "张梓萱", score: 92, meaning: "梓树成材，萱草忘忧" },
            { fullName: "张诗涵", score: 90, meaning: "诗书传家，涵养性情" }
          ],
          createTime: "2024-01-20 14:30"
        },
        {
          id: 2,
          babyInfo: {
            surname: "李",
            gender: "male",
            birthDate: "2024-02-10",
            birthTime: "08:15"
          },
          names: [
            { fullName: "李浩宇", score: 94, meaning: "浩瀚宇宙，志向远大" },
            { fullName: "李志强", score: 91, meaning: "志向坚定，意志坚强" },
            { fullName: "李明轩", score: 89, meaning: "明智聪慧，气宇轩昂" }
          ],
          createTime: "2024-02-15 16:45"
        }
      ];
    };
    const goToNaming = () => {
      common_vendor.index.switchTab({
        url: "/pages/baby-info/index"
      });
    };
    const viewNameDetail = (record, nameIndex) => {
      const name = record.names[nameIndex];
      common_vendor.index.showModal({
        title: name.fullName,
        content: name.meaning,
        showCancel: false
      });
    };
    const viewAllNames = (record) => {
      common_vendor.index.navigateTo({
        url: `/pages/name-result/index?names=${encodeURIComponent(JSON.stringify({ names: record.names }))}`
      });
    };
    const deleteRecord = (id) => __async(this, null, function* () {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条记录吗？",
        success: (res) => __async(this, null, function* () {
          if (res.confirm) {
            try {
              yield api_user.nameApi.deleteHistory(id);
              const index = historyList.value.findIndex((item) => item.id === id);
              if (index > -1) {
                historyList.value.splice(index, 1);
              }
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
            } catch (error) {
              console.error("删除失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        })
      });
    });
    const __returned__ = { historyList, loading, loadHistory, loadMockHistory, goToNaming, viewNameDetail, viewAllNames, deleteRecord, onMounted: common_vendor.onMounted, ref: common_vendor.ref, get nameApi() {
      return api_user.nameApi;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.historyList.length === 0
  }, $setup.historyList.length === 0 ? {
    b: common_vendor.o($setup.goToNaming)
  } : {
    c: common_vendor.f($setup.historyList, (record, index, i0) => {
      return {
        a: common_vendor.t(record.babyInfo.surname),
        b: common_vendor.t(record.babyInfo.gender === "male" ? "👦" : "👧"),
        c: common_vendor.t(record.createTime),
        d: common_vendor.f(record.names.slice(0, 3), (name, nameIndex, i1) => {
          return {
            a: common_vendor.t(name.fullName),
            b: common_vendor.t(name.score),
            c: nameIndex,
            d: common_vendor.o(($event) => $setup.viewNameDetail(record, nameIndex), nameIndex)
          };
        }),
        e: common_vendor.o(($event) => $setup.viewAllNames(record), index),
        f: common_vendor.o(($event) => $setup.deleteRecord(record.id), index),
        g: index
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b37acf1c"], ["__file", "/Users/tiankai/myFile/code/babyName/frontend/pages/history/index.vue"]]);
wx.createPage(MiniProgramPage);
