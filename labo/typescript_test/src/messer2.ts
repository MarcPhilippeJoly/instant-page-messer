/**
 * Instant Page Messer
 * Marc Philippe Joly
 * 2021
 */

/**
 * PARAMETERS CONFIGURATION
 */

/**
 * First Degree of messing
 */
const degOfM: number = 0.5;
/**
 * Second Degree of messing
 */
const degOfM2: number = degOfM ** 2;

/**
 * DEV'S COMFORT THINGS 
 * NOTE: Messing with the dev environment first, because so many things are missing
 * to be able to us forEach on objects returned by quey selectors like if they where arrays
 * thanks to Florian Margaine
 */
((parameters) => {
    parameters.forEach(p => {
        NodeList.prototype[p] = HTMLCollection.prototype[p] = Array.prototype[p];
    });
})(['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some'] as Array<string>);

/**
 * Randomness Utilities
 */
const rnd: () => number = Math.random;
/**
 * 
 * @returns 
 */
const rndO: () => number = () => rnd() - rnd();
/**
 * 
 * @returns 
 */
const rnd255: () => number = () => Math.floor(rndO() * 256);
/**
 * 
 * @returns 
 */
const rndO255: () => number = () => rnd255() - rnd255();

/**
 * Formats Utilities
 */
const to8bits: (n: number) => number = (n) => Math.max(0, Math.min(255, Math.floor(n)));

/**
 * Clip to range
 * @param n input number
 * @returns number's range
 */
const clipTo01Range: (n: number) => number = (n) => Math.max(0, Math.min(1, n));

/**
 * Array to html
 */
const ArrayToHTMLRGBa: (any) => string = (components) => `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${components[3]})`;

/**
 * HTML rgba to array
 * @param i input
 * @param convert extract 3 or 4 substrings from RGB or RGBa css string;
 * @param components convert to floats
 * @returns components
 */
const HTMLRGBaToArray = (i, convert = i.substring(i.indexOf('(') + 1, i.indexOf(')')).split(','), components = convert.map(parseFloat)) => {
    components[3] = components[3] ?? 1;
    return components;
}

/**
 * GENERIC MESSING FUNCTIONS 
 */

/**
 * Messing with values
 * @param value 
 * @returns value messed up
 */
const messing01: (number) => number = (value) => clipTo01Range(value + rndO() * degOfM);
/**
 * 
 * @param value 
 * @returns 
 */
const messing8Bits: (value: number) => number = (value) => to8bits(value + rndO255() * degOfM);
/**
 * messing with length in pixels
 * @param HTMLLength 
 * @param amount 
 * @returns 
 * TODO: fix any on parameters
 */
const messWithLength = (HTMLLength, amount = undefined) => {
    amount = parseFloat(amount ?? HTMLLength);
    return `${parseFloat(HTMLLength) + rndO() * amount * degOfM2}px`;
}
/**
 * messing with distance (always positive) in pixels
 * @param HTMLLength 
 * @param amount 
 * @returns 
 * TODO: fix any on parameters
  */
const messWithDistance = (HTMLLength, amount = undefined) => {
    amount = parseFloat(amount ?? HTMLLength);
    return `${Math.abs(parseFloat(HTMLLength) + rndO() * amount * degOfM2)}px`;
}
/**
 * messing with inks (RGBa colors)
 * @param HTMLInk 
 * @returns 
 * TODO: fix any on parameters
 */
const messingWithInks = (HTMLInk) => {
    let RGBA = HTMLRGBaToArray(HTMLInk);
    for (let i = 0; i < 3; i++) {
        RGBA[i] = messing8Bits(RGBA[i]);
    };
    RGBA[3] = messing01(RGBA[3]);
    return ArrayToHTMLRGBa(RGBA);
}

//TODO: TODOSECTION

//****************
// MESSING EFFECTS
//****************

var messingEffects = {};

// messingEffects.blobEffect = function () {
//     ()=>{}
// }

/* Messing up with Background color  */
function messWithBgColor(element) {
    let currentInk = window.getComputedStyle(element).backgroundColor;
    let messedInk = messingWithInks(currentInk);
    element.style.backgroundColor = messedInk;
}

/* Messing up with colors */
function messWithColor(element) {
    let currentInk = window.getComputedStyle(element, null).color;
    let messedInk = messingWithInks(currentInk);
    element.style.color = messedInk;
}

/* Messing up with sharpness (bluring) */
function messWithSharpness(element) {
    let aBlurFilter = `blur(${Math.max(0, 8 * rndO() * degOfM2)}px)`;
    element.style.filter = element.style.filter + ' ' + aBlurFilter;
}

/* messing up with margins */
function messWithMargins(element) {
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
function messWithPaddings(element) {
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
function messWithBorderRadii(element) {
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
function messWith3DRotation(element) {
    let aRotation = (`rotate3d(${rndO() * degOfM}, ${rndO() * degOfM}, ${rndO() * degOfM}, ${rndO() * degOfM / 80}turn)`);
    element.style.transform += ' ' + aRotation;
    element.style.transformStyle = 'flat';
}

/* messing with 3D transform */
function messWith3DTransforms(element) {
    let degOfM50th = degOfM / 50;
    let aMatrix = `matrix3d(
        ${rndO() * degOfM50th},${rndO() * degOfM50th},0,
        ${rndO() * degOfM50th},1,${rndO() * degOfM50th},0,
        ${rndO() * degOfM50th},${rndO() * degOfM50th},1,0,
       0,0,0,${1 + rndO() * degOfM50th}
    )`;
    element.style.transform = element.style.transform + ' ' + aMatrix;
}

/* List order messing */

/* list type messing */

/* sheep in the middle */

/* add smoke */

/* make physical */


// messing up with global perspective
document.body.style.perspective = `${Math.ceil(512 + rnd() * 512)}px`;
document.body.style.perspectiveOrigin = `${50 + rndO() * 50 * degOfM2}% ${50 + rndO() * 50 * degOfM2}%`;


//************************************
// NOW THE BIG MESSING SHOULD HAPPEN !

// Listing all content elements except not-visual ones
let elements = document.querySelectorAll(':not(script):not(style)');
console.log(elements);
const numberOfAvailableEffects = Object.keys(messingEffects).length;
const numberOfEffectsToApply = Math.ceil(numberOfAvailableEffects * degOfM);

// Applying so much effects
for (let step = 0; step < numberOfEffectsToApply; step++) {
    // pick a random effect in the list of effect
    let someEffect = elements[Math.floor(rnd() * numberOfAvailableEffects)];
    // apply it to the page
    
}



// Et voilà !
console.log('the page should be all messed up now.')

