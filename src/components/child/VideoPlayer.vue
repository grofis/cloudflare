<template>

    <div class="video-container">
        <!-- 封面图 -->
        <a-image width="100%" :src="data.image_url" :preview="!hasVideo" @click="handleCoverClick" v-if="showCover"
            style="border-radius: 8px;" />

        <!-- 视频 -->
        <video v-else ref="videoRef" :src="data.video_url" controls preload="metadata"
            :class="{ hidden: showCover }" style="width: 100%; border-radius: 8px; display: block;"
            @canplay="handleCanPlay" @pause="handlePause" @play="handlePlay" @ended="handleEnded"
            :poster="data.image_url"
            @click.prevent="handleVideoClick" @dblclick.prevent />
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// Props 定义
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    currentPlayingId: [String, Number]
})

// Emits 定义
const emit = defineEmits(['play'])

// 响应式状态
const showCover = ref(true)
const isPlaying = ref(false)
const videoRef = ref(null)
const savedProgress = ref(0)

// 计算属性
const hasVideo = computed(() =>
    props.data.video_url && props.data.video_url.length > 0
)

// 生命周期钩子
onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 监听当前播放ID变化
watch(
    () => props.currentPlayingId,
    (newId) => {
        if (newId !== props.data.id && videoRef.value && isPlaying.value) {
            pauseVideo()
        }
    }
)

// 事件处理函数
function handleCoverClick() {
    if (hasVideo.value) {
        showCover.value = false
        emit('play', props.data.id)
    }
}

function handleCanPlay() {
    const video = videoRef.value
    if (!video) return

    // 恢复之前的播放进度
    if (savedProgress.value > 0) {
        video.currentTime = savedProgress.value
    }

    // 自动播放
    video.play().then(() => {
        isPlaying.value = true
    }).catch(error => {
        console.error('自动播放失败:', error)
        // 播放失败时回到封面状态
        showCover.value = true
        isPlaying.value = false
    })
}

function handlePlay() {
    isPlaying.value = true
}

function handlePause() {
    isPlaying.value = false
    if (videoRef.value) {
        savedProgress.value = videoRef.value.currentTime
    }
}

function handleEnded() {
    isPlaying.value = false
    savedProgress.value = 0
    // 播放结束后回到封面状态，不自动重播
    showCover.value = true
}

function handleVideoClick(event) {
    console.log('dianji')
    // 避免点击控制条时触发
    if (event.target.tagName !== 'VIDEO') return

    const video = videoRef.value
    if (!video) return

    if (video.paused) {
        // 视频处于暂停状态，点击播放
        video.play()
    } else {
        // 视频正在播放，点击暂停
        video.pause()
    }
}

function handleVisibilityChange() {
    if (document.hidden && isPlaying.value) {
        pauseVideo()
    }
}

function pauseVideo() {
    if (videoRef.value && !videoRef.value.paused) {
        videoRef.value.pause()
    }
}

function replayVideo() {
    const video = videoRef.value
    if (!video) return

    video.currentTime = 0
    video.play().then(() => {
        isPlaying.value = true
    }).catch(error => {
        console.error('重播失败:', error)
    })
}

</script>

<style scoped>
.video-container {
    width: 100%;
    position: relative;
}

.hidden {
    display: none !important;
}

video {
    max-width: 100%;
    height: auto;
}

.loading-wrapper {
    position: relative;
    cursor: pointer;
}

.loading-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.6);
}

.loading-text {
    margin-top: 8px;
    color: #666;
    font-size: 12px;
}
</style>