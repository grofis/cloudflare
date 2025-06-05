<template>
    <div class="video-container">
        <!-- 封面图 -->
        <a-image v-if="(!isPlaying[data.id] && !isLoading[data.id])" width="100%" :src="data.image_url"
            :preview="!data.video_url || data.video_url.length < 1" @click="imageClick" style="border-radius: 8px;" />

        <!-- 加载中 (点击可取消) -->
        <div v-if="isLoading[data.id] && data.video_url && data.video_url.length > 0" class="loading-wrapper"
            @click="() => cancelLoad(data.id)">
            <a-image width="100%" :src="data.image_url" :preview="false" style="border-radius: 8px;" />
            <div class="loading-mask">
                <a-spin size="large" />
                <div class="loading-text">点击取消加载</div>
            </div>
        </div>

        <!-- 视频 -->
        <video v-if="isVideoVisible[data.id] && data.video_url && data.video_url.length > 0"
            :ref="el => videoRefs[data.id] = el" :src="data.video_url" controls preload="auto"
            :class="{ 'video-hidden': !isPlaying[data.id] }" style="width: 100%"
            @loadeddata="() => handleLoadedData(data.id)" @canplay="() => handleCanPlay(data.id)"
            @pause="() => handlePause(data.id)" @ended="() => handleEnded(data.id)" />
    </div>
</template>

<script setup>
import { ref, watch, nextTick, reactive, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    currentPlayingId: [String, Number]
})

const { data } = props;
// console.log('palyer data:', JSON.stringify(data));

const isPlaying = ref({});
const isLoading = ref({});
const videoRefs = reactive({});
const isVideoVisible = ref({});
const videoProgress = reactive({}); // 记录每个视频的进度

// 监听页面可见性
onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
});

function handleVisibilityChange() {
    if (document.hidden) {
        pauseAllVideos();
    }
}

// 暂停所有视频
function pauseAllVideos() {
    Object.values(videoRefs).forEach(video => {
        if (video && !video.paused) {
            video.pause();
        }
    });
}

// IntersectionObserver 监听视频是否可见
function observeVideo(el, id) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                if (videoRefs[id] && !videoRefs[id].paused) {
                    videoRefs[id].pause();
                }
            }
        });
    }, { threshold: 0.1 });
    observer.observe(el);
}


const imageClick = () => {
    if (data.video_url && data.video_url.length > 0) {
        isVideoVisible[data.id] = true
        startLoad(data.id)
    }
}

const emit = defineEmits(['play']);
const startLoad = (id) => {
    isLoading.value[id] = true;
    isVideoVisible.value[id] = true;
    console.log(id, '开始加载')
    // await nextTick(); // 等待DOM更新
    // 开始加载视频
    if (videoRefs[id]) {
        console.log(id, 'load')
        videoRefs[id].load();
    }
    emit('play', props.data.id);
};

const cancelLoad = (id) => {
    isLoading.value[id] = false;
};

const handleLoadedData = (id) => {
    console.log('视频数据已加载');
};

// 监听 currentPlayingId，切换时暂停非当前视频
watch(
    () => props.currentPlayingId,
    (newId) => {
        if (newId !== props.data.id && videoRefs[props.data.id]) {
            videoRefs[props.data.id].pause();
            //   videoRef.value.currentTime = 0; // 可选：重置进度
            // videoRef.value.src = ""; // 可选：彻底停止加载
        }
    }
);

const handleCanPlay = (id) => {
    console.log('视频可以流畅播放了');
    // 如果还在加载状态，说明用户没有取消，可以自动播放
    if (isLoading.value[id]) {
        isLoading.value[id] = false;
        isPlaying.value[id] = true;
        // 尝试自动播放
        if (videoRefs[id]) {
            if (videoProgress[id]) {
                videoRefs[id].currentTime = videoProgress[id];
            }
            videoRefs[id].play()
                .catch(error => {
                    console.error('自动播放失败:', error);
                    // 自动播放失败时（比如浏览器策略限制），回到封面图状态
                    isPlaying.value[id] = false;
                    isLoading.value[id] = false;
                });
        }
    }
};

const handlePause = (id) => {
    isPlaying.value[id] = false;
    videoProgress[id] = videoRefs[id].currentTime;
};

const handleEnded = (id) => {
    isPlaying.value[id] = false;
    if (videoRefs[id]) {
        videoRefs[id].currentTime = 0;
    }
};
</script>

<style scoped>
.video-container {
    width: 100%;
    position: relative;
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

.video-hidden {
    display: none;
}
</style>