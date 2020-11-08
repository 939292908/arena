
const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
// const I18n = require('@/languages/I18n').default;
const utils = require('@/util/utils').default;
const { gMktApi } = require('@/api/wsApi');
const broadcast = require('@/broadcast/broadcast');

const logic = {
    loadingOption: {
        isShow: {
            lodaingGetArenaTrades: true
        }
    },
    // 头部 组件配置
    headerOption: {
        left() {
            return {
                onclick() {
                    // console.log(gMktApi.AssetD, 99999);
                    window.router.back();
                }
            };
        }
    },
    // 历史记录列表
    historyList: [],
    // 临时 历史记录列表(只做中间记录)
    tempHistoryList: [],
    buildHistoryList(data) {
        const newList = data.map(item => {
            item.build_Sym = item.Sym.replace(".", " / ") + "永续";
            item.build_At = utils.formatDate(item.At, 'MM/dd hh:mm:ss');
            item.build_Sz = Math.abs(item.Sz);
            // console.log(999, item.Sym, Object.values(gMktApi.AssetD).find(item2 => item2.Sym === "BTC.BTC"));
            const PrzMinNum = Object.values(gMktApi.AssetD).find(item2 => item2.Sym === "BTC.BTC").PrzMinInc.toString().split(".")[1].length; // item.Sym 价格保留小数位
            item.build_Prz = utils.toFixedForFloor(item.Prz, PrzMinNum);
            return item;
        });
        // console.log(888, newList);
        return newList;
    },
    // 历史记录 接口
    getArenaTrades() {
        logic.loadingOption.isShow.lodaingGetArenaTrades = true;
        const params = {
            data: {
                rid: m.route.param().rid,
                rank: m.route.param().rank
            }
        };
        Http.getArenaTrades(params).then(arg => {
            logic.loadingOption.isShow.lodaingGetArenaTrades = false;
            if (arg.result.code === 0) {
                logic.tempHistoryList = arg.result.list;
                if (Object.keys(gMktApi.AssetD).length > 0) { // AssetD获取到
                    logic.historyList = logic.buildHistoryList(logic.tempHistoryList);
                }
                console.log('历史记录 success', arg);
            } else {
                window.$message({
                    content: errCode.getArenaErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
            m.redraw();
        }).catch(err => {
            logic.loadingOption.isShow.lodaingGetArenaTrades = false;
            console.log('历史记录 error', err);
            m.redraw();
        });
    },
    oninit(vnode) {
        logic.getArenaTrades(); // 历史记录
        // 添加ASSETD全局广播，用于资产估值计算
        broadcast.onMsg({
            key: "History_MSG_ASSETD_UPD",
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: function () {
                logic.historyList = logic.buildHistoryList(logic.tempHistoryList);
                m.redraw();
            }
        });
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        broadcast.offMsg({
            key: "History_MSG_ASSETD_UPD",
            cmd: broadcast.MSG_ASSETD_UPD,
            isall: true
        });
    }
};

module.exports = logic;