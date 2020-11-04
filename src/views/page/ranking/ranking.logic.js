
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const Qrcode = require('qrcode');
// const I18n = require('@/languages/I18n').default;
const share = require('@/views/page/main/share/share.logic.js');

const logic = {
    shareLoading: false,
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
    rankingList: [1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6],
    // 分享 click
    toShareClick() {
        if (logic.shareLoading) return;
        const param = {
            link: "www.baidu.com"
        };
        logic.toShare(param);
    },
    // 分享
    toShare(param) {
        logic.shareLoading = true;
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
                                "他强任他强，我是合约王",
                                "我的排名",
                                "未上榜",
                                "净盈亏(BMUT)",
                                "100.1234",
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
                        logic.shareLoading = false;
                        m.redraw();
                    });
                });
            }).catch(err => {
                logic.shareLoading = false;
                m.redraw();
                console.log(err);
            });
        } else {
            // logic.reset(); // 重置
            logic.shareLoading = false;
            // h5分享
            window.router.push({
                path: "/rankingShareH5", // h5分享
                data: {
                    link: link // 链接
                }
            });
        }
    },
    // 排名item点击事件
    rankingItemClick(params) {
        window.router.push({
            path: "/dealHistory", // 历史成交
            data: {
                id: params //
            }
        });
    },
    // 领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        Http.getgiftrec(params).then(arg => {
            if (arg.result.code === 0) {
                // 领取记录列表
                console.log('领取记录 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            logic.loadingOption.isShow.isShow1 = false;
            console.log('领取记录 error', err);
        });
    },
    oninit(vnode) {
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;