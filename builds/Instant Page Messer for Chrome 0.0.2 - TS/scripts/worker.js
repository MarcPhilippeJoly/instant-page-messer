/*
    Instant Page Messer
    Background service worker

    Marc Philippe Joly
    2021
*/

console.log(`Instant Page Messer > running!`)

chrome.action.onClicked.addListener(messWithCurrentTab);

function messWithCurrentTab(tab) {

    console.log(`Instant Page Messer > messing with the current tab!`)
    console.log(tab);

    // inject styles
    /*
    chrome.scripting.insertCSS({
        target: {
            tabId: tab.id,
            allFrames: true
        },
        //files: ["styles/ipm_content.css"],
        css: `body {background-color: green !important;}`
    });
    */

    // inject script
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id,
            allFrames: true
        },
        files: ["scripts/messer.js"]
        /*
        func: changeBackgroundColor,
        args: ["yellow"]
        */
    });

}

function changeBackgroundColor(color) {
    document.body.style.background = color;
}