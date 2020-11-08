
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;
const share = require('@/views/page/main/share/share.logic.js');
const utils = require('@/util/utils').default;
const config = require('@/config.js');
const broadcast = require('@/broadcast/broadcast');
const transferLogic = require('@/views/components/transfer/transfer.logic');
const models = require('@/models');

const logic = {
    isEnter: false, // 是否报名
    balance: "", // 当前权益
    arenaInfo: {
        start_tm: "", // 活动开始时间,
        end_tm: "", // 活动结束时间,
        user_count: "", // 参与人数,
        bonus_pool: "", // 奖池,
        bonus_coin: "", // 奖池币种
        entry_fee: "", // 报名费
        entry_coin: "", // 报名币种
        game_currency: "", // 兑换的活动币量
        game_coin: "", // 兑换的活动币种
        bound_sym: "" // 跳转交易默认选中合约
    },
    timerId: "",
    // loading
    loadingOption: {
        isShow: {
            loadingShare: false,
            lodaingGetArena: true
        }
    },
    VXNum: "Block-Chain-Yu",
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
    // 报名确认弹框
    confirmModal: {
        isShow: false, // 状态
        updateOption(option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        }
    },
    // 划转确认弹框
    confirmTransferModal: {
        isShow: false, // 状态
        updateOption(option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        confirmClick() {
            this.updateOption({ isShow: false });
            transferLogic.updateOption({
                isShow: true,
                coin: logic.arenaInfo.entry_coin // 报名币种
            });
        }
    },
    // 报名 click
    submit() {
        console.log("---------", transferLogic.myWalletMax, logic.arenaInfo.entry_fee);
        if (transferLogic.myWalletMax < logic.arenaInfo.entry_fee) {
            logic.confirmModal.updateOption({ isShow: false });
            logic.confirmTransferModal.updateOption({ isShow: true });
            return;
        }
        Http.arenaEnter().then(arg => {
            logic.loadingOption.isShow.lodaingGetArena = false;
            logic.confirmModal.updateOption({ isShow: false });
            if (arg.result.code === 0) {
                logic.getArena(); // 获取竞技场相关信息 接口
                logic.getArenaUserInfo(); // 获取用户信息 接口
                window.$message({
                    content: "报名成功",
                    type: 'success'
                });
                console.log('报名 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            logic.loadingOption.isShow.lodaingGetArena = false;
            m.redraw();
            console.log('报名 error', err);
        });
    },
    // 分享取消回调
    cancelCallback(params) {
        if (!params.isShare) { // 未点击分享
            m.redraw();
        }
    },
    // 分享 click
    toShareClick() {
        if (logic.loadingOption.isShow.loadingShare) return;
        const param = {
            link: window.location.origin + window.location.pathname + `#!/arena`
        };
        logic.toShare(param);
    },
    // 分享
    toShare(param) {
        logic.loadingOption.isShow.loadingShare = true;
        const link = param.link; // 需要分享的链接
        // 测试/生产线路切换
        const img1 = GetBase64.switchIngUrl(require('@/assets/img/arena/arenaShareBg.png').default);
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
                        data: HtmlConst.shareArena(
                            [
                                "合约大师竞技场",
                                "快和我一起参赛，盈收益！",
                                "随时参赛，随时交易"
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
                            cancelCallback(params) {
                                // logic.cancelCallback(params);
                            }
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
            window.router.push({
                path: "/arenaShareH5", // h5分享
                data: {
                    link: link // 链接
                }
            });
        }
    },
    // 复制链接
    copyLinkClick() {
        utils.copyText(logic.VXNum, () => {
            window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('20134') /* '复制成功' */, type: 'success' });
        });
    },
    // 用户信息 接口
    getArenaUserInfoApi() {
        Http.getArenaUserInfo().then(arg => {
            if (arg.result.code === 0) {
                logic.isEnter = arg.result.status === 1; // 是否报名
                logic.balance = arg.result.balance; // 当前权益
                console.log('获取竞技场用户信息 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            console.log('获取竞技场用户信息 error', err);
            m.redraw();
        });
    },
    // 获取用户信息
    getArenaUserInfo() {
        if (!utils.getItem('loginState')) return;
        logic.getArenaUserInfoApi();
        logic.timerId = setInterval(() => {
            logic.getArenaUserInfoApi();
        }, 60000); // 300000
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
                // 更新划转中的币种，用于设置钱包该币种最大可是否够报名
                transferLogic.updateOption({
                    coin: logic.arenaInfo.entry_coin // 报名币种
                });
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
        logic.getArena(); // 获取竞技场相关信息 接口
        models.getUserInfo();
        broadcast.onMsg({
            key: "arena_GET_USER_INFO_READY",
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                console.log(5555555);
                logic.getArenaUserInfo(); // 获取用户信息 接口
            }
        });
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        broadcast.offMsg({
            key: "arena_GET_USER_INFO_READY",
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
        clearInterval(logic.timerId);
    }
};

module.exports = logic;