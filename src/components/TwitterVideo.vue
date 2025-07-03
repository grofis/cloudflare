<template>
  <div>
    <a-checkbox-group v-model:value="filterParams.types" :options="typeOptions" @change="typeChange" />
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        {{ filterParams.time == 0 ? "选择时间" : selectedLabel }}
        <DownOutlined />
      </a>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item v-for="item in timeOptions" :key="item.value">
            <a href="javascript:;">{{ item.label }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-row :gutter="10">
      <a-col :span="12">
        <a-row>
          <a-col :span="24" style="margin-bottom: 15px; border-bottom: 1px solid #e8e8e8" v-for="item in leftData"
            :key="item.id">
            <a-comment :avatar="item.sender.avatar">
              <template #author>
                <a :href="`https://x.com/${item.sender.screen_name}`" target="_blank">
                  <span style="font-weight: bold">{{ item.sender.name }}</span>
                </a>

                <span style="font-weight: bold" class="screen-name">
                  @{{ item.sender.screen_name }}</span>
              </template>
              <template #content>
                <a-typography-text type="secondary">{{
                  item.sender.description
                  }}</a-typography-text>
              </template>
              <template #datetime>
                <span style="color: #888">
                  {{ item.sender.created_at }}注册
                  {{ item.sender.statuses_count }}推文
                  {{ item.sender.followers_count }}关注
                </span>
              </template>
            </a-comment>
            <a :href="item.href" target="_blank">
              <a-typography-text :copyable="getCopyable(item)" strong>
                {{ item.full_text }}
              </a-typography-text>
            </a>
            <a-typography-text type="secondary">
              {{ item.created_at }}
            </a-typography-text>
            <VideoPlayer :data="item" :currentPlayingId="currentPlayingId" @play="handlePlay" />
            <a-button v-for="{ icon, text } in item.actions" :key="icon" style="margin-right: 8px"
              @click="handleActionClick(text, item)">
              <component :is="icon" />
              {{ text }}
            </a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row>
          <a-col :span="24" v-for="item in rightData" style="margin-bottom: 15px; border-bottom: 1px solid #e8e8e8"
            :key="item.id" @mouseenter="
              () => {
                hoverId = item.id;
              }
            " @mouseleave="
              () => {
                hoverId = '';
              }
            ">
            <a-comment :avatar="item.sender.avatar">
              <template #author>
                <a :href="`https://x.com/${item.sender.screen_name}`" target="_blank">
                  <span style="font-weight: bold">{{ item.sender.name }}</span>
                </a>

                <span style="font-weight: bold" class="expandable-content screen-name">
                  @{{ item.sender.screen_name }}</span>
              </template>
              <template #content>
                <a-typography-text type="secondary">{{
                  item.sender.description
                  }}</a-typography-text>
              </template>
              <template #datetime>
                <span style="color: #888">
                  {{ item.sender.created_at }}注册
                  {{ item.sender.statuses_count }}推文
                  {{ item.sender.followers_count }}关注
                </span>
              </template>
            </a-comment>
            <a :href="item.href" target="_blank">
              <a-typography-text :copyable="getCopyable(item)" strong>
                {{ item.full_text }}
              </a-typography-text>
            </a>
            <a-typography-text type="secondary">
              {{ item.created_at }}
            </a-typography-text>
            <VideoPlayer :data="item" :currentPlayingId="currentPlayingId" @play="handlePlay" />
            <a-button v-for="{ icon, text } in item.actions" :key="icon" style="margin-right: 8px"
              @click="handleActionClick(text, item)">
              <component :is="icon" />
              {{ text }}
            </a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import {
  BookOutlined,
  CommentOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
  ShareAltOutlined,
  MoreOutlined,
} from "@ant-design/icons-vue";
import VideoPlayer from "./child/VideoPlayer.vue";
import { useRouter } from "vue-router";
import { formatTimeAgo } from "../utils/timeUtils"
import moment from "moment";
import { message } from "ant-design-vue";
const leftData = reactive([]);
const rightData = reactive([]);
const currentPlayingId = ref(null); // 当前正在播放的视频ID

const hoverId = ref("");
const filterParams = reactive({
  types: ["Search"],      // 多选类型
  time: 0,                // 时间筛选
  // 你还可以加其他筛选项
});
const typeOptions = [
  {
    label: "书签",
    value: "Bookmark",
  },
  {
    label: "时间线",
    value: "Search",
  },
  {
    label: "未标注",
    value: "Unlabeled",
  },
  {
    label: "视频",
    value: "Video",
  },
];
const timeOptions = [
  {
    label: "选择时间",
    value: 0,
  },
  {
    label: "1天内",
    value: 1,
  },
  {
    label: "3天内",
    value: 3,
  },
  {
    label: "5天内",
    value: 5,
  },
  {
    label: "一周内",
    value: 7,
  },
  {
    label: "所有",
    value: 10000,
  },
];

// 计算属性，自动根据 selectedTime 显示 label
const filterLabel = computed(() => {
  const typeStr = filterParams.types.join("-");
  const timeObj = timeOptions.find(t => t.value === filterParams.time);
  return `${typeStr} ${timeObj ? timeObj.label : ""}`;
});

//时间间隔选择
const handleMenuClick = (e) => {
  filterParams.time = Number(e.key)
  getLaestTweets();
};
function handlePlay(id) {
  currentPlayingId.value = id;
}

function mouseIn(item) {
  hoverId.value = item.id;

  // if (success) {
  //     message.success('文本已复制到剪贴板');
  // } else {
  //     message.error('复制失败');
  // }
}

// 获取复制配置
const getCopyable = (item) => {
  return {
    text: item.href,
    tooltips: ["复制链接", "复制成功"],
    onCopy: () => {
      message.success("链接已复制到剪贴板");
    },
  };
};


function typeChange(checkedValues) {
  // checkedValues 就是最新的选中数组
  // console.log("当前选中:", checkedValues);
  // console.log(type.value);
  // 这里可以做你需要的逻辑
  getLaestTweets();
}

onMounted(() => {
  getLaestTweets();
});

//获取最新的数据
async function getLaestTweets() {
  const url = `${import.meta.env.VITE_API_URL}/x/get`;
  // const url = 'https://sunziagent.com/x/get'

  console.log("url is:", url);
  // 使用 try-catch 处理超时错误
  try {
    let para = {
      type: [...filterParams.types], // 复制数组，防止被修改
      time: filterParams.time,
      isRefresh: true,
    };
    if (filterParams.time !== 0 && !para.type.includes("Time")) {
      para.type.push("Time");
    }

    let options = {
      method: "POST", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，指明发送的数据格式
      },
      body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    console.log(`${para.type}:list`, data.ids)
    if (data.ids) {
      let key = `twitter_list`;
      localStorage.setItem(key, JSON.stringify(data.ids));
    }
    data = data.data;
    leftData.length = 0;
    rightData.length = 0;
    console.log(data);
    if (data.length > 0) {
      if (Array.isArray(data)) {
        data.forEach((item, idx) => {
          let temp = { ...item };

          try {
            temp.sender = item.sender;
            temp.sender.created_at = formatTimeAgo(temp.sender.created_at);
            temp.actions = [
              { icon: BookOutlined, text: item.bookmark_count }, // 收藏
              { icon: CommentOutlined, text: item.quote_count }, // 引用/带评论转推
              { icon: HeartOutlined, text: item.favorite_count }, // 喜欢/点赞
              { icon: MessageOutlined, text: item.reply_count }, // 回复
              { icon: RetweetOutlined, text: item.retweet_count }, // 转推
              { icon: MoreOutlined, text: "详情" }, // 转推
            ];

            temp.created_at = formatTimeAgo(item.created_at);
          } catch (error) {
            console.log(error);
            console.log("item is:\n", item);
          }

          if (idx % 2 === 0) {
            leftData.push(temp);
          } else {
            rightData.push(temp);
          }
        });
      }
    }
    console.log("data:", data);
    // 处理数据...
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error("请求超时");
      // 处理超时错误...
    } else {
      console.error("请求失败:", error);
      // 处理其他错误...
    }
  }
}

const router = useRouter();
//action点击事件
function handleActionClick(action, item) {

  console.log("item is ", item);
  const handleDetailClick = () => {
    let data = { ...item }
    console.log("1 item", data);
    // 将数据存储到 localStorage
    localStorage.setItem("current_twitter_item", JSON.stringify(data));

    // 使用 query 而不是 params 来传递数据
    const routeData = router.resolve({
      name: "TwitterDetail",
    });
    window.open(routeData.href, "_blank");
  };
  switch (action) {
    case "详情":
      // 处理详情点击事件
      handleDetailClick();
      break;
    // 可以添加其他 action 的处理
    default:
      console.log("未处理的 action:", action);
  }
}
</script>

<style scoped>
.video-container {
  width: 100%;
  position: relative;
  cursor: pointer;
}

video {
  display: block;
  max-width: 100%;
}

:deep(.ant-comment .ant-comment-inner) {
  padding-bottom: 0;
}

/* 可选：为内容添加渐变效果 */
.screen-name,
.description {
  display: block;
  transition: transform 0.3s ease-out;
}
</style>