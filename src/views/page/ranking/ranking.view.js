const m = require('mithril');
require('./ranking.scss');
const logic = require('./ranking.logic');
const Header = require('@/views/components/common/Header/Header.view');
const Button = require('@/views/components/common/Button/Button.view');
const Loading = require('@/views/components/common/Loading/Loading.view');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        return m('div', { class: `pub-view view-ranking` }, [
            m(Loading, { isShow: logic.shareLoading }),
            m(Header, logic.headerOption),
            m('div', { class: `pub-content view-ranking-content` }, [
                // top
                m('div', { class: `view-ranking-top has-text-centered pt-6` }, [
                    m('div', { class: `view-ranking-top-number font-weight-bold pb-1` }, "TOP50"),
                    m('div', { class: `view-ranking-top-title font-weight-bold` }, "合约大师竞技场"),
                    m('div', { class: `font-weight-bold` }, "完全公开透明，成交记录可查")
                ]),
                // 排行
                m('div', { class: `view-ranking-info pt-7 px-4 is-flex is-flex-direction-column` }, [
                    m('img.mb-5', { src: require("@/assets/img/arena/logoLine.svg").default, width: "100%" }),
                    // 我的排名
                    m('div', { class: `is-between mb-3` }, [
                        m('div', { class: `has-text-level-3` }, "我的排名：未上榜"),
                        m('div', { class: `has-text-level-3` }, "净盈亏：0.00")
                    ]),
                    // 排名头部
                    m('div', { class: `columns is-mobile has-text-level-2` }, [
                        m('div', { class: `column` }, "排名"),
                        m('div', { class: `column` }, "UID"),
                        m('div', { class: `column has-text-right` }, "净盈亏(BMUT)")
                    ]),
                    // 排名列表
                    m('div', { class: `view-ranking-info-body` }, [
                        logic.rankingList.map(item => {
                            return m('div', { class: `columns is-mobile`, onclick() { logic.rankingItemClick(item); } }, [
                                m('div', { class: `column` }, item),
                                m('div', { class: `column` }, "2"),
                                m('div', { class: `column has-text-right` }, [
                                    m('span', { class: `` }, "3(BMUT)"),
                                    m('img', { class: `pl-2`, src: require("@/assets/img/arena/rightArrow.svg").default, height: "8px" })
                                ])
                            ]);
                        })
                    ])
                ])
            ]),
            // 底部
            m('div', { class: `view-ranking-footer py-3 px-5 has-text-centered` }, [
                m('div', { class: `has-text-level-2 mb-1` }, "*排名数据每一小时刷新"),
                m(Button, {
                    class: 'is-primary font-weight-bold',
                    width: 1,
                    label: "分享我的排名",
                    onclick() {
                        logic.toShareClick();
                    }
                })
            ])
        ]);
    }
};