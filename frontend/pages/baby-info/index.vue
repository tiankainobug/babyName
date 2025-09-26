<template>
    <view class="container">
        <view class="form-section">
            <view class="section-title">宝宝信息</view>

            <view class="form-item">
                <view class="form-label">姓氏</view>
                <input
                    class="form-input"
                    v-model="babyInfo.surname"
                    placeholder="请输入宝宝姓氏"
                />
            </view>

            <view class="form-item">
                <view class="form-label">性别</view>
                <view class="gender-selector">
                    <view
                        class="gender-item"
                        :class="{ active: babyInfo.gender === 'male' }"
                        @click="selectGender('male')"
                    >
                        👦 男孩
                    </view>
                    <view
                        class="gender-item"
                        :class="{ active: babyInfo.gender === 'female' }"
                        @click="selectGender('female')"
                    >
                        👧 女孩
                    </view>
                </view>
            </view>

            <view class="form-item">
                <view class="form-label">出生日期</view>
                <picker
                    mode="date"
                    :value="babyInfo.birthDate"
                    @change="onDateChange"
                >
                    <view class="picker-item">
                        {{ babyInfo.birthDate || '请选择出生日期' }}
                    </view>
                </picker>
            </view>

            <view class="form-item">
                <view class="form-label">出生时间</view>
                <picker
                    mode="time"
                    :value="babyInfo.birthTime"
                    @change="onTimeChange"
                >
                    <view class="picker-item">
                        {{ babyInfo.birthTime || '请选择出生时间' }}
                    </view>
                </picker>
            </view>

            <view class="form-item">
                <view class="form-label">起名偏好</view>
                <view class="preference-list">
                    <view
                        v-for="(pref, index) in preferences"
                        :key="index"
                        class="preference-item"
                        :class="{ active: babyInfo.preferences.includes(pref.value) }"
                        @click="togglePreference(pref.value)"
                    >
                        {{ pref.label }}
                    </view>
                </view>
            </view>

            <button class="btn-primary" @click="generateNames" :disabled="loading">
                {{ loading ? '正在生成...' : '开始起名' }}
            </button>
        </view>
    </view>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { nameApi, userApi } from '../../api/user.js'
import { useUserStore } from '@/store'

const loading = ref(false)
const userStore = useUserStore()

// 登录相关状态（仅保留错误处理）
const loginErrorMessage = ref('')

const babyInfo = reactive({
    surname: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    preferences: []
})

const preferences = ref([
    { label: '寓意美好', value: 'good_meaning' },
    { label: '朗朗上口', value: 'easy_pronounce' },
    { label: '文雅诗意', value: 'poetic' },
    { label: '寓意智慧', value: 'wisdom' },
    { label: '寓意健康', value: 'health' },
    { label: '寓意富贵', value: 'wealth' }
])

const selectGender = (gender) => {
    babyInfo.gender = gender
}

const onDateChange = (e) => {
    babyInfo.birthDate = e.detail.value
}

const onTimeChange = (e) => {
    babyInfo.birthTime = e.detail.value
}

const togglePreference = (value) => {
    const index = babyInfo.preferences.indexOf(value)
    if (index > -1) {
        babyInfo.preferences.splice(index, 1)
    } else {
        babyInfo.preferences.push(value)
    }
}

// 页面加载时检查登录状态并自动登录
onMounted(() => {
    initializeLogin()
})

// 初始化登录流程
const initializeLogin = async () => {
    // 先检查是否已经有token
    userStore.initUserInfo()
    
    if (userStore.hasToken) {
        // 已经登录，直接进入页面
        console.log('用户已登录，直接进入页面')
        return
    }
    
    // 需要登录，静默开始自动登录
    await startSilentLogin()
}

// 开始静默登录流程
const startSilentLogin = async () => {
    try {
        // 第一步：获取微信登录授权
        const loginResult = await getWechatAuth()

        if (loginResult.code) {
            // 第二步：使用授权码向后端请求登录
            const result = await userApi.wechatLogin({
                code: loginResult.code
            })

            console.log('微信登录结果:', result)
            if (result.success) {
                // 登录成功，保存用户信息
                userStore.setToken(result.data.token, 'wechat')
                userStore.setUserInfo(result.data.userInfo)

                console.log('静默登录成功')
            } else {
                throw new Error(result.message || '微信登录失败')
            }
        } else {
            throw new Error('获取微信授权失败')
        }
    } catch (error) {
        console.error('微信登录失败:', error)
        loginErrorMessage.value = error.message || '网络错误，请重试'
        // 显示登录失败弹框
        showLoginErrorModal()
    }
}

// 获取微信授权
const getWechatAuth = () => {
    return new Promise((resolve, reject) => {
        uni.login({
            provider: 'weixin',
            success: (loginRes) => {
                console.log('微信登录授权成功:', loginRes)
                resolve(loginRes)
            },
            fail: (error) => {
                console.error('微信登录授权失败:', error)
                reject(new Error('微信授权失败'))
            }
        })
    })
}

// 显示登录失败弹框
const showLoginErrorModal = () => {
    uni.showModal({
        title: '登录失败',
        content: loginErrorMessage.value,
        confirmText: '重试',
        cancelText: '取消',
        success: (res) => {
            if (res.confirm) {
                // 用户选择重试
                startSilentLogin()
            }
        }
    })
}

const generateNames = async () => {
    // 确保用户已登录
    if (!userStore.hasToken) {
        uni.showToast({
            title: '请先登录',
            icon: 'error'
        })
        await initializeLogin()
        return
    }

    // 验证必填字段
    if (!babyInfo.surname) {
        uni.showToast({
            title: '请输入姓氏',
            icon: 'error'
        })
        return
    }

    if (!babyInfo.gender) {
        uni.showToast({
            title: '请选择性别',
            icon: 'error'
        })
        return
    }

    if (!babyInfo.birthDate) {
        uni.showToast({
            title: '请选择出生日期',
            icon: 'error'
        })
        return
    }

    loading.value = true

    try {
        const result = await nameApi.generateNames(babyInfo)

        if (result.success) {
            // 将结果保存到页面参数中，跳转到结果页
            uni.navigateTo({
                url: `/pages/name-result/index?names=${ encodeURIComponent(JSON.stringify(result.data)) }`
            })
        } else {
            uni.showToast({
                title: result.message || '起名失败',
                icon: 'error'
            })
        }
    } catch (error) {
        console.error('起名失败:', error)
        uni.showToast({
            title: '网络错误，请重试',
            icon: 'error'
        })
    } finally {
        loading.value = false
    }
}

// 不需要 return，setup 语法糖会自动暴露
</script>

<style scoped>
.form-section {
    background: #fff;
    border-radius: 12rpx;
    padding: 40rpx;
    margin: 20rpx;
}

.section-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
    text-align: center;
}

.gender-selector {
    display: flex;
    gap: 20rpx;
}

.gender-item {
    flex: 1;
    background: #f5f5f5;
    border: 2rpx solid #e5e5e5;
    border-radius: 8rpx;
    padding: 20rpx;
    text-align: center;
    font-size: 28rpx;
}

.gender-item.active {
    background: #007aff;
    color: #fff;
    border-color: #007aff;
}

.picker-item {
    background: #f5f5f5;
    border: 2rpx solid #e5e5e5;
    border-radius: 8rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
}

.preference-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15rpx;
}

.preference-item {
    background: #f5f5f5;
    border: 2rpx solid #e5e5e5;
    border-radius: 20rpx;
    padding: 15rpx 30rpx;
    font-size: 26rpx;
    color: #333;
}

.preference-item.active {
    background: #007aff;
    color: #fff;
    border-color: #007aff;
}
</style>
