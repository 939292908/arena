
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;
const share = require('@/views/page/main/share/share.logic.js');
const utils = require('@/util/utils').default;
const Danmaku = require('danmaku').default;

const logic = {
    shareLoading: false,
    VXNum: "Block-Chain-Yu",
    danmaku: null, // 弹幕实例
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
    // 报名 click
    submit() {
        logic.confirmModal.updateOption({ isShow: false });
    },
    // 分享取消回调
    cancelCallback(params) {
        if (!params.isShare) { // 未点击分享
            m.redraw();
        }
    },
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
    // 发弹幕
    sendDanmaku(option) {
        // user: 用户名 / text: 弹幕
        var comment = {
            render() {
                var $div = document.createElement('div');
                $div.innerHTML = `
                    <div class="pub-danmaku px-2 has-text-level-1">
                        <div class="pub-danmaku-user mr-2 has-bg-primary">${option.user}</div>
                        <div class="">${option.text}</div>
                    </div>
                `;
                return $div;
            }
        };
        logic.danmaku.emit(comment);
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
        logic.danmaku = new Danmaku({
            container: document.getElementById('my-container'),
            speed: 100
        });
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;