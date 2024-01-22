console.log(
    "=============================================\ngrab-data-for-carcentre\n==========================================================="
);

// var linkedInInFlag = false;
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//         setTimeout(function () {
//             console.log("google image data updated1");
//             // console.log(request.txt, request.id);

//         }, 1000);

// });

window.onload = function () {
    console.log("google image data updated2");

    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    let _url = location.href;
    const url = new URL(_url);

    let msg = {
        type: url.searchParams.get("type"),
        article: url.searchParams.get("article"),
        callbackurl: url.searchParams.get("callbackurl"),
    };
    console.log(msg);

    const imgPayload = [];
    if (msg.type === "imgAndTitle") {
        //parse images and titles
        const body = document.getElementById("islrg");
        console.log(body);
        const imgs = body.getElementsByTagName("img");
        console.log(imgs.length);
        for (let i in imgs) {
            const img = imgs[i];
            if( !img.getAttribute ) continue;
            let src = img.getAttribute("src");
            if (!src) src = img.getAttribute("data-src");
            const alt = img.getAttribute("alt");

            console.log(i, src, alt);
            imgPayload.push({ src: src, alt: alt, rel: 50 });
        }
    }
    msg.imgPayload = imgPayload;
    fetch(msg.callbackurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(msg),
    });
};
