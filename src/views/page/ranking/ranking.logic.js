
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const Qrcode = require('qrcode');
// const I18n = require('@/languages/I18n').default;
const share = require('@/views/page/main/share/share.logic.js');
const utils = require('@/util/utils').default;
const config = require('@/config.js');
const cryptoChar = require('@/util/cryptoChar');
const globalModels = require('@/models/globalModels');

const logic = {
    myRank: -1, // 我的排名，-1未上榜
    pnl: "", // 我的当前盈亏
    rid: "", // 榜单id
    coin: "", // 活动币种
    timerID: "", // 更新榜单计时器id
    loadingOption: {
        isShow: {
            loadingShare: false,
            lodaingGetArenaRank: true,
            lodaingGetArenaUserInfo: true
        }
    },
    // 头部 组件配置
    headerOption: {
        left() {
            return {
                onclick() {
                    window.router.back();
                }
            };
        }
    },
    // 排名列表
    rankingList: [],
    // 分享 click
    toShareClick() {
        // window.$message({
        //     content: window.plus + "---" + window.$params,
        //     type: 'danger'
        // });
        const param = {};
        if (window.plus) {
            const uid = globalModels.getAccount().uid;
            param.link = window.location.origin + '/m/register/#/?r=' + cryptoChar.encrypt(utils.getSet(`shareUID-${uid}`) ? utils.getSet(`shareUID-${uid}`) : uid);
        } else {
            param.link = window.location.origin + window.location.pathname + `#!/arena`;
        }
        logic.toShare(param);
    },
    // 分享
    toShare(param) {
        logic.loadingOption.isShow.loadingShare = true;
        const link = param.link; // 需要分享的链接
        // 测试/生产线路切换
        const img1 = GetBase64.switchIngUrl(require('@/assets/img/arena/rankingShareBg.png').default);
        const img2 = GetBase64.switchIngUrl(require('@/assets/img/arena/logo.png').default);
        console.log(img1, img2);
        // share.openShare({
        //     needShareImg: null,
        //     link: link,
        //     cancelCallback(params) {
        //         logic.cancelCallback(params);
        //     }
        // }); // 打开分享弹框
        if (window.plus) {
            Qrcode.toDataURL(link).then(base64 => {
                GetBase64.loadImageUrlArray([img1, img2, base64], arg => {
                    GetBase64.getWebView({
                        data: HtmlConst.shareRanking(
                            [
                                "合约大师竞技场",
                                logic.myRank === -1 ? "再接再厉，勇夺第一" : "他强任他强，我是合约王",
                                "我的排名",
                                logic.myRank === -1 ? "未上榜" : logic.myRank,
                                `净盈亏(${logic.arenaInfo.game_coin})`,
                                utils.toFixedForFloor(logic.pnl, 0),
                                "邀请您加入，长按识别二维码"
                            ],
                            arg
                        ),
                        W: 309,
                        H: 558
                    }, res => {
                        console.log('GetBase64 getWebView', res);
                        share.openShare({
                            needShareImg: res,
                            link: link,
                            cancelCallback(params) {}
                        }); // 打开分享弹框
                        // logic.reset(); // 重置
                        logic.loadingOption.isShow.loadingShare = false;
                        m.redraw();
                    });
                });
            }).catch(err => {
                logic.loadingOption.isShow.loadingShare = false;
                m.redraw();
                console.log(err);
            });
        } else {
            // logic.reset(); // 重置
            logic.loadingOption.isShow.loadingShare = false;
            // h5分享
            // window.router.push({
            //     path: "/rankingShareH5", // h5分享
            //     data: {
            //         link: link // 链接
            //     }
            // });
        }
    },
    // 排名item点击事件
    rankingItemClick(params) {
        window.router.push({
            path: "/dealHistory", // 历史成交
            data: {
                rid: logic.rid, // 榜单编号
                rank: params.rank + 1 // 在榜单中排名位置
            }
        });
    },
    // 构建排名数据
    buildRankList(data) {
        const newList = data.arenas.map((item, index) => {
            return {
                rank: index,
                uid: data.uids[index],
                arena: item > 0 ? ("+" + utils.toFixedForFloor(item, 2)) : utils.toFixedForFloor(item, 2)
            };
        });
        return newList;
    },
    // 排名 接口
    getArenaRank() {
        logic.loadingOption.isShow.lodaingGetArenaRank = true;
        Http.getArenaRank().then(arg => {
            logic.loadingOption.isShow.lodaingGetArenaRank = false;
            if (arg.result.code === 0) {
                logic.rankingList = logic.buildRankList(arg.result.data); // 列表
                logic.myRank = arg.result.rank; // 我的排名
                logic.rid = arg.result.rid; // 榜单id
                logic.coin = arg.result.coin; // 币种
                console.log('排名 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            logic.loadingOption.isShow.lodaingGetArenaRank = false;
            console.log('排名 error', err);
            m.redraw();
        });
    },
    // 用户信息 接口
    getArenaUserInfo() {
        logic.loadingOption.isShow.lodaingGetArenaUserInfo = true;
        Http.getArenaUserInfo().then(arg => {
            logic.loadingOption.isShow.lodaingGetArenaUserInfo = false;
            if (arg.result.code === 0) {
                logic.pnl = utils.toFixedForFloor(arg.result.pnl, 2); // 当前盈亏
                console.log('获取竞技场用户信息 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            logic.loadingOption.isShow.lodaingGetArenaUserInfo = false;
            console.log('获取竞技场用户信息 error', err);
            m.redraw();
        });
    },
    // 竞技场相关信息 接口
    getArena() {
        const params = {
            data: {
                vp: config.exchId
            }
        };
        logic.loadingOption.isShow.lodaingGetArena = true;
        Http.getArena(params).then(arg => {
            logic.loadingOption.isShow.lodaingGetArena = false;
            if (arg.result.code === 0) {
                logic.arenaInfo = arg.result.arena;
                console.log('获取竞技场相关信息 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            logic.loadingOption.isShow.lodaingGetArena = false;
            console.log('获取竞技场相关信息 error', err);
            m.redraw();
        });
    },
    oninit(vnode) {
        logic.timerID = setInterval(() => {
            logic.getArenaRank();// 排名 接口
        }, 300000);
        logic.getArenaRank();// 排名 接口
        logic.getArenaUserInfo();
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        clearInterval(logic.timerID);
    }
};

module.exports = logic;