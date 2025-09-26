<template>
    <view class="container">
        <view class="favorites-header">
            <text class="title">我的收藏</text>
            <text class="subtitle">收藏的好名字</text>
        </view>

        <view v-if="favoritesList.length === 0" class="empty-state">
            <text class="empty-icon">⭐</text>
            <text class="empty-text">暂无收藏</text>
            <text class="empty-desc">快去收藏喜欢的名字吧</text>
            <button class="btn-primary" @click="goToNaming">开始起名</button>
        </view>

        <view v-else class="favorites-list">
            <view
                v-for="(favorite, index) in favoritesList"
                :key="index"
                class="favorite-card"
            >
                <view class="name-header">
                    <view class="name-info">
                        <text class="name-text">{{ favorite.fullName }}</text>
                        <text class="name-score">{{ favorite.score }}分</text>
                    </view>
                    <view class="favorite-actions">
                        <view class="action-btn" @click="viewDetail(favorite)">
                            详情
                        </view>
                        <view class="action-btn remove" @click="removeFavorite(favorite.id)">
                            取消收藏
                        </view>
                    </view>
                </view>

                <view class="name-meaning">
                    <text class="meaning-title">寓意解释：</text>
                    <text class="meaning-text">{{ favorite.meaning }}</text>
                </view>

                <view class="favorite-info">
                    <text class="baby-info">{{ favorite.babyInfo.surname }}宝宝 · {{ favorite.babyInfo.gender === 'male' ? '👦男孩' : '👧女孩' }}</text>
                    <text class="collect-time">{{ favorite.collectTime }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { nameApi } from '../../api/user.js'
import { useUserStore } from '@/store'

const favoritesList = ref([])
const loading = ref(false)
const userStore = useUserStore()

onMounted(() => {
    // 初始化用户信息
    userStore.initUserInfo()
    
    // 检查登录状态
    if (!userStore.hasToken) {
        // 未登录，提示并跳转到起名页面
        uni.showModal({
            title: '需要登录',
            content: '请先登录后查看收藏列表',
            showCancel: false,
            confirmText: '去登录',
            success: () => {
                uni.switchTab({
                    url: '/pages/baby-info/index'
                })
            }
        })
        return
    }
    
    loadFavorites()
})

const loadFavorites = async () => {
    loading.value = true
    try {
        const result = await nameApi.getFavorites()
        if (result.success) {
            favoritesList.value = result.data || []
        } else {
            // 加载mock数据用于演示
            loadMockFavorites()
        }
    } catch (error) {
        console.error('加载收藏列表失败:', error)
        // 加载mock数据
        loadMockFavorites()
    } finally {
        loading.value = false
    }
}

const loadMockFavorites = () => {
    // Mock收藏数据
    favoritesList.value = [
        {
            id: 1,
            fullName: '张雨涵',
            score: 95,
            meaning: '雨润万物，滋养生命；涵养深厚，包容万象。寓意孩子像春雨般温润，性格涵养深厚。',
            babyInfo: {
                surname: '张',
                gender: 'female'
            },
            collectTime: '2024-01-20 14:30'
        },
        {
            id: 2,
            fullName: '李浩宇',
            score: 94,
            meaning: '浩瀚如海，志向远大；宇宙广阔，胸怀宽广。寓意孩子胸怀宽广，志向远大。',
            babyInfo: {
                surname: '李',
                gender: 'male'
            },
            collectTime: '2024-02-15 16:45'
        },
        {
            id: 3,
            fullName: '王诗涵',
            score: 92,
            meaning: '诗书传家，文雅脱俗；涵养性情，品德高尚。寓意孩子富有诗意，品德高尚。',
            babyInfo: {
                surname: '王',
                gender: 'female'
            },
            collectTime: '2024-03-10 10:20'
        }
    ]
}

const goToNaming = () => {
    uni.switchTab({
        url: '/pages/baby-info/index'
    })
}

const viewDetail = (favorite) => {
    uni.showModal({
        title: favorite.fullName,
        content: favorite.meaning,
        showCancel: false,
        confirmText: '确定'
    })
}

const removeFavorite = async (id) => {
    uni.showModal({
        title: '确认取消收藏',
        content: '确定要取消收藏这个名字吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await nameApi.removeFavorite(id)
                    // 从列表中移除
                    const index = favoritesList.value.findIndex(item => item.id === id)
                    if (index > -1) {
                        favoritesList.value.splice(index, 1)
                    }
                    uni.showToast({
                        title: '取消收藏成功',
                        icon: 'success'
                    })
                } catch (error) {
                    console.error('取消收藏失败:', error)
                    uni.showToast({
                        title: '操作失败',
                        icon: 'error'
                    })
                }
            }
        }
    })
}
</script>

<style scoped>
.favorites-header {
    text-align: center;
    padding: 40rpx 20rpx;
}

.title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
}

.subtitle {
    font-size: 28rpx;
    color: #666;
}

.empty-state {
    text-align: center;
    padding: 100rpx 40rpx;
}

.empty-icon {
    font-size: 80rpx;
    display: block;
    margin-bottom: 30rpx;
}

.empty-text {
    font-size: 32rpx;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
}

.empty-desc {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 40rpx;
}

.favorites-list {
    padding: 0 20rpx;
}

.favorite-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.name-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
}

.name-info {
    flex: 1;
}

.name-text {
    font-size: 36rpx;
    font-weight: bold;
    color: #007aff;
    display: block;
    margin-bottom: 5rpx;
}

.name-score {
    font-size: 24rpx;
    color: #ff6b35;
    background: #fff3f0;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
}

.favorite-actions {
    display: flex;
    gap: 15rpx;
}

.action-btn {
    font-size: 24rpx;
    color: #007aff;
    padding: 8rpx 16rpx;
    border: 1rpx solid #007aff;
    border-radius: 16rpx;
    background: #f0f8ff;
}

.action-btn.remove {
    color: #ff3b30;
    border-color: #ff3b30;
    background: #fff5f5;
}

.action-btn:active {
    opacity: 0.7;
}

.name-meaning {
    margin-bottom: 20rpx;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 8rpx;
}

.meaning-title {
    font-size: 26rpx;
    color: #666;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
}

.meaning-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
}

.favorite-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24rpx;
    color: #999;
}

.baby-info {
    color: #666;
}

.collect-time {
    color: #999;
}
</style>



