<template>
    <view class="container">
        <view class="login-form">
            <view class="logo-section">
                <text class="logo-text">宝宝起名</text>
                <text class="logo-desc">给宝宝一个美好的名字</text>
            </view>

            <!-- 微信登录状态显示 -->
            <view class="wechat-login-section">
                <view v-if="!loading && !isLoggedIn" class="login-hint">
                    <text class="hint-text">正在为您自动登录...</text>
                    <view class="loading-dots">
                        <text>●</text>
                        <text>●</text>
                        <text>●</text>
                    </view>
                </view>

                <view v-if="loading" class="login-progress">
                    <text class="progress-text">{{ loadingText }}</text>
                </view>

                <view v-if="loginError" class="login-error">
                    <text class="error-text">{{ errorMessage }}</text>
                    <button class="btn-retry" @click="retryWechatLogin">重试登录</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { userApi } from '@/api/user'

const userStore = useUserStore()
const loading = ref(false)
const loadingText = ref('正在获取微信授权...')
const loginError = ref(false)
const errorMessage = ref('')
const isLoggedIn = ref(false)

// 页面加载时自动执行微信登录
onMounted(() => {
    // 先检查是否已经登录
    userStore.initUserInfo()

    if (userStore.hasToken) {
        isLoggedIn.value = true
        // 如果已登录，直接跳转到起名页面
        setTimeout(() => {
            uni.switchTab({
                url: '/pages/baby-info/index'
            })
        }, 1000)
    } else {
        // 开始微信自动登录流程
        startWechatLogin()
    }
})

// 开始微信登录流程
const startWechatLogin = async () => {
    loading.value = true
    loadingText.value = '正在获取微信授权...'
    loginError.value = false

    try {
        // 第一步：获取微信登录授权
        const loginResult = await getWechatAuth()

        if (loginResult.code) {
            loadingText.value = '正在登录中...'

            // 第二步：使用授权码向后端请求登录
            const result = await userApi.wechatLogin({
                code: loginResult.code
            })

            console.log('微信登录结果:', result)
            if (result.success) {
                // 登录成功，保存用户信息
                userStore.setToken(result.data.token, 'wechat')
                userStore.setUserInfo(result.data.userInfo)

                isLoggedIn.value = true
                loadingText.value = '登录成功，正在跳转...'

                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })

                // 自动跳转到起名页面
                setTimeout(() => {
                    uni.switchTab({
                        url: '/pages/baby-info/index'
                    })
                }, 1500)
            } else {
                throw new Error(result.message || '微信登录失败')
            }
        } else {
            throw new Error('获取微信授权失败')
        }
    } catch (error) {
        console.error('微信登录失败:', error)
        loginError.value = true
        errorMessage.value = error.message || '网络错误，请重试'
    } finally {
        loading.value = false
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

// 重试微信登录
const retryWechatLogin = () => {
    startWechatLogin()
}

// 不需要 return，setup 语法糖会自动暴露
</script>

<style scoped>
.login-form {
    background: #fff;
    border-radius: 12rpx;
    padding: 60rpx;
    margin: 100rpx 40rpx;
}

.logo-section {
    text-align: center;
    margin-bottom: 80rpx;
}

.logo-text {
    font-size: 48rpx;
    font-weight: bold;
    color: #007aff;
    display: block;
    margin-bottom: 20rpx;
}

.logo-desc {
    font-size: 28rpx;
    color: #999;
}

.wechat-login-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 200rpx;
    justify-content: center;
}

.login-hint {
    text-align: center;
    margin-bottom: 40rpx;
}

.hint-text {
    font-size: 30rpx;
    color: #666;
    margin-bottom: 20rpx;
    display: block;
}

.loading-dots {
    display: flex;
    justify-content: center;
    gap: 10rpx;
}

.loading-dots text {
    font-size: 24rpx;
    color: #007aff;
    animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots text:nth-child(1) {
    animation-delay: -0.32s;
}

.loading-dots text:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.login-progress {
    text-align: center;
    padding: 40rpx;
}

.progress-text {
    font-size: 32rpx;
    color: #007aff;
    font-weight: 500;
}

.login-error {
    text-align: center;
    padding: 40rpx;
}

.error-text {
    font-size: 28rpx;
    color: #e74c3c;
    margin-bottom: 30rpx;
    display: block;
}

.btn-retry {
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 8rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
}

.btn-retry:active {
    opacity: 0.8;
}
</style>
