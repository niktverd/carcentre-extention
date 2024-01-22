console.log("grab-data-for-carcentre started");
var oldId = "";
var oldUrl = "";
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let id = "";
        if (tabs.length < 1) return;
        const url = new URL(tabs[0].url);
        // let url = tabs[0].url;
        // console.log(url);
        let msg = {
            type: url.searchParams.get('type'),
            article: url.searchParams.get('article'),
            callbackurl: url.searchParams.get('callbackurl')

        };

        console.log(msg);

        // if (url.indexOf("https://www.google.ru/search?tbm=isch&") >= 0) {
        //     msg.type = url.split("type=")[1].split("&")[0];
        //     msg.article = url.split("article=")[1].split("&")[0];
        //     msg.callbackurl = url.split("callbackurl=")[1].split("&")[0];
        // }

        // console.log("before sending id ", id, url);
        // console.log("before sending oldId", oldId, oldUrl);
        // // msg = {
        // //     txt: "linkedin.com/in/",
        // //     id: id,
        // //     url: url
        // // };
        // // if (id !== oldId) {
        // //     oldId = id;
        // //     console.log("sending message with id ", id);
        // //     chrome.tabs.sendMessage(tabId, msg);
        // // }
        // // if (url !== oldUrl) {
        //     oldUrl = url;
        //     console.log(" ======================================= ");
        //     console.log("sending message with url ", url);
        //     console.log(" ======================================= ");
        // chrome.tabs.sendMessage(tabId, msg);
        // // }
    });
});
