// API 请求封装
const BASE_URL = 'http://localhost:8080/api'

class Request {
  constructor() {
    this.baseURL = BASE_URL
    this.timeout = 10000
  }
  
  // 通用请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      // 获取token
      let token = ''
      try {
        token = uni.getStorageSync('token') || ''
      } catch (error) {
        console.error('获取token失败:', error)
      }
      
      // 设置请求头
      const header = {
        'Content-Type': 'application/json',
        ...options.header
      }
      
      if (token) {
        header.Authorization = `Bearer ${token}`
      }
      
      uni.request({
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header,
        timeout: this.timeout,
        success: (res) => {
          console.log('API请求成功:', res)
          
          if (res.statusCode === 200) {
            resolve(res.data)
          } else if (res.statusCode === 401) {
            // token过期，跳转登录页
            try {
              uni.removeStorageSync('token')
            } catch (error) {
              console.error('清除token失败:', error)
            }
            uni.navigateTo({
              url: '/pages/login/index'
            })
            reject(new Error('登录已过期'))
          } else {
            reject(new Error(res.data?.message || '请求失败'))
          }
        },
        fail: (err) => {
          console.error('API请求失败:', err)
          uni.showToast({
            title: '网络请求失败',
            icon: 'error'
          })
          reject(err)
        }
      })
    })
  }
  
  // GET请求
  get(url, data = {}) {
    return this.request({
      url,
      method: 'GET',
      data
    })
  }
  
  // POST请求
  post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }
  
  // PUT请求
  put(url, data = {}) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }
  
  // DELETE请求
  delete(url, data = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data
    })
  }
}

export default new Request()
