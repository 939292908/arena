const m = require('mithril');
require('./arena.scss');
const logic = require('./arena.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
const Loading = require('@/views/components/common/Loading/Loading.view');
const utils = require('@/util/utils').default;
const danmaku = require('@/views/components/danmaku/danmaku.view');
const transfer = require('@/views/components/transfer/transfer.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view view-arena` }, [
            m(Loading, logic.loadingOption),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content view-arena-content` }, [
                m('div', {
                    class: `view-arena-content-inner`,
                    style: `background: url(${require("@/assets/img/arena/bg.png").default}) no-repeat center top / contain;`
                }, [
                    // top
                    m('div', { class: `view-arena-top has-text-centered pt-3` }, [
                        m('img', { src: require("@/assets/img/arena/hatchet.svg").default, width: "31", height: "24" }),
                        m('div', { class: `my-2` }, m('img', { src: require("@/assets/img/arena/topTitle.svg").default, width: "281" })),
                        m('div', { class: `font-weight-bold` }, "默默做单无人知 一战成名天下闻"),
                        m('div', { class: `my-2 has-text-level-3 font-weight-bold` }, `实时总奖池 (${logic.arenaInfo.bonus_coin})`),
                        m('div', { class: `view-arena-top-number font-weight-bold` }, logic.arenaInfo.bonus_pool),
                        m('div', { class: `font-weight-bold` }, [
                            m('span', { class: `` }, "实时报名人数 "),
                            m('span', { class: `` }, logic.arenaInfo.user_count)
                        ]),
                        // 弹幕
                        m(danmaku, { class: `view-arena-top-barrage mb-6` })
                    ]),
                    // 介绍
                    m('div', { class: `view-arena-info pt-4 px-4 mx-4` }, [
                        m('img.mb-5', { src: require("@/assets/img/arena/logoLine.svg").default, width: "100%" }),
                        // 参赛流程
                        m('div', { class: `has-text-level-3 font-weight-bold mb-5` }, "参赛流程"),
                        m('div', { class: `has-text-level-2 mb-5` }, [
                            // 流程1
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 line-box-pass` }, [
                                m('span', { class: `` }, "1.报名竞技场"),
                                m('span', { class: `body-2` }, `（仅需${logic.arenaInfo.entry_fee}${logic.arenaInfo.entry_coin}）`)
                            ]),
                            // 流程2
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 line-box-pass` }, [
                                m('span', { class: `` }, "2.竞技场开赛"),
                                m('span', { class: `body-2` }, `（${utils.formatDate(logic.arenaInfo.start_tm, 'yyyy/MM/dd hh:mm')} - ${utils.formatDate(logic.arenaInfo.end_tm, 'yyyy/MM/dd hh:mm')}）`)
                            ]),
                            // 流程3
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 line-box-pass` }, [
                                m('span', { class: `` }, "3.赛中可复活2次"),
                                m('span', { class: `body-2` }, "（邀请好友共同参赛）")
                            ]),
                            // 流程4
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 has-border-none` }, [
                                m('span', { class: `` }, "4.比赛结束"),
                                m('span', { class: `body-2` }, "（颁发奖励）")
                            ])
                        ]),
                        // 竞技规则
                        m('div', { class: `has-text-level-3 font-weight-bold mb-5` }, "竞技规则"),
                        m('div', { class: `has-text-level-2 mb-5` }, [
                            m('div', { class: `` }, `1.参赛人员仅需${logic.arenaInfo.entry_fee}${logic.arenaInfo.entry_coin}报名费用，报名费投入总奖池。`),
                            m('div', { class: `` }, `2.每报名一人，平台额外投入${logic.arenaInfo.entry_fee}${logic.arenaInfo.entry_coin}进入总奖池。`),
                            m('div', { class: `` }, "3.竞技结束，按照净盈亏排名，根据名次获得巨额奖励。")
                        ]),
                        // 复活规则
                        m('div', { class: `has-text-level-3 font-weight-bold mb-5` }, "复活规则"),
                        m('div', { class: `has-text-level-2 mb-5` }, [
                            m('div', { class: `` }, `1.账户金额低于${logic.arenaInfo.game_currency}${logic.arenaInfo.game_coin}（初始值）可申请复活，每人最多2次复活机会。`),
                            m('div', { class: `` }, "2.第一次复活需邀请2人完成报名，第二次复活需邀请8人完成报名。"),
                            m('div', { class: `` }, "3.邀请完成后，添加复活小助手微信申请即可。")
                        ]),
                        // 复活小助手
                        m('div', { class: `has-text-centered font-weight-bold`, id: "resurgence" }, "复活小助手"),
                        m('div', { class: `view-arena-resurrection pa-2 my-3` }, [
                            m('img', { src: require("@/assets/img/arena/resurrection.svg").default, width: "100%", height: "100%" })
                        ]),
                        m('div', { class: `has-text-centered mb-7` }, [
                            m('span', { class: `` }, "微信号："),
                            m('span', { class: `mr-1` }, logic.VXNum),
                            m('img', {
                                src: require("@/assets/img/arena/copy.svg").default,
                                width: "16",
                                height: "16",
                                onclick() {
                                    logic.copyLinkClick();
                                }
                            })
                        ])
                    ]),
                    // 悬浮toolbar
                    m('div', { class: `view-arena-toolbar mr-3` }, [
                        m('div', { class: `view-arena-toolbar-item has-bg-primary mb-3`, onclick() { logic.toShareClick(); } }, "分享"),
                        m('div', { class: `view-arena-toolbar-item has-bg-primary mb-3`, onclick() { window.open('https://www.bmex.vip/hc/zh-cn/articles/360058797113'); } }, "奖励"),
                        m('div', {
                            class: `view-arena-toolbar-item has-bg-primary`,
                            onclick() {
                                if (!utils.getItem('loginState')) {
                                    if (window.plus) {
                                        utils.setItem("ARENA_CLOSE", {
                                            code: 2, // 去登录
                                            data: {
                                                link: "/m/arena/#!/ranking"
                                            }
                                        });
                                        window.plus.webview.close(window.plus.webview.currentWebview(), "auto", 1, { abc: "我是竞技场！！" });
                                    } else {
                                        window.open('/m/#/userLogin', '_self');
                                    }
                                } else {
                                    // 跳转排名
                                    window.router.push({
                                        path: "/ranking"
                                    });
                                }
                            }
                        }, "排名")
                    ]),
                    // 报名确认弹框
                    m(Modal, {
                        isShow: logic.confirmModal.isShow, // 显示隐藏
                        updateOption: logic.confirmModal.updateOption,
                        content: m('div', { class: `my-confirm-modal-content pa-3 border-radius-small` }, [
                            // 头部
                            m('div', { class: `my-confirm-modal-header font-weight-bold mb-3` }, "确认报名"),
                            // 内容
                            m('div', { class: `my-confirm-modal-body has-text-level-2` }, `支付${logic.arenaInfo.entry_fee}${logic.arenaInfo.entry_coin}后将获得初始模拟金${logic.arenaInfo.game_currency}${logic.arenaInfo.game_coin}，此资金将进入您的合约账户。`),
                            // 底部
                            m('div', { class: `my-confirm-modal-footer font-weight-bold is-flex` }, [
                                m('div', { class: `spacer` }),
                                m('div', {
                                    class: `has-text-level-2 pa-2 mr-7`,
                                    onclick() {
                                        logic.confirmModal.updateOption({ isShow: false });
                                    }
                                }, "取消"),
                                m('div', {
                                    class: `has-text-primary pa-2`,
                                    onclick() {
                                        logic.submit();
                                    }
                                }, "报名")
                            ])
                        ])
                    }),
                    // 划转确认弹框
                    m(Modal, {
                        isShow: logic.confirmTransferModal.isShow, // 显示隐藏
                        updateOption: logic.confirmTransferModal.updateOption,
                        content: m('div', { class: `my-confirm-modal-content pa-3 border-radius-small` }, [
                            // 头部
                            m('div', { class: `my-confirm-modal-header font-weight-bold mb-3` }, "温馨提示"),
                            // 内容
                            m('div', { class: `my-confirm-modal-body has-text-level-2` }, `钱包可用资产不足，是否划转资金至钱包账户？`),
                            // 底部
                            m('div', { class: `my-confirm-modal-footer font-weight-bold is-flex` }, [
                                m('div', { class: `spacer` }),
                                m('div', {
                                    class: `has-text-level-2 pa-2 mr-7`,
                                    onclick() {
                                        logic.confirmTransferModal.updateOption({ isShow: false });
                                    }
                                }, "取消"),
                                m('div', {
                                    class: `has-text-primary pa-2`,
                                    onclick() {
                                        logic.confirmTransferModal.confirmClick();
                                    }
                                }, "确定")
                            ])
                        ])
                    })
                ])
            ]),
            // 底部
            m('div', { class: `view-arena-footer py-3` }, [
                vnode.state.getFooter()
            ]),
            // 划转 Modal
            m(transfer)
        ]);
    },
    // 底部
    getFooter() {
        let type = 0;

        if (new Date() > logic.arenaInfo.end_tm) {
            // 活动结束
            type = 3;
        } else {
            // 登录
            if (utils.getItem('loginState')) {
                type = logic.isEnter ? 2 : 1;
            }
        }
        // type = 1;
        switch (type) {
        // 马上登录
        case 0:
            return m(Button, {
                class: 'is-primary font-weight-bold',
                width: 1,
                label: "马上登录报名",
                onclick() {
                    if (window.plus) {
                        utils.setItem("ARENA_CLOSE", {
                            code: 2, // 去登录
                            data: {
                                link: "/m/arena/#!/arena"
                            }
                        });
                        window.plus.webview.close(window.plus.webview.currentWebview(), "auto", 1, { abc: "我是竞技场！！" });
                    } else {
                        window.open('/m/#/userLogin', '_self');
                    }
                }
            });

        // 立即报名 仅需 1 USDT
        case 1:
            return m(Button, {
                class: 'is-primary font-weight-bold',
                width: 1,
                label: `立即报名 仅需${logic.arenaInfo.entry_fee}${logic.arenaInfo.entry_coin}`,
                onclick() {
                    logic.confirmModal.updateOption({ isShow: true });
                }
            });

        // 立即参赛
        case 2:
            return m('div', { class: `columns is-mobile font-weight-bold` }, [
                m(Button, {
                    class: 'is-primary column',
                    label: logic.balance + logic.arenaInfo.game_coin,
                    onclick() {}
                }),
                m(Button, {
                    class: 'is-primary column mx-3',
                    label: "立即参赛",
                    onclick() {
                        if (window.plus) {
                            utils.setItem("ARENA_CLOSE", {
                                code: 1, // 去参赛交易
                                data: {
                                    Sym: logic.arenaInfo.bound_sym
                                }
                            });
                            window.plus.webview.close(window.plus.webview.currentWebview(), "auto", 1, { abc: "我是竞技场！！" });
                        } else {
                            window.open(window.location.origin + '/m/#/trade');
                        }
                    }
                }),
                m(Button, {
                    class: 'is-primary column',
                    label: "我要复活",
                    onclick() {
                        utils.ScrollTop({
                            number: 1000,
                            time: 400,
                            dom: document.querySelector('.view-arena-content')
                        });
                    }
                })
            ]);

        // 竞技已结束
        case 3:
            return m(Button, {
                class: 'is-primary font-weight-bold',
                width: 1,
                disabled: true,
                label: `竞技已结束`,
                onclick() {
                }
            });
        default:
            break;
        }
    }
};