function formatTimeAgo(time) {
    const now = Date.now();
    const created = new Date(time).getTime();
    const diff = Math.floor((now - created) / 1000); // 差值（秒）

    if (diff >= 86400) {
        // 1天=86400秒
        const days = Math.floor(diff / 86400);
        return `${days}天前`;
    } else if (diff >= 3600) {
        // 1小时=3600秒
        const hours = Math.floor(diff / 3600);
        return `${hours}小时前`;
    } else if (diff >= 60) {
        // 1分钟=60秒
        const minutes = Math.floor(diff / 60);
        return `${minutes}分钟前`;
    } else {
        return `${diff}秒前`;
    }
};

// 默认导出所有函数
export {
    formatTimeAgo,
};