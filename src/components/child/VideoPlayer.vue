<template>
    <div class="video-container">
        <!-- 封面图 -->
        <a-image v-if="!isPlaying[data.id] && !isLoading[data.id]" width="100%" :src="data.image_url" :preview="false"
            @click="() => startLoad(data.id)" />

        <!-- 加载中 (点击可取消) -->
        <div v-if="isLoading[data.id]" class="loading-wrapper" @click="() => cancelLoad(data.id)">
            <a-image width="100%" :src="data.image_url" :preview="false" />
            <div class="loading-mask">
                <a-spin size="large" />
                <div class="loading-text">点击取消加载</div>
            </div>
        </div>

        <!-- 视频 -->
        <video :ref="el => videoRefs[data.id] = el" :src="data.video_url" controls preload="auto"
            :class="{ 'video-hidden': !isPlaying[data.id] }" style="width: 100%"
            @loadeddata="() => handleLoadedData(data.id)" @canplay="() => handleCanPlay(data.id)"
            @pause="() => handlePause(data.id)" @ended="() => handleEnded(data.id)" />
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const { data } = props;
console.log('palyer data:', JSON.stringify(data));

const isPlaying = ref({});
const isLoading = ref({});
const videoRefs = ref({});

const startLoad = (id) => {
    isLoading.value[id] = true;
    // 开始加载视频
    if (videoRefs.value[id]) {
        videoRefs.value[id].load();
    }
};

const cancelLoad = (id) => {
    isLoading.value[id] = false;
};

const handleLoadedData = (id) => {
    console.log('视频数据已加载');
};

const handleCanPlay = (id) => {
    console.log('视频可以流畅播放了');
    // 如果还在加载状态，说明用户没有取消，可以自动播放
    if (isLoading.value[id]) {
        isLoading.value[id] = false;
        isPlaying.value[id] = true;
        // 尝试自动播放
        if (videoRefs.value[id]) {
            videoRefs.value[id].play()
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
};

const handleEnded = (id) => {
    isPlaying.value[id] = false;
    if (videoRefs.value[id]) {
        videoRefs.value[id].currentTime = 0;
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