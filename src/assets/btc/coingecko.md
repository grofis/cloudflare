[交易公开数据](https://api.coingecko.com/api/v3/coins/markets)
[图标工具](https://www.coingecko.com/zh/%E5%B0%8F%E5%B7%A5%E5%85%B7/coin_compare_chart_widget)
[api接口](https://www.coingecko.com/zh/api) 

```
{
    // 基本信息
    "id": "bitcoin",                    // 币种唯一标识符
    "symbol": "btc",                    // 交易符号
    "name": "Bitcoin",                  // 币种全名
    "image": "https://bitcoin.png",     // 币种图标URL

    // 当前市场数据
    "current_price": 101801,            // 当前价格(USD)
    "market_cap": 2016236867198,        // 市值(当前流通量 * 当前价格)
    "market_cap_rank": 1,               // 市值排名
    "fully_diluted_valuation": 2137702659226,  // 完全稀释估值(最大供应量 * 当前价格)

    // 交易数据
    "total_volume": 47764581329,        // 24小时交易量(USD)
    "high_24h": 102512,                 // 24小时最高价
    "low_24h": 98688,                   // 24小时最低价

    // 价格变化
    "price_change_24h": 2517.99,        // 24小时价格变化(USD)
    "price_change_percentage_24h": 2.53618,  // 24小时价格变化百分比
    
    // 市值变化
    "market_cap_change_24h": 50348860716,    // 24小时市值变化(USD)
    "market_cap_change_percentage_24h": 2.56113,  // 24小时市值变化百分比

    // 供应量信息
    "circulating_supply": 19806765,     // 当前流通量
    "total_supply": 21000000,           // 总供应量
    "max_supply": 21000000,             // 最大供应量

    // 历史极值
    "ath": 108135,                      // 历史最高价(All Time High)
    "ath_change_percentage": -5.73736,  // 距离ATH的跌幅
    "ath_date": "2024-12-17T15:02:41.429Z",  // ATH达成日期
    "atl": 67.81,                       // 历史最低价(All Time Low)
    "atl_change_percentage": 150220.20999,    // 距离ATL的涨幅
    "atl_date": "2013-07-06T00:00:00.000Z",  // ATL达成日期

    // 其他信息
    "roi": null,                        // 投资回报率(某些币种可能为null)
    "last_updated": "2025-01-07T04:50:21.484Z",  // 数据最后更新时间

    // 7天价格走势数据
    "sparkline_in_7d": {
        "price": [/*...价格数组...*/]   // 7天内的价格点数据
    },

    // 24小时价格变化百分比(另一种表示)
    "price_change_percentage_24h_in_currency": 2.536177047431934
}
```