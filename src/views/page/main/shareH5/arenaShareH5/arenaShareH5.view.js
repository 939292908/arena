const m = require('mithril');
const I18n = require('@/languages/I18n').default;
require('./arenaShareH5.scss');
const utils = require('@/util/utils').default;

module.exports = {
    view(vnode) {
        return m('div', { class: `arena-share-h5 has-bg-level-1 has-text-centered pb-7 pt-8` }, [
            m('div', { class: `` }, m('img', { src: require("@/assets/img/arena/topTitle.svg").default, width: "281" })),
            m('div', { class: `has-text-level-1 mt-3` }, "快和我一起参赛，盈收益！"),
            m('div', { class: `share-h5-link-box mt-8 mb-7 pa-3 mx-6 border-radius-small` }, [
                m('div', { class: `share-h5-link-content pa-7 has-text-level-2 body-4` }, [
                    m('div', { class: `share-h5-link no-wrap` }, m.route.param().link)
                ])
            ]),
            m('div', {
                class: `has-bg-primary border-radius-small py-3 mx-6 font-weight-bold body-4 has-text-level-1`,
                onclick() {
                    utils.copyText(m.route.param().link, () => {
                        window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('20134') /* '复制成功' */, type: 'success' });
                    });
                }
            }, I18n.$t('20031')/* 复制链接 */)
        ]);
    }
};