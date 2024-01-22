console.log("linkedin-in started");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("\n\nlinkedin-in (on url changes) is running");
    setTimeout(function () {
        console.log(request.txt, request.id);
        getRecomendedPeopleFromTheRightSide();
        getPersonsData();
    }, 5000);
});

window.onload = function () {
    console.log("\n\nlinkedin-in (onload) is running");
    // console.log(request.txt, request.id);
    setTimeout(function () {
        getRecomendedPeopleFromTheRightSide();
        getPersonsData();
    }, 2000);
};

function parseCard(_card) {
    card = {};
    // console.log(_card);
    let ids = _card.getElementsByTagName("a");
    if (ids[0]) card.id = ids[0].href.split("/in/")[1].split("/")[0];
    else return 0;
    let names = _card.getElementsByClassName("name");
    if (names[0]) card.name = names[0].innerText;
    else return 0;
    let distances = _card.getElementsByClassName("distance-and-badge");
    if (distances[0]) card.distance = distances[0].innerText;
    let titles = _card.getElementsByClassName("pv-browsemap-section__member-headline t-14 t-black t-normal");
    if (titles[0]) card.title = titles[0].innerText;
    return card;
}

function getRecomendedPeopleFromTheRightSide() {
    const emberViews = document.getElementsByClassName("pv-browsemap-section__member-container pv-browsemap-section__member-container-line ember-view");
    const newPeople = [];
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        let card = emberViews[i];
        // console.log(i, card);
        let newCard = parseCard(card);
        if (newCard != 0) newPeople.push(newCard);
    }
    console.log(newPeople);
    const payload = {
        func: "ADD_RIGHT_SIDE_PEOPLE",
        // func: "ADD_PERSON_DETAILS",
        data: newPeople
    }
    fetch("https://script.google.com/macros/s/AKfycbxiHhaHZsuKr8GudthTVzv4WDuWymS2SZG6uyOoIQPT4QGn7c8/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    })
    // let span = document.createElement("span");
    // span.innerText = "downloaded"
    // document.body.appendChild(span)
    // .then( response =>{
    //     console.log(response.json())
    // } );
}

function getPersonsData() {
    let url = location.href;
    console.log("function getPersonsData()", url);
    let data = {};
    if (url.indexOf("linkedin.com/in/") >= 0) {
        data.id = url.split("linkedin.com/in/")[1].split("/")[0];
    } else {
        return 0;
    }
    getPersonsDataNameAndDistance(data);
    getPersonsTitle(data)
    getPersonsRegion(data);
    getPersonsMainDetails(data);
    getPersonsExperience(data);

    console.log(data);
    const payload = {
        func: "ADD_PERSON_DETAILS",
        data: data
    }
    fetch("https://script.google.com/macros/s/AKfycbxiHhaHZsuKr8GudthTVzv4WDuWymS2SZG6uyOoIQPT4QGn7c8/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    });
}
function getPersonsDataNameAndDistance(data) {
    const emberViews = document.getElementsByClassName("pv-top-card--list inline-flex align-items-center");
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        // get nname and distance --------------------------------------------------------
        let name_and_distance = emberViews[i];
        let lis = name_and_distance.getElementsByTagName("li");
        for (let j = 0; j < lis.length; j++) {
            if (j === 0) {
                data.name = lis[j].innerText;
            }
            if (j === 1) {
                data.distance = lis[j].innerText;
            }
        }
        break;
    }
}
function getPersonsTitle(data) {
    const emberViews = document.getElementsByClassName("mt1 t-18 t-black t-normal break-words");
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        // get nname and distance --------------------------------------------------------
        data.title = emberViews[i].innerText;
        break;
    }
}
function getPersonsRegion(data) {
    const emberViews = document.getElementsByClassName("pv-top-card--list pv-top-card--list-bullet mt1");
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        // get nname and distance --------------------------------------------------------
        let name_and_distance = emberViews[i];
        let lis = name_and_distance.getElementsByTagName("li");
        for (let j = 0; j < lis.length; j++) {
            if (j === 0) {
                data.region = lis[j].innerText;
            }
        }
        break;
    }
}
function getPersonsMainDetails(data) {
    const emberViews = document.getElementsByClassName("pv-highlights-section pv-profile-section artdeco-container-card ember-view");
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        // get nname and distance --------------------------------------------------------
        let name_and_distance = emberViews[i];
        let h3s = name_and_distance.getElementsByTagName("h3");
        for (let j = 0; j < h3s.length; j++) {
            if (j === 0) {
                data.friendsCount = h3s[j].innerText;
            }
        }
        break;
    }
}
function getPersonsExperience(data) {
    const buttons = document.getElementsByClassName(
        "pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle link link-without-hover-state"
    );
    for (let b in buttons) {
        if (!buttons[b]) continue;
        if (!buttons[b].click) continue;
        buttons[b].click();
        break;
    }
    const emberViews = document.getElementsByClassName("pv-profile-section experience-section ember-view");
    for (let i = 0; i < emberViews.length; i++) {
        if (!emberViews[i]) continue;
        // get nname and distance --------------------------------------------------------
        let name_and_distance = emberViews[i];
        let lis = name_and_distance.getElementsByTagName("li");
        let exp = [];
        for (let j = 0; j < lis.length; j++) {
            exp.push(lis[j].innerText);
        }
        data.experience = [...exp];
        break;
    }
}
// https://www.linkedin.com/in/galym/
