const m = require('mithril');
const logic = require('./danmaku.logic');
require('./danmaku.scss');

module.exports = {
    oninit: vnode => logic.oninit(vnode),
    oncreate: vnode => logic.oncreate(vnode),
    onupdate: vnode => logic.onupdate(vnode),
    onremove: vnode => logic.onremove(vnode),
    view(vnode) {
        // 弹幕item
        // m('div', { class: `pub-danmaku px-2 has-text-level-1` }, [
        //     m('div', { class: `pub-danmaku-user mr-2 has-bg-primary` }, "F"),
        //     m('div', { class: `` }, "我是弹幕！")
        // ]),
        return m('div', { class: `${vnode.attrs.class || ''}`, id: "my-container" });
    }
};