/*
    World Wide What The Fuck ?!
    Marc Philippe Joly
*/


/***************/
/* PARAMS HERE */
/***************/

const degreeOfMessing = 0.025; // 0 makes messing invisible, 1 makes total mess. 


/************************/
/* DEV'S COMFORT THINGS */
/************************/
// Messing with the dev environment first, because so many things are missing

// to be able to us forEach on objects returned by quey selectors like if they where arrays
// thanks to Florian Margaine
['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'].forEach(
    function (p) {
        NodeList.prototype[p] = HTMLCollection.prototype[p] = Array.prototype[p];
    });

/**************/
/* Randomness */

/* sugar for Math.random, 'cause I use it a lot */
const rnd = Math.random;

function rnd255() {
    return Math.floor(rnd() * 256);
}

function rndO() {
    return rnd() - rnd();
}

function rndO255() {
    return rnd255() - rnd255();
}


/********************/
/* Formats management */

function to8bits(n) {
    return Math.max(0, Math.min(255, Math.floor(n)));
}

function clipTo01Range(n) {
    return Math.max(0, Math.min(1, n));
}

function HTMLRGBaToArray(ink) {
    // extract 3 or 4 substrings from RGB or RGBa css string;
    let components = ink.substring(ink.indexOf('(') + 1, ink.indexOf(')')).split(',');
    // convert to floats
    components = components.map(parseFloat);
    components[3] = components[3] ?? 1;
    return components;
}

function ArrayToHTMLRGBa(components) {
    return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${components[3]})`;
}


/*****************************/
/* GENERIC MESSING FUNCTIONS */
/*****************************/

/* messing with values */
function messing01(value) {
    return clipTo01Range(value + rndO() * degreeOfMessing);
}

function messing8Bits(value) {
    return to8bits(value + rndO255() * degreeOfMessing);
}

/* messing with length in pixels */
function messingWithLength(HTMLLength) {
    return `${parseFloat(HTMLLength) + rndO() * 256 * degreeOfMessing}px`;
}

/* messing with inks (RGBa colors) */
function messingWithInks(HTMLInk) {
    let RGBA = HTMLRGBaToArray(HTMLInk);
    for (let i = 0; i < 3; i++) {
        RGBA[i] = messing8Bits(RGBA[i]);
    };
    RGBA[3] = messing01(RGBA[3]);
    return ArrayToHTMLRGBa(RGBA);
}


/******************************/
/* SPECIFIC MESSING FUNCTIONS */
/******************************/

/* Messing up with Background color messing */
function messWithBgColors(element) {
    let currentInk = window.getComputedStyle(element).backgroundColor;
    let messedInk = messingWithInks(currentInk);
    console.log(`Messing with background color of ${element.nodeName}: ${currentInk} -> ${messedInk}`);
    element.style.backgroundColor = messedInk;
}

/* Messing up with colors */
function messWithColors(element) {
    let currentInk = window.getComputedStyle(element, null).color;
    let messedInk = messingWithInks(currentInk);
    console.log(`Messing with color of ${element.nodeName}: ${currentInk} -> ${messedInk}`);
    element.style.color = messedInk;
}

/* Messing up with sharpness (bluring) */
function messWithSharpness(element) {
    let aBlurFilter = `blur(${0 * 64 * rnd() * degreeOfMessing ** 1000}px)`;
    console.log(`Messing with sharpness of ${element.nodeName}: ${aBlurFilter}`);
    element.style.filter = element.style.filter + ' ' + aBlurFilter;
}

/* messing up with margins */
function messWithMargins(element) {
    let currentStyle = window.getComputedStyle(element);
    let margin = [];
    margin[0] = messingWithLength(currentStyle.marginTop);
    margin[1] = messingWithLength(currentStyle.marginRight);
    margin[2] = messingWithLength(currentStyle.marginBottom);
    margin[3] = messingWithLength(currentStyle.marginLeft);
    let messedUpMargin = margin.join(' ');
    console.log(`Messing with margins of ${element.nodeName}: ${currentStyle.margin} -> ${messedUpMargin}`);
    element.style.marginTop = margin[0];
    element.style.marginLeft = margin[3];
}

/* messing up with paddings */
function messWithPaddings(element) {
    let currentStyle = window.getComputedStyle(element);
    let padding = [];
    padding[0] = messingWithLength(currentStyle.paddingTop);
    padding[1] = messingWithLength(currentStyle.paddingRight);
    padding[2] = messingWithLength(currentStyle.paddingBottom);
    padding[3] = messingWithLength(currentStyle.paddingLeft);
    let messedUpPadding = padding.join(' ');
    console.log(`Messing with paddings of ${element.nodeName}: ${currentStyle.padding} -> ${messedUpPadding}`);
    element.style.paddingTop = padding[0];
    element.style.paddingRight = padding[1];
    element.style.paddingBottom = padding[2];
    element.style.paddingLeft = padding[3];
}

/* messing with border radii */
function messWithBorderRadii(element) {
    let currentBorderRadii = window.getComputedStyle(element).borderRadius;
    let borderRadii = currentBorderRadii.split('/');
    console.log(borderRadii);
    let messedUpBorderRadii = '';
    console.log(`Messing with border radii of ${element.nodeName}: ${currentBorderRadii} -> ${messedUpBorderRadii}`);
}


/* List order messing */

/* list type messing */

/* sheep in the middle */

/* add smoke */

/* make physical */

/* 3D transform messing */
function messWith3DTransforms(element) {
    let aMatrix = `matrix3d(
        1,${rndO() * degreeOfMessing},${rndO() * degreeOfMessing},0,
        ${rndO() * degreeOfMessing},1,${rndO() * degreeOfMessing},0,
        ${rndO() * degreeOfMessing},${rndO() * degreeOfMessing},1,0,
       0,0,0,${1 + rndO() * degreeOfMessing}
    )`;
    console.log(`Messing with 3D transform of ${element.nodeName}: ${aMatrix}`);
    element.style.transform = element.style.transform + ' ' + aMatrix;
}



/***************************/
/* THE BIG MESSING IS HERE */
/***************************/

function MessWith(element) {
    if (element && element.nodeName != 'SCRIPT' && 'style' in element) {
        console.log(`Messing with ${element.nodeName}`);
        // Mess with it
        messWithBgColors(element);
        messWithColors(element);
        messWithSharpness(element);
        messWithMargins(element);
        messWithPaddings(element);
        messWithBorderRadii(element);
        messWith3DTransforms(element);

        // Also mess with its chidren
        let theChildren = element.childNodes;
        theChildren.forEach(eachChild => {
            MessWith(eachChild);
        });
    };
};


window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé.");

    MessWith(document.body);

    // call this only once
}, { once: true })