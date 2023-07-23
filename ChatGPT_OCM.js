// ==UserScript==
// @name         ChatGPT_OCM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use ChatGPT in BRZ 365 OCM to create texts
// @author       Martin Löffler
// @match        https://ocm.brz365.eu/project-lv/389
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brz365.eu
// @grant        none
// @run-at       document-ready
// ==/UserScript==

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function callChatGPT() {
  console.log("callChatGPT");
  var promt = document
    .querySelector("div.textEditor0 iframe")
    .contentWindow.document.querySelector("#tinymce").innerText;
  //delete all \n in promt
  promt = promt.replace(/\n/g, " ");
  console.log("promt: " + promt);
}

(function () {
  "use strict";
  alert("before");

  waitForElement("div.textEditor0").then((elm) => {
    alert("after");

    //wait until the element with the class "card-header__title" is loaded
    const interval = setInterval(function () {
      const langtext1 = document.querySelector("span.card-header__title");
      if (langtext1) {
        clearInterval(interval);
        addChatGPT();
      }
    }, 1000);

    // add the button to the element with the class "card-header__title"
    function addChatGPT() {
      const langtext1 = document.querySelector("span.card-header__title");
      if (langtext1) {
        const button = document.createElement("button");
        button.type = "button";
        button.innerText = "ChatGPT";
        button.className = "btn btn-primary btn-sm";
        button.style = "margin-left: 5px";
        button.addEventListener("click", callChatGPT);
        langtext1.after(button);
      }
    }
  });
})();