function formatTimeAgo (timestamp) {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}天前`;
    }
    if (hours > 0) {
        return `${hours}小时前`;
    }
    if (minutes > 0) {
        return `${minutes}分钟前`;
    }
    return `${seconds}秒前`;
};

// 默认导出所有函数
export {
    formatTimeAgo,
};