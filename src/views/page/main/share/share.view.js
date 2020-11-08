const m = require('mithril');
const Modal = require('@/views/components/common/Modal/Modal.view');
const logic = require('./share.logic.js');
const I18n = require('@/languages/I18n').default;
require('./share.scss');

module.exports = {
    view(vnode) {
        return m(Modal, {
            isShow: logic.options.isShow,
            content: m('div', { class: `view-share-box` }, [
                m('div', {
                    class: `view-share-content has-text-centered scroll-y`
                }, [
                    m('img', { src: logic.options.needShareImg, width: '70%' })
                ]),
                // 底部分享
                m('div', { class: `view-share-footer bottom-sheet has-bg-level-1 border-radius-large-2-top` }, [
                    m('div', { class: `is-around has-border-bottom-1 has-line-level-1 pa-5` }, logic.shareBtnList().map((item, index) => {
                        return m('button', {
                            class: `button has-border-none has-bg-level-1 has-text-centered`,
                            key: index,
                            onclick: e => {
                                logic.doShare(item);
                            }
                        }, [
                            m('div', { class: `has-text-centered`, key: index }, [
                                // m('i', { class: `iconfont ${item.icon} iconfont-x-large-2` }),
                                m('svg', { class: "icon iconfont-x-large-2 ma-0", "aria-hidden": true }, [
                                    m('use', { "xlink:href": item.icon })
                                ]),
                                /* <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-xxx"></use>
                                    </svg> */
                                m('div', { class: `body-4 mt-1 has-text-level-2` }, item.label)
                            ])
                        ]);
                    })),
                    m('button', {
                        class: `button has-border-none has-bg-level-1 has-text-level-1 is-fullwidth has-text-centered button-large`,
                        onclick() {
                            logic.cancelShareBtnClick();
                        }
                    }, I18n.$t('20035')/* 取消 */)
                ])
            ])
        });
    }
};