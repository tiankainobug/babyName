<template>
    <view class="container">
        <view class="history-header">
            <text class="title">历史记录</text>
            <text class="subtitle">查看之前的起名结果</text>
        </view>

        <view v-if="historyList.length === 0" class="empty-state">
            <text class="empty-icon">📝</text>
            <text class="empty-text">暂无历史记录</text>
            <text class="empty-desc">去起个好名字吧</text>
            <button class="btn-primary" @click="goToNaming">开始起名</button>
        </view>

        <view v-else class="history-list">
            <view
                v-for="(record, index) in historyList"
                :key="index"
                class="history-card"
            >
                <view class="record-header">
                    <view class="baby-info">
                        <text class="baby-name">{{ record.babyInfo.surname }}宝宝</text>
                        <text class="baby-gender">{{ record.babyInfo.gender === 'male' ? '👦' : '👧' }}</text>
                    </view>
                    <view class="record-date">{{ record.createTime }}</view>
                </view>

                <view class="record-names">
                    <view
                        v-for="(name, nameIndex) in record.names.slice(0, 3)"
                        :key="nameIndex"
                        class="name-item"
                        @click="viewNameDetail(record, nameIndex)"
                    >
                        <text class="name-text">{{ name.fullName }}</text>
                        <text class="name-score">{{ name.score }}分</text>
                    </view>
                </view>

                <view class="record-actions">
                    <view class="action-btn" @click="viewAllNames(record)">
                        查看全部
                    </view>
                    <view class="action-btn delete" @click="deleteRecord(record.id)">
                        删除
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { nameApi } from '../../api/user.js'

const historyList = ref([])
const loading = ref(false)

onMounted(() => {
    loadHistory()
})

const loadHistory = async () => {
    loading.value = true
    try {
        const result = await nameApi.getHistory()
        if (result.success) {
            historyList.value = result.data || []
        } else {
            // 加载mock数据用于演示
            loadMockHistory()
        }
    } catch (error) {
        console.error('加载历史记录失败:', error)
        // 加载mock数据
        loadMockHistory()
    } finally {
        loading.value = false
    }
}

const loadMockHistory = () => {
    // Mock历史数据
    historyList.value = [
        {
            id: 1,
            babyInfo: {
                surname: '张',
                gender: 'female',
                birthDate: '2024-01-15',
                birthTime: '10:30'
            },
            names: [
                { fullName: '张雨涵', score: 95, meaning: '雨润万物，涵养深厚' },
                { fullName: '张梓萱', score: 92, meaning: '梓树成材，萱草忘忧' },
                { fullName: '张诗涵', score: 90, meaning: '诗书传家，涵养性情' }
            ],
            createTime: '2024-01-20 14:30'
        },
        {
            id: 2,
            babyInfo: {
                surname: '李',
                gender: 'male',
                birthDate: '2024-02-10',
                birthTime: '08:15'
            },
            names: [
                { fullName: '李浩宇', score: 94, meaning: '浩瀚宇宙，志向远大' },
                { fullName: '李志强', score: 91, meaning: '志向坚定，意志坚强' },
                { fullName: '李明轩', score: 89, meaning: '明智聪慧，气宇轩昂' }
            ],
            createTime: '2024-02-15 16:45'
        }
    ]
}

const goToNaming = () => {
    uni.switchTab({
        url: '/pages/baby-info/index'
    })
}

const viewNameDetail = (record, nameIndex) => {
    // 查看单个名字详情
    const name = record.names[nameIndex]
    uni.showModal({
        title: name.fullName,
        content: name.meaning,
        showCancel: false
    })
}

const viewAllNames = (record) => {
    // 查看该记录的所有名字
    uni.navigateTo({
        url: `/pages/name-result/index?names=${ encodeURIComponent(JSON.stringify({ names: record.names })) }`
    })
}

const deleteRecord = async (id) => {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await nameApi.deleteHistory(id)
                    // 从列表中移除
                    const index = historyList.value.findIndex(item => item.id === id)
                    if (index > -1) {
                        historyList.value.splice(index, 1)
                    }
                    uni.showToast({
                        title: '删除成功',
                        icon: 'success'
                    })
                } catch (error) {
                    console.error('删除失败:', error)
                    uni.showToast({
                        title: '删除失败',
                        icon: 'error'
                    })
                }
            }
        }
    })
}

// 不需要 return，setup 语法糖会自动暴露
</script>

<style scoped>
.history-header {
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

.history-list {
    padding: 0 20rpx;
}

.history-card {
    background: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.baby-info {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.baby-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.baby-gender {
    font-size: 28rpx;
}

.record-date {
    font-size: 24rpx;
    color: #999;
}

.record-names {
    margin-bottom: 20rpx;
}

.name-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.name-item:last-child {
    border-bottom: none;
}

.name-text {
    font-size: 28rpx;
    color: #007aff;
}

.name-score {
    font-size: 24rpx;
    color: #ff6b35;
}

.record-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
}

.action-btn {
    font-size: 26rpx;
    color: #007aff;
    padding: 10rpx 20rpx;
}

.action-btn.delete {
    color: #ff3b30;
}

.action-btn:active {
    opacity: 0.7;
}
</style>
