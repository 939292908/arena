const m = require('mithril');
const config = require('@/config.js');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const Danmaku = require('danmaku').default;

const logic = {
    danmaku: null, // 弹幕实例
    timerID: null, // 定时器ID
    // 发1个弹幕
    sendDanmaku(option) {
        // option: {
        //     user: 用户名
        //     text: 弹幕
        // }
        var comment = {
            // text: option.text
            render() {
                var $div = document.createElement('div');
                $div.innerHTML = `
                    <div class="pub-danmaku-item px-2 has-text-level-1">
                        <div class="pub-danmaku-item-user mr-2 has-bg-primary">${option.user}</div>
                        <div class="">${option.text}</div>
                    </div>`;
                return $div;
            }
        };
        logic.danmaku.emit(comment);
    },
    // 跑弹幕
    runDanmaku(list) {
        // 开始时间
        let startTime = new Date();
        // 能发弹幕列表
        let canSends = list.filter(item => item);

        // 定时刷弹幕
        logic.timerID = setInterval(() => {
            // 更新 能发的弹幕列表
            canSends = canSends.filter(item => {
                // 当前时间线之前 弹幕
                if (new Date() - startTime >= item.time) {
                    logic.sendDanmaku(item);// 发送
                } else {
                    return true;
                }
            });
            // 重置弹幕状态
            if (canSends.length === 0) {
                canSends = list.filter(item => item);
                startTime = new Date();
            }
        }, 100);
    },
    // 弹幕 接口
    getArenaBarrage() {
        const params = {
            data: {
                vp: config.exchId
            }
        };
        Http.getArenaBarrage(params).then(arg => {
            if (arg.result.code === 0) {
                const data = [
                    [200, "比特币大师", "成功没有捷径，但暴富有捷径！来竞技场就是了！"],
                    [1200, "雨晨的清风", "卢本伟牛逼社团请求出战！"],
                    [3200, "深巷的猫", "竞技场上有三条命，亏完可复活继续干！"],
                    [4000, "区块链骑士", "天王盖地虎，结束一等奖！"],
                    [5000, "Long", "不会吧，500名以内都有奖！不会吧，你连500名都进不了？"],
                    [6500, "大大大汤包", "竞技场上，一切皆有可能！"],
                    [8000, "勇敢的小萝卜", "何以解忧，唯有竞技场的万U奖励！"],
                    [10000, "Sky", "iphone12出来了，来竞技场1U就有机会拿下！"],
                    [11200, "比特币", "模拟盘上赢真金，1U门票夺万U奖励！"],
                    [12400, "短线军师", "无忌寒社区长吴所畏惧请求出战！"],
                    [13200, "稳中求胜", "中本聪死粉社区上本聪邀您来战！"],
                    [15400, "小白说币", "前500名都有奖，一定有我！"],
                    [17600, "二师兄第一", "1U就可参赛，奖励分分钟上万！"],
                    [19000, "涨涨涨", "第一名瓜分奖池20%奖励？是时候表演真正的技术了！"],
                    [21000, "多多多", "看好了，我要用1U赢10000U！"],
                    [23600, "Usmile", "第一名的奖励是我的，耶稣都留不住！"],
                    [24600, "跟着我赚钱", "别人薅羊毛，我要薅羊肉！"],
                    [26000, "Follow me", "不懂合约，所以我要在实战中学习，还拿下万U奖励！"],
                    [27000, "谈币大师", "0风险赢真金？模拟盘放心玩！"],
                    [28000, "Brown", "合约实盘总踏空，竞技场中人上人！"],
                    [29000, "萫柰ル丶", "少买一瓶水，在这里1U可赢上万！"],
                    [30600, "漫步云海涧", "波场创始人孙哥请求出战！！"],
                    [31000, "合约之王", "币圈第一分析师晨阳请求出战！！"],
                    [32000, "我很萌喲！", "币coin明星带单师肥宅请求出战！!"],
                    [33000, "竞技第一", "宝二爷美国战区请求出战！！"],
                    [34600, "Daniel", "火星人重现竞技场，请求出战！！"],
                    [35000, "何仙姑说币", "马云门徒昊天社区邀您来战！"],
                    [36000, "盈利归我", "币富社区创始人燃哥邀您来战！"],
                    [37000, "Astia", "前海基金刘烨邀您来战！"],
                    [38000, "马爸爸", "北辰学院齐少邀您来战！"],
                    [39000, "保险真好", "恭喜币圈巴菲特大空翼报名成功！！"],
                    [40000, "烟雨彷徨", "恭喜合约之王比特皇报名成功！！"]
                ];
                // 构建数据
                const list = logic.buildDanmakuList(data);
                // 运行弹幕
                logic.runDanmaku(list);
                console.log('弹幕 success', list);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            console.log('弹幕 error', err);
            m.redraw();
        });
    },
    // 构建弹幕数据
    buildDanmakuList(data) {
        // const list = Object.keys(data).map((key, index) => {
        //     return {
        //         user: key,
        //         text: data[key],
        //         status: true,
        //         time: (index + 1) * Math.random() * 1000
        //     };
        // });
        const list = data.map(item => {
            return {
                time: item[0],
                user: item[1][0],
                text: item[2]
            };
        });
        return list;
    },
    // 初始化弹幕
    initDanmaku() {
        logic.danmaku = new Danmaku({
            container: document.getElementById('my-container'),
            // engine: 'canvas',
            speed: 60
        });
    },
    oninit(vnode) {
        logic.getArenaBarrage(); // 弹幕接口
    },
    oncreate(vnode) {
        logic.initDanmaku(); // 初始化
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        clearInterval(logic.timerID); // 清除定时器
        logic.danmaku.destroy(); // 清除弹幕
    }
};

module.exports = logic;
