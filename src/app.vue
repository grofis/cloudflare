<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 设置根元素字体大小，方便使用 rem */
html {
  font-size: 16px;
}

/* 设置移动端视图 */
#app {
  max-width: 750px;  /* 或者其他合适的宽度 */
  margin: 0 auto;
  min-height: 100vh;
  background: #fff;
  /* 可选：添加手机外观 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 适配不同屏幕 */
@media screen and (max-width: 600px) {
  #app {
    width: 100%;
  }
}

/* 禁用页面滚动，只允许内容区域滚动 */
body {
  /* overflow: hidden; */
  background: #f5f5f5;  /* 可选：设置背景色 */
}

/* 内容区域可滚动 */
.content {
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;  /* iOS 滚动优化 */
}
</style> 