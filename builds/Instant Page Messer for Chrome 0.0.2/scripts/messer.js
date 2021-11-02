/**
 * Author: Marc Philippe Joly
 * Created: 2021-10-18
*/

//=======
// PARAMS
//=======

// degree of messing
const degOfM = 0.5; // 0 makes messing invisible, 1 makes total mess. 
const degOfM2 = degOfM ** 2;


//==========
// UTILITIES
//==========

//-----------------------------------
// Messing with dev environment first
// because so many things are missing

//---------------------------------------
// Giving NodeList and HTMLCollections some Arrays' methods
// thanks to Florian Margaine for this tip
['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'].forEach(
    function (p) {
        NodeList.prototype[p] = HTMLCollection.prototype[p] = Array.prototype[p];
    });

// --------------------
// Randomness utilities

// sugar for Math.random, 'cause I use it a lot
const rnd = Math.random;

function rndO() {
    return rnd() - rnd();
}

function rnd255() {
    return Math.floor(rnd() * 256);
}

function rndO255() {
    return rnd255() - rnd255();
}


//-------------------------------------
// Picking an array's element at random
function randomValueFrom(someIndexedArrayOrAlike) {
    let result = someIndexedArrayOrAlike[Math.floor(rnd() * someIndexedArrayOrAlike.length)];
    console.log(`calling randomValueFrom() with parameter:`);
    console.log(someIndexedArrayOrAlike);
    console.log(`randomValueFrom() returning:`);
    console.log(result);

    return result;
}


//--------------------
// Formats utilitities

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



//==========================
// GENERIC MESSING FUNCTIONS 
//==========================

/* messing with values */
function messing01(value) {
    return clipTo01Range(value + rndO() * degOfM);
}

function messing8Bits(value) {
    return to8bits(value + rndO255() * degOfM);
}

/* messing with length in pixels */
function messWithLength(HTMLLength, amount = undefined) {
    amount = parseFloat(amount ?? HTMLLength);
    return `${parseFloat(HTMLLength) + rndO() * amount * degOfM2}px`;
}
/* messing with distance (always positive) in pixels */
function messWithDistance(HTMLLength, amount = undefined) {
    amount = parseFloat(amount ?? HTMLLength);
    return `${Math.abs(parseFloat(HTMLLength) + rndO() * amount * degOfM2)}px`;
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


//================
// MESSING EFFECTS
//================


// Listing all content elements that could take effects
let elements = document.body.querySelectorAll(':not(script):not(style):not(brw):not(window)');
console.log(elements);
//const numberOfAvailableElements = Object.keys(elements).length;




//-----------------------------
// messing effects' definitions

/* Messing up with Background color  */
messingWithBgColor = (element) => {
    let currentInk = window.getComputedStyle(element).backgroundColor;
    let messedInk = messingWithInks(currentInk);
    element.style.backgroundColor = messedInk;
}

/* Messing up with colors */
messingWithColor = (element) => {
    let currentInk = window.getComputedStyle(element, null).color;
    let messedInk = messingWithInks(currentInk);
    element.style.color = messedInk;
}

/* Messing up with sharpness (bluring) */
messWithSharpness = (element) => {
    let aBlurFilter = `blur(${Math.max(0, 8 * rndO() * degOfM2)}px)`;
    element.style.filter = element.style.filter + ' ' + aBlurFilter;
}

/* messing up with margins */
messWithMargins = (element) => {
    let currentStyle = window.getComputedStyle(element);
    let horizontalFactor = parseFloat(currentStyle.width) / 8;
    let verticalFactor = parseFloat(currentStyle.height) / 8;
    let margin = [];
    margin[0] = messWithLength(currentStyle.marginTop, verticalFactor);
    margin[1] = messWithLength(currentStyle.marginRight, horizontalFactor);
    margin[2] = messWithLength(currentStyle.marginBottom, verticalFactor);
    margin[3] = messWithLength(currentStyle.marginLeft, horizontalFactor);
    let messedUpMargin = margin.join(' ');
    element.style.marginTop = margin[0];
    element.style.marginLeft = margin[3];
}

/* messing up with paddings */
messWithPaddings = (element) => {
    let currentStyle = window.getComputedStyle(element);
    let horizontalFactor = parseFloat(currentStyle.width) / 8;
    let verticalFactor = parseFloat(currentStyle.height) / 8;
    let padding = [];
    padding[0] = messWithLength(currentStyle.paddingTop, verticalFactor);
    padding[1] = messWithLength(currentStyle.paddingRight, horizontalFactor);
    padding[2] = messWithLength(currentStyle.paddingBottom, verticalFactor);
    padding[3] = messWithLength(currentStyle.paddingLeft, horizontalFactor);
    let messedUpPadding = padding.join(' ');
    element.style.paddingTop = padding[0];
    element.style.paddingRight = padding[1];
    element.style.paddingBottom = padding[2];
    element.style.paddingLeft = padding[3];
}

/* messing up with border radii */
messWithBorderRadii = (element) => {
    const currentStyle = window.getComputedStyle(element);
    let currentBorderRadii = [];
    currentBorderRadii[0] = currentStyle.borderTopLeftRadius.split('/');
    currentBorderRadii[1] = currentStyle.borderTopRightRadius.split('/');
    currentBorderRadii[2] = currentStyle.borderBottomRightRadius.split('/');
    currentBorderRadii[3] = currentStyle.borderBottomLeftRadius.split('/');
    let messedUpBorderRadii = [[], []];
    for (let i = 0; i < 4; i++) {
        currentBorderRadii[i][1] = currentBorderRadii[i][1] ?? currentBorderRadii[i][0];
        messedUpBorderRadii[0][i] = messWithDistance(currentBorderRadii[i][0], Math.min(parseFloat(currentStyle.paddingLeft) + parseFloat(currentStyle.paddingRight)));
        messedUpBorderRadii[1][i] = messWithDistance(currentBorderRadii[i][1], Math.min(parseFloat(currentStyle.paddingTop) + parseFloat(currentStyle.paddingBottom)));
    }
    element.style.borderRadius = `${messedUpBorderRadii[0].join(' ')} / ${messedUpBorderRadii[1].join(' ')}`;
}


/* messing with 3D rotation */
messWith3DRotation = (element) => {
    let aRotation = (`rotate3d(${rndO() * degOfM}, ${rndO() * degOfM}, ${rndO() * degOfM}, ${rndO() * degOfM / 80}turn)`);
    element.style.transform += ' ' + aRotation;
    element.style.transformStyle = 'flat';
}

/* messing with 3D transform */
let perspectived = false;
messWith3DTransforms = (element) => {
    let degOfM50th = degOfM / 50;
    let aMatrix = `matrix3d(
        ${rndO() * degOfM50th},${rndO() * degOfM50th},0,
        ${rndO() * degOfM50th},1,${rndO() * degOfM50th},0,
        ${rndO() * degOfM50th},${rndO() * degOfM50th},1,0,
       0,0,0,${1 + rndO() * degOfM50th}
    )`;
    element.style.transform = element.style.transform + ' ' + aMatrix;
    if (!perspectived) {
        // messing up with global perspective
        document.body.style.perspective = `${Math.ceil(512 + rnd() * 512)}px`;
        document.body.style.perspectiveOrigin = `${50 + rndO() * 50 * degOfM2}% ${50 + rndO() * 50 * degOfM2}%`;
        perspectived = true;
    }
}


//----------------------------------------------
// messing effects' registration for activation

messingEffects = [
    () => { messingWithBgColor(randomValueFrom(elements)) },
    () => { messingWithColor(randomValueFrom(elements)); },
    () => { messWithSharpness(randomValueFrom(elements)) },
    () => { messWithMargins(randomValueFrom(elements)) },
    () => { messWithPaddings(randomValueFrom(elements)) },
];


//======================
// MAIN MESSING UP PILOT
//======================


// computing the number of effects to apply
const numberOfEffectsToApply = Math.ceil((messingEffects.length + elements.length) / 2 * degOfM);
console.log(`numberOfEffectsToApply === ${numberOfEffectsToApply}`)

// Applying so much effects
for (let step = 0; step < numberOfEffectsToApply; step++) {
    // pick a random effect in the list of effect and apply it
    randomValueFrom(messingEffects)();
}



// Et voilà !
console.log('the page should be all messed up now.')

