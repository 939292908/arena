module.exports = {
    demo: function(title, img) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
        </head>
        <body>
            <div>
                <h1>${title}</h1>
                <img src="${img}" alt="" width="100%" height="100%">
            </div>
        </body>
        </html>`;
    },
    /**
     * 分享竞技场活动
     * @param {Array} textArr 文字列表
     * @param {Array} imgArr 图片列表，图片格式base64 // 背景、logo、二维码
     */
    shareArena (textArr, imgArr) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    font-family: "Arial";
                    font-style: normal;
                }
                html,
                body{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    line-height: 1.5;
                    background-color: #191D28;
                }
                .box {
                    padding: 0 24px;
                    padding-top: 27px;
                    padding-bottom: 67px;
                    text-align: center;
                    color: #9EA2AF;
                    background: url("${imgArr[0]}") center 174px /contain no-repeat #191D28;
                }
                .logo {
                    text-align: left;
                }
                .ewm {
                    background-color: #2B2F3F;
                    padding: 10px;
                    margin-top: 174px;
                    margin-bottom: 12px;
                }
                .title-1 {
                    font-size: 32px;
                    font-weight: 600;
                    margin-top: 32px;
                    color: #F8F8F8;
                }
                .title-2 {
                    font-size: 14px;
                    margin-top: 8px;
                }
                .body-1 {
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <div class="logo">
                    <img src="${imgArr[1]}" width="70px" alt="">
                </div>
                <div class="title-1">${textArr[0]}</div>
                <div class="title-2">${textArr[1]}</div>
                <img class="ewm" src="${imgArr[2]}" width="148px" alt="">
                <div class="body-1">${textArr[2]}</div>
            </div>
        </body>
        </html>`;
    },
    /**
     * 分享竞技场活动
     * @param {Array} textArr 文字列表
     * @param {Array} imgArr 图片列表，图片格式base64 // 背景、logo、二维码
     */
    shareRanking (textArr, imgArr) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>测试分享图片生成</title>
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                    font-family: "Arial";
                    font-style: normal;
                }
                html,
                body {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    line-height: 1.5;
                    background-color: #191D28;
                    color: #9EA2AF;
                    background: url("${imgArr[0]}") center 120px no-repeat #191D28;
                    background-size: contain;
                }
                .title-1 {
                    font-size: 32px;
                    font-weight: 600;
                    margin: 0 42px;
                    margin-top: 38px;
                    color: #F8F8F8;
                    text-align: center;
                }
                .title-2 {
                    font-size: 14px;
                    margin-top: 4px;
                    text-align: center;
                }
                .body-1 {
                    font-size: 12px;
                }
                .text-left {
                    text-align: left;
                }
                .text-right {
                    text-align: left;
                }
                .info {
                    margin-top: 236px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 36px;
                    padding-bottom: 64px;
                }
                .info-text {
                    font-size: 24px;
                    color: #fff;
                    margin-top: 4px;
                    font-weight: bold;
                }
                .footer {
                    padding: 20px;
                    background: #1E2330;
                    display: flex;
                    justify-content: space-between;
                }
            </style>
        </head>
        <body>
            <div class="title-1">${textArr[0]}</div> 
            <div class="title-2">${textArr[1]}</div>
            <div class="info">
                <div class="text-left">
                    <div class="body-1">${textArr[2]}</div>
                    <div class="info-text">${textArr[3]}</div>
                </div>
                <div class="text-right">
                    <div class="body-1">${textArr[4]}</div>
                    <div class="info-text">${textArr[5]}</div>
                </div>
            </div>
            <div class="footer">
                <div class="footer-left">
                    <img class="footer-right" src="${imgArr[1]}" width="69px" alt="">
                    <div class="body-1">${textArr[6]}</div>
                </div>
                <img class="footer-right" src="${imgArr[2]}" width="48px" height="48px" alt=""> 
            </div>
        </body>
        </html>`;
    }
};