import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({})
  const isLoggedIn = ref(false)
  const loginType = ref('') // 'wechat' | 'normal'
  
  const hasToken = computed(() => !!token.value)
  const isWechatLogin = computed(() => loginType.value === 'wechat')
  
  const setToken = (newToken, type = 'normal') => {
    token.value = newToken
    isLoggedIn.value = true
    loginType.value = type
    // 保存到本地存储
    try {
      uni.setStorageSync('token', newToken)
      uni.setStorageSync('loginType', type)
    } catch (error) {
      console.error('保存token失败:', error)
    }
  }
  
  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
    try {
      uni.setStorageSync('userInfo', newUserInfo)
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }
  
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    isLoggedIn.value = false
    loginType.value = ''
    try {
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('loginType')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  }
  
  // 初始化用户信息
  const initUserInfo = () => {
    try {
      const savedToken = uni.getStorageSync('token')
      const savedUserInfo = uni.getStorageSync('userInfo')
      const savedLoginType = uni.getStorageSync('loginType')
      
      if (savedToken) {
        token.value = savedToken
        isLoggedIn.value = true
      }
      
      if (savedUserInfo) {
        userInfo.value = savedUserInfo
      }
      
      if (savedLoginType) {
        loginType.value = savedLoginType
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  }
  
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
  }
})
