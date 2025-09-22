<template>
    <view class="container">
        <view class="result-header">
            <text class="title">推荐名字</text>
            <text class="subtitle">为您精心挑选的美好名字</text>
        </view>

        <view class="names-list">
            <view
                v-for="(name, index) in nameList"
                :key="index"
                class="name-card"
            >
                <view class="name-main">
                    <text class="name-text">{{ name.fullName }}</text>
                    <text class="name-score">评分: {{ name.score }}</text>
                </view>
                <view class="name-meaning">
                    <text class="meaning-label">寓意解析：</text>
                    <text class="meaning-text">{{ name.meaning }}</text>
                </view>
                <view class="name-details">
                    <text class="detail-item">五行: {{ name.wuxing }}</text>
                    <text class="detail-item">笔画: {{ name.strokes }}</text>
                </view>
            </view>
        </view>

        <view class="action-buttons">
            <button class="btn-secondary" @click="goBack">重新填写</button>
            <button class="btn-primary" @click="saveToHistory">保存到历史</button>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const nameList = ref([])

onMounted(() => {
    const options = uni.getLaunchOptionsSync()
    if (options.names) {
        try {
            const names = JSON.parse(decodeURIComponent(options.names))
            nameList.value = names.names || []
        } catch (error) {
            console.error('解析起名结果失败:', error)
            // 使用mock数据
            loadMockData()
        }
    } else {
        loadMockData()
    }
})

const loadMockData = () => {
    // Mock数据，用于演示
    nameList.value = [
        {
            fullName: '张雨涵',
            score: 95,
            meaning: '雨润万物，涵养深厚，寓意品德高尚，学识渊博',
            wuxing: '水木',
            strokes: '11-8-12'
        },
        {
            fullName: '张梓萱',
            score: 92,
            meaning: '梓树成材，萱草忘忧，寓意成才立业，快乐无忧',
            wuxing: '木木',
            strokes: '11-11-15'
        },
        {
            fullName: '张诗涵',
            score: 90,
            meaning: '诗书传家，涵养性情，寓意文采飞扬，品格高雅',
            wuxing: '金水',
            strokes: '11-13-12'
        }
    ]
}

const goBack = () => {
    uni.navigateBack()
}

const saveToHistory = () => {
    // 这里可以调用API保存到历史记录
    uni.showToast({
        title: '已保存到历史',
        icon: 'success'
    })

    setTimeout(() => {
        uni.switchTab({
            url: '/pages/history/index'
        })
    }, 1000)
}

// 不需要 return，setup 语法糖会自动暴露
</script>

<style scoped>
.result-header {
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

.names-list {
    padding: 0 20rpx;
}

.name-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.name-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.name-text {
    font-size: 36rpx;
    font-weight: bold;
    color: #007aff;
}

.name-score {
    font-size: 28rpx;
    color: #ff6b35;
    font-weight: bold;
}

.name-meaning {
    margin-bottom: 20rpx;
}

.meaning-label {
    font-size: 26rpx;
    color: #666;
}

.meaning-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
}

.name-details {
    display: flex;
    gap: 30rpx;
}

.detail-item {
    font-size: 24rpx;
    color: #999;
}

.action-buttons {
    display: flex;
    gap: 20rpx;
    padding: 40rpx 20rpx;
}

.btn-secondary {
    flex: 1;
    background: #f5f5f5;
    color: #333;
    border-radius: 8rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 32rpx;
}

.btn-secondary:active {
    opacity: 0.7;
}
</style>
