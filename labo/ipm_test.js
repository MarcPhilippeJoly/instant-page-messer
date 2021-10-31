"use strict";

window.addEventListener("DOMContentLoaded", (event) => {

    // animation
    let lastTimestamp = undefined;
    function animateFurther(timestamp) {
        const lapse = timestamp - (lastTimestamp ?? timestamp);
        lastTimestamp = timestamp;
        if (blobulise(target, lapse)) requestAnimationFrame(animateFurther);
    }
    requestAnimationFrame(animateFurther);


    
}, { once: true })

