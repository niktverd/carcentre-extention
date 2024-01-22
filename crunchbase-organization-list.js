console.log("crunchbase--organization-list started");
// Organization/Person Name
// Location
// Description
// Investment Stage
// Investor Type

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("\n\ncrunchbase--organization-list (on url changes) is running");
    console.log("123",  request, request.txt, request.id, request.url);
    setTimeout(function () {
        // getRecomendedPeopleFromTheRightSide();
        getContent();
    }, 15000);
});

window.onload = function () {
    console.log("\n\ncrunchbase--organization-list (onload) is running");
    // console.log(request.txt, request.id);
    setTimeout(function () {
        // getRecomendedPeopleFromTheRightSide();
        getContent();
    }, 5000);
};

function aboutBlock(_about) {
    const _o = {};
    _o['about-raw'] = _about.innerText;

    _o['about-description'] = _about.getElementsByTagName("p")[0].innerText;

    const _li = _about.getElementsByTagName("li");
    for(let i in _li){
        _l = _li[i];
        _lInnerHtml = _l.innerHTML;

        if( _lInnerHtml && _lInnerHtml.indexOf("location") !== -1 ){
            _o['about-location'] = _l.innerText;
        }
        if( _lInnerHtml && _lInnerHtml.indexOf("num_employees") !== -1 ){
            _o['about-num-employees'] = _l.innerText;
        }
        if( _lInnerHtml && _lInnerHtml.indexOf("funding_type") !== -1 ){
            _o['about-funding-type'] = _l.innerText;
        }
        if( _lInnerHtml && _lInnerHtml.indexOf("role=\"link\"") !== -1 ){
            _o['about-link'] = _l.innerText;
        }
        if( _lInnerHtml && _lInnerHtml.indexOf("rank") !== -1 ){
            _o['about-rank'] = _l.innerText;
        }
    }
    console.log(_o)
    return _o;
}

function highlightsBlock(_highlights) {
    const _o = {};
    _o['highlights-raw'] = _highlights.innerText;
    
    console.log(_o)
    return _o;
}

function newsBlock(_news) {
    const _o = {};
    _o['news-raw'] = _news.innerText;

    console.log(_o)
    return _o;
}
function detailsBlock(_details) {
    const _o = {};
    _o['details-raw'] = _details.innerText;

    const _cards = _details.getElementsByTagName("fields-card");

    const _detLi = _cards[0].getElementsByTagName("li");
    for( let i in _detLi ){
        
        const _d = _detLi[i];
        const _dInnerHtml = _d.innerHTML;
        // _dInnerHtml = _d.innerText;
        // const x = "" + _dt;
        if(!_dInnerHtml) continue;
        // console.log( "_dInnerHtml", _dInnerHtml )
        if( _dInnerHtml.indexOf("mat-chip-list") !== -1 ){
            _o["details-industries"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("location") !== -1 ){

            _o["details-location"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("Founded") !== -1 ){
            _o["details-founded-date"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("Founders") !== -1 ){
            _o["details-founders"] =_d.innerText;
            // _o["details-founders"] = _d.innerText;
            
        }
        if( _dInnerHtml.indexOf("Operating") !== -1 ){
            _o["details-operating-status"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("Funding") !== -1 ){
            _o["details-funding-type"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("Known") !== -1 ){
            _o["details-also-known-as"] =_d.innerText;
        }
        if( _dInnerHtml.indexOf("Legal") !== -1 ){
            _o["details-legal-name"] =_d.innerText;
        }
        // await console.log(i, "_o", _o, _d.innerText)
        
        // console.log("_d.innerText", _d.innerText)
    }
    // console.log(_detLi[i].innerText)

    console.log(_o)
    return _o;
}

function getContent() {
    const _orgName = document.getElementsByClassName("profile-name");
    const orgName = _orgName[0].innerText
    console.log("orgName", orgName);
    let out = {
        orgName: orgName
    };
    let url = location.href;
    if (url.indexOf("crunchbase.com/organization/") >= 0) {
        out.id = url.split("crunchbase.com/organization/")[1];
    } else {
        return 0;
    }

    const _sectionTitleWrapper = document.getElementsByTagName("profile-section");
    console.log( _sectionTitleWrapper[0].innerText )
    for( let i in _sectionTitleWrapper ){
        const _s = _sectionTitleWrapper[i];
        if( typeof( _s.getElementsByTagName ) !== "function" ) continue;
        const _header = _s.getElementsByTagName("h2");
        const header = _header[0].innerText;
        if( header.toLowerCase().indexOf("about") != -1 ){
            console.log(i, "about");
            out = {
                ...out,
                ...aboutBlock(_s)
            }
            
        }
        if( header.toLowerCase().indexOf("highlights") != -1 ){
            console.log(i, "highlights");
            // highlightsBlock(_s);
            out = {
                ...out,
                ...highlightsBlock(_s)
            }
        }
        if( header.toLowerCase().indexOf("recent news") != -1 ){
            console.log(i, "recent news")
            // newsBlock(_s);
            out = {
                ...out,
                ...newsBlock(_s)
            }
        }
        if( header.toLowerCase().indexOf("details") != -1 ){
            console.log(i, "details")
            // detailsBlock(_s);
            out = {
                ...out,
                ...detailsBlock(_s)
            }
        }
    }
    console.log("out", out)
    
    const payload = {
        func: "crunchbase-organizations",
        // func: "ADD_PERSON_DETAILS",
        data: out,
        platfrom: "crunchbase"
    }
    fetch("https://script.google.com/macros/s/AKfycbxiHhaHZsuKr8GudthTVzv4WDuWymS2SZG6uyOoIQPT4QGn7c8/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    })
    console.log( "sent" )
}

