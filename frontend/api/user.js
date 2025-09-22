import request from './request.js'

// 用户相关API
export const userApi = {
  // 用户登录
  login(data) {
    return request.post('/user/login', data)
  },
  
  // 用户注册
  register(data) {
    return request.post('/user/register', data)
  },
  
  // 微信登录
  wechatLogin(data) {
    return request.post('/user/wechat-login', data)
  },
  
  // 获取用户信息
  getUserInfo() {
    return request.get('/user/info')
  }
}

// 起名相关API
export const nameApi = {
  // 提交宝宝信息并获取起名结果
  generateNames(data) {
    return request.post('/names/generate', data)
  },
  
  // 获取历史起名记录
  getHistory() {
    return request.get('/names/history')
  },
  
  // 删除历史记录
  deleteHistory(id) {
    return request.delete(`/names/history/${id}`)
  }
}
