
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
// const I18n = require('@/languages/I18n').default;

const logic = {
    shareLoading: false,
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
    // 历史记录列表
    historyList: [1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6],
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
            console.log('领取记录 error', err);
        });
    },
    oninit(vnode) {
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;