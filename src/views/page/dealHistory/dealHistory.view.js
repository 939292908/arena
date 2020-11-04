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
    view(vnode) {
        return m('div', { class: `pub-view view-deal-history` }, [
            m(Loading, { isShow: logic.shareLoading }),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content view-deal-history-content px-3` }, [
                m('div', { class: `view-deal-history-title font-weight-bold mt-3` }, "历史成交"),
                logic.historyList.map(item => {
                    return m('div', { class: `view-deal-history-item pt-7 pb-5` }, [
                        // title
                        m('div', { class: `view-deal-history-item-title is-between mb-3` }, [
                            m('div', { class: `` }, "BTC / USDT永续"),
                            m('div', { class: `body-4 has-text-level-2` }, "09/22 16:44:44")
                        ]),
                        // btn
                        m('div', { class: `is-flex mb-7 body-4` }, [
                            m('div', { class: `view-deal-history-item-btn font-weight-bold up mr-3 px-3` }, "买入开多"),
                            m('div', { class: `view-deal-history-item-btn font-weight-bold down px-3` }, "全仓 100x")
                        ]),
                        // info
                        m('div', { class: `columns is-mobile` }, [
                            // 成交数量(张)
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "成交数量(张)"),
                                m('div', { class: `font-weight-bold` }, item)
                            ]),
                            // 成交价格
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "成交价格"),
                                m('div', { class: `font-weight-bold` }, "10000.5")
                            ]),
                            // 收益率
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "收益率"),
                                m('div', { class: `font-weight-bold` }, "22.46%")
                            ]),
                            // 平仓盈亏(USDT)
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "平仓盈亏(USDT)"),
                                m('div', { class: `font-weight-bold` }, "9500.5")
                            ]),
                            // 手续费(USDT)
                            m('div', { class: `column is-4 mb-3` }, [
                                m('div', { class: `body-4 has-text-level-2` }, "手续费(USDT)"),
                                m('div', { class: `font-weight-bold` }, "10000.5")
                            ])
                        ])
                    ]);
                })
            ])
        ]);
    }
};