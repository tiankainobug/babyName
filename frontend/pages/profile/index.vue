<template>
    <view class="container">
        <!-- 用户信息区域 -->
        <view class="profile-header">
            <view class="avatar-section">
                <view v-if="userInfo.avatarUrl" class="avatar-image">
                    <image
                        class="avatar"
                        :src="userInfo.avatarUrl"
                        mode="aspectFill"
                    ></image>
                </view>
                <view v-else class="avatar-placeholder">
                    👤
                </view>
            </view>
            <view class="user-info">
                <text class="phone-number">{{ userInfo.nickname || '未绑定手机号' }}</text>
                <!--<text class="login-type">{{ loginTypeText }}</text>-->
            </view>
        </view>

        <!-- 功能菜单 -->
        <view class="menu-section">
            <view class="menu-item" @click="goToHistory">
                <view class="menu-icon">📝</view>
                <view class="menu-content">
                    <text class="menu-title">历史记录</text>
                    <text class="menu-desc">查看起名历史</text>
                </view>
                <view class="menu-arrow">></view>
            </view>

            <view class="menu-item" @click="goToFavorites">
                <view class="menu-icon">⭐</view>
                <view class="menu-content">
                    <text class="menu-title">我的收藏</text>
                    <text class="menu-desc">收藏的名字</text>
                </view>
                <view class="menu-arrow">></view>
            </view>
        </view>

        <!-- 设置区域 -->
        <view class="settings-section">
            <view class="menu-item" @click="logout" v-if="isLoggedIn">
                <view class="menu-icon">🚪</view>
                <view class="menu-content">
                    <text class="menu-title">退出登录</text>
                </view>
                <view class="menu-arrow">></view>
            </view>

            <view class="menu-item" @click="goToLogin" v-else>
                <view class="menu-icon">🔐</view>
                <view class="menu-content">
                    <text class="menu-title">登录/注册</text>
                </view>
                <view class="menu-arrow">></view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../../store/user.js'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const isLoggedIn = computed(() => userStore.isLoggedIn)
const loginType = computed(() => userStore.loginType)

const loginTypeText = computed(() => {
    switch (loginType.value) {
        case 'wechat':
            return '微信登录'
        case 'normal':
            return '手机号登录'
        default:
            return '未登录'
    }
})

onMounted(() => {
    userStore.initUserInfo()
})

const goToHistory = () => {
    if (!isLoggedIn.value) {
        showLoginTip()
        return
    }
    uni.navigateTo({
        url: '/pages/history/index'
    })
}

const goToFavorites = () => {
    if (!isLoggedIn.value) {
        showLoginTip()
        return
    }
    uni.navigateTo({
        url: '/pages/favorites/index'
    })
}

const goToLogin = () => {
    // 跳转到起名页面，会自动触发登录
    uni.switchTab({
        url: '/pages/baby-info/index'
    })
}

const showLoginTip = () => {
    uni.showModal({
        title: '提示',
        content: '请先登录后使用此功能，即将跳转到起名页面进行登录',
        confirmText: '确定',
        success: (res) => {
            if (res.confirm) {
                goToLogin()
            }
        }
    })
}

const logout = () => {
    uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                userStore.logout()
                uni.showToast({
                    title: '已退出登录',
                    icon: 'success'
                })
            }
        }
    })
}
</script>

<style scoped>
.profile-header {
    background: linear-gradient(135deg, #007aff, #5ac8fa);
    padding: 60rpx 40rpx 40rpx;
    margin: 20rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    gap: 30rpx;
}

.avatar-section {
    position: relative;
}

.avatar-image .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60rpx;
}

.user-info {
    flex: 1;
    color: white;
}

.phone-number {
    font-size: 36rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
}

.login-type {
    font-size: 26rpx;
    opacity: 0.8;
}

.menu-section,
.settings-section {
    margin: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    transition: background-color 0.3s;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:active {
    background-color: #f8f8f8;
}

.menu-icon {
    font-size: 40rpx;
    margin-right: 30rpx;
}

.menu-content {
    flex: 1;
}

.menu-title {
    font-size: 30rpx;
    color: #333;
    display: block;
    margin-bottom: 5rpx;
}

.menu-desc {
    font-size: 24rpx;
    color: #999;
}

.menu-arrow {
    font-size: 28rpx;
    color: #ccc;
    font-weight: bold;
}

.settings-section {
    margin-top: 40rpx;
}

.settings-section .menu-title {
    color: #ff3b30;
}
</style>
