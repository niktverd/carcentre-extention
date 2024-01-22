

function hideResponse(event) {
    alert("some text");
}

function getRequestId() {
    return document.getElementsByName("requestId")[0].value.trim();
}

function getActiveResponses() {
    return Array.from(document.querySelectorAll(".div_border"))
        .filter(div => div.querySelector('[name^="isActive"]').checked === true)
        .map(div => ({
            art: div.querySelector('[name^="number"]').value,
            name: (`${div.querySelector('[name^="descH4"]').value}` + ` ${div.querySelector('[name^="descP"]').value}`).trim(),
            brand: div.querySelector('[name^="brand"]').value,
            cost: div.querySelector('[name^="price"]').value,
            price: Number(div.querySelector('[name^="price"]').value) * 1.25,
            planDeliveryDate: div.querySelector('[name^="arriv"]').value,
            store: div.querySelector('[name^="store"]').value,
            supplier: div.querySelector('[name^="supplier"]').value,
            availableCount: div.querySelector('[name^="avail"]').value,
            isReturnable: div.querySelector('[name^="isReturnable"]').checked,
            isActive: true,
            createdDate: new Date()
        }));
}

document.addEventListener(
    "DOMContentLoaded",
    function() {
        document.querySelector("button").addEventListener("click", onclick, false);
	document.querySelector("#newPriceInput").addEventListener("keyup", onKeyUpPrice, false);
	function onKeyUpPrice(e){
	    console.log("popup.js onKeyUpPrice", e);
            const cost = e.target.value //parceInt(  );
	    const price = myFunction( cost );
	    document.querySelector("#newPriceSpan").innerText = price.price + " тенге (" + priceRound(price.price*1.1) + ") | " + price.percent*100 + "%";
            
	}
	function myFunction( cost ) {
	  const scale = 34.0;
	  const power = 0.5;
	//  const subpower = 2000
	//  const myPower = power/subpower;
	  const myPower = power;
	  const devider = Math.pow(cost, myPower);
	  const percent = scale / (devider);
	//  Logger.log( percent )
	//  Logger.log( percent+ " " + myPower+ " " +  devider )
	//  const percent = (price - cost) / cost;
	  if( percent >1 ){ 
	    return {percent: 1, price: priceRound( cost*(2) ), cost: cost};
	  }
	  if( percent <0.12 ) return {percent: 0.12, price: priceRound( cost*(1.12) ), cost: cost}
	  return {percent: percent, price: priceRound( cost*(1+percent) ), cost: cost};
	}

	function priceRound( price ){
	  const rounded = parseInt( price/10 );
	  const surpl = rounded%10;
	  var  priceRounded = 0;
	  if( surpl != 9 ) {
	    priceRounded = (rounded+1) *10;
	  }
	  else{
	    priceRounded = (rounded) *10;
	  }
	  return priceRounded;
	}
        function onclick() {
            console.log("popup.js");
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "hi", getResponse);
            });
            document.querySelector("button").hidden = true;
        }
        function getResponse(data) {
            let my_form = document.createElement("form");
            // my_form.style["background-color"] = "red";

            my_form.name = "myForm";
            my_form.method = "POST";
            my_form.action = "https://webhook.site/c1568ab7-2e1d-4a4f-b372-3f6049215a22";
            let my_label = document.createElement("label");
            let my_tb = document.createElement("input");
            my_tb.type = "text";
            my_tb.name = "requestId";
            my_label.textContent = "Id of request";
            my_label.setAttribute("for", my_tb.name);
            my_form.appendChild(my_label);
            my_form.appendChild(my_tb);

            let index = 0;
            console.log("We are going to build form with the next data", data);
            let isOdd = true;
            for (el of data) {
                const div = document.createElement("div");
                div.id = `hide_element_${index}`
                if (isOdd) div.style["background-color"] = "lightcyan";
                isOdd = !isOdd;
                div.className = "div_border";

                // -----------------------------------
                // hide button creation
                const hideButton = document.createElement( "button" );
                hideButton.id = `element_${index}`;
                hideButton.innerText = "X"
                hideButton.type = "button"
                hideButton.addEventListener("click", e => {
                    e.preventDefault();
                    console.log( "clicked?", e.target.id, `buttonId_${index}` )
                    document.getElementById(`hide_${e.target.id}`).hidden = true;
                    e.stopPropagation();
                }, false);
                div.appendChild(hideButton);
                // -----------------------------------

                Object.keys(el).forEach(field => {
                    let my_tb = document.createElement("input");
                    my_tb.type = "text";
                    my_tb.placeholder = field;
                    if (field === "avail" || field === "price") my_tb.type = "number";
                    my_tb.name = `${field}_${index}`;
                    my_tb.value = el[field];
                    div.appendChild(my_tb);
                });

                let isReturnableCheckbox = document.createElement("input");
                isReturnableCheckbox.type = "checkbox";
                isReturnableCheckbox.name = "isReturnableCheckbox_" + index;
                isReturnableCheckbox.checked = false;
                div.appendChild(isReturnableCheckbox);

                let my_cb = document.createElement("input");
                my_cb.type = "checkbox";
                my_cb.name = "isActive_" + index;
                my_cb.checked = false;
                div.appendChild(my_cb);

                my_form.appendChild(div);
                index++;
            }
            my_tb = document.createElement("button");
            my_tb.id = "submitButton"
            my_tb.type = "submit";
            my_tb.value = "submit";
            my_tb.title = "submit";
            my_tb.textContent = "submit";
            my_form.appendChild(my_tb);
            document.body.appendChild(my_form);

            my_form.addEventListener("submit", e => {
                e.preventDefault();

                my_tb.disabled = true;

                const BACKEND_URL = "https://carcentre.herokuapp.com";

                const app = feathers();
                app.configure(feathers.rest(BACKEND_URL).fetch(window.fetch));
                app.configure(feathers.authentication());

                app.authenticate({
                    strategy: "local",
                    email: "77000000000",
                    password: "833v"
                })
                    .then(() => {
                        const requestId = getRequestId();

                        if (!requestId) {
                            alert("Нет ID заявки");
                            my_tb.disabled = false;
                            return;
                        }

                        const responses = getActiveResponses();

                        if (!responses.length) {
                            alert("Ничего не выбрано");
                            my_tb.disabled = false;
                            return;
                        }

                        app.service("requests")
                            .patch(requestId, {
                                $push: {
                                    responses: { $each: responses }
                                }
                            })
                            .then(() => {
                                window.close();
                            });
                    })
                    .catch(e => {
                        console.error("Authentication error", e);
                        alert("Не удалось авторизоваться");
                    });
            });
        }
    },
    false
);
