// 路由接收参数
// gid, // 红包id
// best, // 手气最佳(0:否 1:是)
// quota // 抢的金额

const m = require('mithril');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const redPacketUtils = require('@/util/redPacketUtils').default;
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const share = require('../../main/share/share.logic.js');
const errCode = require('@/util/errCode').default;
const utils = require('@/util/utils').default;
// const cryptoChar = require('@/util/cryptoChar');
// const globalModels = require('@/models/globalModels');
const I18n = require('@/languages/I18n').default;

const logic = {
    best: 0, // 手气最佳(0:否 1:是)
    quota: 0, // 抢的金额
    // shareLoading: false, // 分享按钮loading
    // loading 配置
    loadingOption: {
        isShow: {
            isShow1: true,
            isShow2: true,
            shareLoading: false // 分享按钮loading
        }
    },
    // 已抢红包列表
    redPacketList: [],
    // 红包来源
    getFromName(params) {
        if (params.gtel) {
            return utils.hideAccountNameInfo(params.gtel);
        }
        if (params.gemail) {
            return utils.hideAccountNameInfo(params.gemail);
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
        },
        center() {
            return {
                label: I18n.$t('20046')/* 详情记录 */
            };
        },
        right() {
            // 非app中打开，隐藏右边分享按钮
            return window.plus ? {
                label: m('i', { class: `iconfont icon-fenxiang has-text-level-3` }),
                onclick() {
                    logic.loadingOption.isShow.shareLoading = true; // 分享按钮loading
                    console.log(logic.redPacketTopOption, 65555);
                    const params = logic.redPacketTopOption;
                    const isLucky = logic.best === 1 && logic.redPacketTopOption.status === 1;
                    // 生成二维码
                    logic.doShare({
                        isLucky: isLucky,
                        // link: window.location.origin + '/m/register/#/?r=' + cryptoChar.encrypt(globalModels.getAccount().uid),
                        link: redPacketUtils.getRegisterUrl(),
                        // textArr: ['手气最佳', '8 USDT', '我抢到了来自', '178****7894', '的拼手气红包', '下载注册APP，轻松交易']
                        textArr: [
                            `${isLucky ? I18n.$t('20047')/* 手气最佳 */ : I18n.$t('20048')/* 我抢到了 */}`,
                            `${logic.quota} ${params.coin}`,
                            `${isLucky ? I18n.$t('20049')/* 我抢到了来自 */ : I18n.$t('20013'/* 来自 */)}`,
                            `${logic.getFromName(params)}`,
                            `${I18n.$t('20014'/* 的 */)}${params.type * 1 === 0 ? I18n.$t('20011'/* 拼手气红包 */) : I18n.$t('20010'/* 普通红包 */)}`,
                            I18n.$t('20064')/* 下载APP，轻松交易 */]
                    });
                }
            } : "";
        }
    },
    // 红包top 组件配置
    redPacketTopOption: {
        // guid: "", // 来源 (空为自己)
        // type: "", // 红包类型 type 0:为拼手气 / >0:普通红包
        // des: "", // 留言
        // quota: "", // 金额
        // coin: "", // 币种
        // msg: "" // 提示消息 (空为没有)
    },
    // 红包info 组件配置
    redPacketInfoOption: {
        // status: "", // 状态：0待领取，1已领完，2红包到期
        // count: "", // 总数
        // count2: "", // 未领数
        // quota: "", // 总额
        // quota2: "", // 未领额
        // coin: "" // 币种
    },
    // 领取记录 接口
    getgiftrec() {
        const params = {
            gid: m.route.param().gid
        };
        logic.loadingOption.isShow.isShow1 = true;
        Http.getgiftrec(params).then(arg => {
            logic.loadingOption.isShow.isShow1 = false;
            if (arg.result.code === 0) {
                // 领取记录列表
                redPacketUtils.buildGiftrecData(arg.result.data).then(data => {
                    logic.redPacketList = data;
                    m.redraw();
                });
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
    // 红包详情 接口
    getdetails() {
        const params = {
            gid: m.route.param().gid
        };
        logic.loadingOption.isShow.isShow2 = true;
        Http.getdetails(params).then(function(arg) {
            logic.loadingOption.isShow.isShow2 = false;
            if (arg.result.code === 0) {
                const data = arg.result.data;
                logic.redPacketTopOption = JSON.parse(JSON.stringify(data)); // 红包top 组件配置
                logic.redPacketInfoOption = JSON.parse(JSON.stringify(data)); // 红包Info 组件配置

                m.redraw();
                console.log('红包详情 success', arg);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            logic.loadingOption.isShow.isShow2 = false;
            console.log('红包详情 error', err);
        });
    },
    doShare(param) {
        const link = param.link; // 需要分享的链接
        const img1 = param.isLucky
            ? GetBase64.switchIngUrl(require('@/assets/img/lucky.png').default)
            : GetBase64.switchIngUrl(require('@/assets/img/work.png').default);
        const img2 = GetBase64.switchIngUrl(require('@/assets/img/logo.png').default);
        console.log(img1, img2);
        if (window.plus) {
            Qrcode.toDataURL(link).then(base64 => {
                GetBase64.loadImageUrlArray([img1, img2, base64], arg => {
                    console.log('GetBase64 loadImageUrlArray', arg);
                    GetBase64.getWebView({
                        data: HtmlConst.shareLucky(param.textArr, arg),
                        W: 276,
                        H: 362
                    }, res => {
                        console.log('GetBase64 getWebView', res);
                        share.openShare({ needShareImg: res, link: link });
                        logic.loadingOption.isShow.shareLoading = false; // 分享按钮loading
                    });
                });
            }).catch(err => {
                logic.loadingOption.isShow.shareLoading = false; // 分享按钮loading
                console.log(err);
            });
        }
    },
    oninit(vnode) {
        this.redPacketList = [];
        this.getdetails();// 红包详情
        this.getgiftrec();// 领取记录
        logic.best = m.route.param().best * 1; // 是否手气最佳
        logic.quota = m.route.param().quota; // 抢的金额
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;