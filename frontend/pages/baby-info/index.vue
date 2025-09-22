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
import { reactive, ref } from 'vue'
import { nameApi } from '../../api/user.js'

const loading = ref(false)

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

const generateNames = async () => {
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
