// ==UserScript==
// @name         ChatGPT_OCM
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use ChatGPT in BRZ 365 OCM to create texts
// @author       Martin Löffler
// @match        https://ocm.brz365.eu/project-lv/389
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brz365.eu
// @grant        none
// @run-at       document-ready
// ==/UserScript==

const OPENAI_API_KEY = "<add you personal ChatGPT API key here>";

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
  var prompt = document
    .querySelector("div.textEditor0 iframe")
    .contentWindow.document.querySelector("#tinymce").innerText;
  //delete all \n in prompt
  prompt = prompt.replace(/\n/g, " ");
  console.log("prompt: " + prompt);

  //set wait message
  document
    .querySelector("div.textEditor0 iframe")
    .contentWindow.document.querySelector("#tinymce").innerText =
    "...bitte warten...";

  //call ChatGPT
  const url = "https://api.openai.com/v1/chat/completions";
  const data = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content:
          "Erstelle einen Langtext für eine Position in einem Leistungsverzeichnis für eine Ausschreibung aus den Stichpunkten des Users im Stil des Standardleistungsbuch STLB.",
      },
      { role: "user", content: prompt },
    ],
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(
      (data) =>
        (document
          .querySelector("div.textEditor0 iframe")
          .contentWindow.document.querySelector("#tinymce").innerText =
          data.choices[0].message.content)
    )
    .catch((error) => console.error(error));
}

// add the button to the element with the class "card-header__title"
function addChatGPTButton() {
  waitForElement("div.textEditor0").then((elm) => {
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
      // leave if button already exists
      if (document.querySelector("button.ChatGPTButton")) {
        return;
      }
      // add button
      const langtext1 = document.querySelector("span.card-header__title");
      if (langtext1) {
        const button = document.createElement("button");
        button.type = "button";
        button.innerText = "ChatGPT";
        button.className = "ChatGPTButton";
        button.style = "margin-left: 5px";
        button.addEventListener("click", callChatGPT);
        langtext1.after(button);
      }
    }
  });
}

(function () {
  "use strict";

  //react on changes in the view to add the button again to new positions
  // Select the node that will be observed for mutations
  const targetNode = document.body;

  // Callback function to execute when mutations are observed
  const callback = () => {
    // check if the element with the class "card-header__title" is loaded and the button is not already there
    if (
      document.querySelector("span.card-header__title") &&
      !document.querySelector("button.ChatGPTButton")
    ) {
      addChatGPTButton();
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, { childList: true, subtree: true });
})();
