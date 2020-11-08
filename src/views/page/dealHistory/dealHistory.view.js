const m = require('mithril');
require('./dealHistory.scss');
const logic = require('./dealHistory.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Loading = require('@/views/components/common/Loading/Loading.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    // 获取 方向和交易类型
    getDir(item) {
        const isBuy = item.Sz >= 0; // 方向是否是买入
        if (item.SzCls === 0 && item.SzOpn === 0) {
            return isBuy ? "买入" : "卖出";
        }
        if (item.SzCls === 0 && item.SzOpn !== 0) {
            return isBuy ? "买入开多" : "卖出开空";
        }
        if (item.SzCls !== 0 && (Math.abs(item.Sz) === Math.abs(item.SzCls))) {
            return isBuy ? "买入平空" : "卖出平多";
        }
        if (item.SzCls !== 0 && (Math.abs(item.Sz) !== Math.abs(item.SzCls))) {
            return isBuy ? "买入平空并开多" : "卖出平多并开空";
        }
        if (item.Via === 4 || item.Via === 13) {
            return isBuy ? "买入强制平空" : "卖出强制平多";
        }
        if (item.Via === 5) {
            return isBuy ? "买入ADL平空" : "卖出ADL平多";
        }
    },
    view(vnode) {
        return m('div', { class: `pub-view view-deal-history` }, [
            m(Loading, logic.loadingOption),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content view-deal-history-content px-3` }, [
                m('div', { class: `view-deal-history-title font-weight-bold mt-3` }, "历史成交"),
                logic.historyList.map(item => {
                    return m('div', { class: `view-deal-history-item pt-7 pb-5` }, [
                        // title
                        m('div', { class: `view-deal-history-item-title is-between mb-3` }, [
                            m('div', { class: `` }, item.build_Sym),
                            m('div', { class: `body-4 has-text-level-2` }, item.build_At)
                        ]),
                        // btn 按钮
                        m('div', { class: `is-flex mb-7 body-4` }, [
                            // 方向和交易类型
                            m('div', { class: `view-deal-history-item-btn font-weight-bold ${item.Sz < 0 ? 'down' : 'up'} mr-3 px-3` }, vnode.state.getDir(item)),
                            // 杠杆
                            m('div', { class: `view-deal-history-item-btn font-weight-bold ${item.Sz < 0 ? 'down' : 'up'} px-3` }, [
                                item.Lvr === 0 ? ("全仓" + 1 / item.MIRMy + "x") : ("逐仓" + item.Lvr + "x")
                            ])
                        ]),
                        // info
                        m('div', { class: `columns is-mobile` }, [
                            // 成交数量(张)
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "成交数量(张)"),
                                m('div', { class: `font-weight-bold` }, item.build_Sz)
                            ]),
                            // 成交价格
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "成交价格"),
                                m('div', { class: `font-weight-bold` }, item.build_Prz)
                            ]),
                            // // 成交额
                            // m('div', { class: `column is-4 mb-3` }, [
                            //     m('div', { class: `body-4 has-text-level-2` }, "成交额(USDT)"),
                            //     m('div', { class: `font-weight-bold` }, "100.0000")
                            // ]),
                            // 平仓盈亏(USDT)
                            m('div', { class: `column is-4 mb-3 has-text-right` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "平仓盈亏"),
                                m('div', { class: `font-weight-bold` }, item.PnlCls)
                            ])
                            // // 手续费(USDT)
                            // m('div', { class: `column is-4 mb-3` }, [
                            //     m('div', { class: `body-4 has-text-level-2` }, "手续费(USDT)"),
                            //     m('div', { class: `font-weight-bold` }, "10000.5")
                            // ])
                        ])
                    ]);
                })
            ])
        ]);
    }
};