"use strict";


// animation parameters
const maxNumberOfDrops = 10;
const semiAcceleration = 50;
const initialSpeed = 200;
const averageDropCreationPerSecond = 2;

// a pool of drops waiting for activation
const poolOfDrops = (function () {
    const drops = [];

    // a drop constructor
    function newDrop() {
        const newlyCreatedDrop = document.createElement('div');

        newlyCreatedDrop.classList.add('drop'); // '.drop' selector should be somewhere in the css linked to the same page

        // messing with colors is just for extra fun
        // it also helps tracking them when debuging
        newlyCreatedDrop.style.backgroundColor = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},0.75)`;

        // activate and reset
        // We can't rely on randomness of creation time only and simply reset drop's positions as soon as it finishes falling because the browser may wait for the user to regain focus on the tab to reset all the drops at the same time, making all drops fall together in line like no realistic rain does. Thus, we need separate activation and reset method, and a pool of unactive drops waiting for a random activation anytime. 
        // activation method
        newlyCreatedDrop.activate = function (timestamp) {
            rainyElement.appendChild(this);
            this.active = true;
            // the reset time of each drop is later used to compute their position according to current time
            this.activationTime = timestamp;
        }
        // reset (desactivation) method 
        newlyCreatedDrop.reset = function () {
            // initial drop coordinates
            this.x = (rainyElement.offsetWidth) * Math.random();
            this.y = 0;
            this.active = false;
            if (rainyElement.contains(this)) rainyElement.removeChild(this);
        }
        newlyCreatedDrop.reset();
        drops[drops.length] = newlyCreatedDrop;
        return newlyCreatedDrop;
    }

    function activateDrop(drop) {
        drop.active = true;
    }
    function deactivateDrop(drop) {
        drop.active = false;
    }

    return drops;
})();



// making extra sure DOM is loaded
window.addEventListener('DOMContentLoaded', (event) => {

    // get the element to rain in
    const rainyElement = document.getElementById("whereToRain");

    // an array to store all drop in
    let drops = [];




    // pre-creation of all the drops, in an initial non-active state
    while (drops.length < maxNumberOfDrops) {
        drops[drops.length] = newDrop();
    }


    // simulation function
    let previousTimeStamp;
    function rain(timestamp) {
        previousTimeStamp = previousTimeStamp ?? timestamp;
        // appending drops at random so they don't fall all together
        let newDropProbability = Math.random() < averageDropCreationPerSecond * (timestamp - previousTimeStamp) / 1000;
        console.log(`${drops.length} < ${maxNumberOfDrops} && ${newDropProbability}`);
        if (drops.length < maxNumberOfDrops && newDropProbability) {
            activateDrop();
        }

        // updating positions
        for (const eachDrop of drops) {
            let t = (timestamp - eachDrop.activationTime) / 1000;
            eachDrop.y = (initialSpeed + semiAcceleration * t) * t - initialSpeed;
            // using transform causes less css computation than using relative positioning or margins. 
            // x transform seems useless now but is needed if one can add wind effect
            eachDrop.style.transform = `translate(${eachDrop.x}px, ${eachDrop.y}px)`;
            // reseting drop position if its fall is over
            if (eachDrop.y > rainyElement.offsetHeight) eachDrop.reset(timestamp);
        }
        // the current timestamp become the previous timestamp for the nex frame
        previousTimeStamp = timestamp;
        // returning true so the whole animation continues
        // We could stop it anywhere in this simulation by returning any falsy value like false, 0 or null
        return true;
    }

    // Animation driver
    // calling the simulation in sync with the device framerate as long as it returns a truy value
    function animation(timestamp) {
        if (rain(timestamp)) requestAnimationFrame(animation);
    }
    // first call
    requestAnimationFrame(animation);

}, { once: true }) // once because DOM is loaded once so no need to listen more after

