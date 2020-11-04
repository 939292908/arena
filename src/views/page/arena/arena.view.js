const m = require('mithril');
require('./arena.scss');
const logic = require('./arena.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');
const Modal = require('@/views/components/common/Modal/Modal.view');
// const Danmaku = require('Danmaku');
const Loading = require('@/views/components/common/Loading/Loading.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view view-arena` }, [
            m(Loading, { isShow: logic.shareLoading }),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content view-arena-content` }, [
                m('div', { class: `view-arena-content-inner` }, [
                    // top
                    m('div', { class: `view-arena-top has-text-centered pt-3` }, [
                        m('img', { src: require("@/assets/img/arena/hatchet.svg").default, width: "31", height: "24" }),
                        m('div', { class: `my-2` }, m('img', { src: require("@/assets/img/arena/topTitle.svg").default, width: "281" })),
                        m('div', { class: `font-weight-bold` }, "默默做单无人知 一战成名天下闻"),
                        m('div', { class: `my-2 has-text-level-3 font-weight-bold` }, "实时总奖池 (USDT)"),
                        m('div', { class: `view-arena-top-number font-weight-bold` }, "68888"),
                        m('div', { class: `font-weight-bold` }, [
                            m('span', { class: `` }, "实时报名人数 "),
                            m('span', { class: `` }, "1,888,888")
                        ]),
                        m('div', {
                            class: ``,
                            onclick () {
                                logic.sendDanmaku({
                                    user: "z",
                                    text: "我是弹幕额额额"
                                });
                            }
                        }, ["弹幕按钮"]),
                        // 弹幕
                        // m('div', { class: `pub-danmaku px-2 has-text-level-1` }, [
                        //     m('div', { class: `pub-danmaku-user mr-2 has-bg-primary` }, "F"),
                        //     m('div', { class: `` }, "我是弹幕！")
                        // ]),
                        m('div', { class: `view-arena-top-barrage mb-6`, id: "my-container" })
                    ]),
                    // 介绍
                    m('div', { class: `view-arena-info pt-7 px-4` }, [
                        m('img.mb-5', { src: require("@/assets/img/arena/logoLine.svg").default, width: "100%" }),
                        // 参赛流程
                        m('div', { class: `has-text-level-3 font-weight-bold mb-5` }, "参赛流程"),
                        m('div', { class: `has-text-level-2 mb-5` }, [
                            // 流程1
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 line-box-pass` }, [
                                m('span', { class: `` }, "1.报名竞技场"),
                                m('span', { class: `body-2` }, "（仅需1USDT）")
                            ]),
                            // 流程2
                            m('div', { class: `view-arena-info-line-box pl-4 pb-7 line-box-pass` }, [
                                m('span', { class: `` }, "2.竞技场开赛"),
                                m('span', { class: `body-2` }, "（2020/11/11 - 14:00-2020/11/26 14:00）")
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
                            m('div', { class: `` }, "1.参赛人员仅需1usdt报名费用，报名费投入总奖池。"),
                            m('div', { class: `` }, "2.每报名一人，平台额外投入1usdt进入总奖池。"),
                            m('div', { class: `` }, "3.竞技结束，按照净盈亏排名，根据名次获得巨额奖励。")
                        ]),
                        // 复活规则
                        m('div', { class: `has-text-level-3 font-weight-bold mb-5` }, "复活规则"),
                        m('div', { class: `has-text-level-2 mb-5` }, [
                            m('div', { class: `` }, "1.账户金额低于10000UT（初始值）可申请复活，每人最多2次复活机会。"),
                            m('div', { class: `` }, "2.第一次复活需邀请2人完成报名，第二次复活需邀请8人完成报名。"),
                            m('div', { class: `` }, "3.邀请完成后，添加复活小助手微信申请即可。")
                        ]),
                        // 复活小助手
                        m('div', { class: `has-text-centered font-weight-bold` }, "复活小助手"),
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
                        m('div', { class: `view-arena-toolbar-item has-bg-primary mb-3` }, "奖励"),
                        m('div', {
                            class: `view-arena-toolbar-item has-bg-primary`,
                            onclick() {
                                window.router.push({
                                    path: "/ranking",
                                    data: {
                                        id: 123456
                                    }
                                });
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
                            m('div', { class: `my-confirm-modal-body has-text-level-2` }, "支付1USDT后将获得初始模拟金10000BMUT，此资金将进入您的合约账户。"),
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
                    })
                ])
            ]),
            // 底部
            m('div', { class: `view-arena-footer py-3` }, [
                vnode.state.getFooter()
            ])
        ]);
    },
    // 底部
    getFooter() {
        const type = 1;
        switch (type) {
        // 马上登录
        case 0:
            return m(Button, {
                class: 'is-primary font-weight-bold',
                width: 1,
                label: "马上登录报名",
                onclick() {
                }
            });

        // 立即报名 仅需 1 USDT
        case 1:
            return m(Button, {
                class: 'is-primary font-weight-bold',
                width: 1,
                label: "立即报名 仅需 1 USDT",
                onclick() {
                    logic.confirmModal.updateOption({ isShow: true });
                }
            });

        // 立即参赛
        case 2:
            return m('div', { class: `columns is-mobile font-weight-bold` }, [
                m(Button, {
                    class: 'is-primary column',
                    label: "100000 BMUT",
                    onclick() {
                    }
                }),
                m(Button, {
                    class: 'is-primary column mx-3',
                    label: "立即参赛",
                    onclick() {
                    }
                }),
                m(Button, {
                    class: 'is-primary column',
                    label: "我要复活",
                    onclick() {
                    }
                })
            ]);

        default:
            break;
        }
    }
};