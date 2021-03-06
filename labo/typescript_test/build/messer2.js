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
var degOfM = 0.5;
/**
 * Second Degree of messing
 */
var degOfM2 = Math.pow(degOfM, 2);
/**
 * DEV'S COMFORT THINGS
 * NOTE: Messing with the dev environment first, because so many things are missing
 * to be able to us forEach on objects returned by quey selectors like if they where arrays
 * thanks to Florian Margaine
 */
(function (parameters) {
    parameters.forEach(function (p) {
        NodeList.prototype[p] = HTMLCollection.prototype[p] = Array.prototype[p];
    });
})(['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'every', 'some']);
/**
 * Randomness Utilities
 */
var rnd = Math.random;
/**
 *
 * @returns
 */
var rndO = function () { return rnd() - rnd(); };
/**
 *
 * @returns
 */
var rnd255 = function () { return Math.floor(rndO() * 256); };
/**
 *
 * @returns
 */
var rndO255 = function () { return rnd255() - rnd255(); };
/**
 * Formats Utilities
 */
var to8bits = function (n) { return Math.max(0, Math.min(255, Math.floor(n))); };
/**
 * Clip to range
 * @param n input number
 * @returns number's range
 */
var clipTo01Range = function (n) { return Math.max(0, Math.min(1, n)); };
/**
 * Array to html
 */
var ArrayToHTMLRGBa = function (components) { return "rgba(" + components[0] + ", " + components[1] + ", " + components[2] + ", " + components[3] + ")"; };
/**
 * HTML rgba to array
 * @param i input
 * @param convert extract 3 or 4 substrings from RGB or RGBa css string;
 * @param components convert to floats
 * @returns components
 */
var HTMLRGBaToArray = function (i, convert, components) {
    var _a;
    if (convert === void 0) { convert = i.substring(i.indexOf('(') + 1, i.indexOf(')')).split(','); }
    if (components === void 0) { components = convert.map(parseFloat); }
    components[3] = (_a = components[3]) !== null && _a !== void 0 ? _a : 1;
    return components;
};
/**
 * GENERIC MESSING FUNCTIONS
 */
/**
 * Messing with values
 * @param value
 * @returns value messed up
 */
var messing01 = function (value) { return clipTo01Range(value + rndO() * degOfM); };
/**
 *
 * @param value
 * @returns
 */
var messing8Bits = function (value) { return to8bits(value + rndO255() * degOfM); };
/**
 * messing with length in pixels
 * @param HTMLLength
 * @param amount
 * @returns
 * TODO: fix any on parameters
 */
var messWithLength = function (HTMLLength, amount) {
    if (amount === void 0) { amount = undefined; }
    amount = parseFloat(amount !== null && amount !== void 0 ? amount : HTMLLength);
    return parseFloat(HTMLLength) + rndO() * amount * degOfM2 + "px";
};
/**
 * messing with distance (always positive) in pixels
 * @param HTMLLength
 * @param amount
 * @returns
 * TODO: fix any on parameters
  */
var messWithDistance = function (HTMLLength, amount) {
    if (amount === void 0) { amount = undefined; }
    amount = parseFloat(amount !== null && amount !== void 0 ? amount : HTMLLength);
    return Math.abs(parseFloat(HTMLLength) + rndO() * amount * degOfM2) + "px";
};
/**
 * messing with inks (RGBa colors)
 * @param HTMLInk
 * @returns
 * TODO: fix any on parameters
 */
var messingWithInks = function (HTMLInk) {
    var RGBA = HTMLRGBaToArray(HTMLInk);
    for (var i = 0; i < 3; i++) {
        RGBA[i] = messing8Bits(RGBA[i]);
    }
    ;
    RGBA[3] = messing01(RGBA[3]);
    return ArrayToHTMLRGBa(RGBA);
};
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
    var currentInk = window.getComputedStyle(element).backgroundColor;
    var messedInk = messingWithInks(currentInk);
    element.style.backgroundColor = messedInk;
}
/* Messing up with colors */
function messWithColor(element) {
    var currentInk = window.getComputedStyle(element, null).color;
    var messedInk = messingWithInks(currentInk);
    element.style.color = messedInk;
}
/* Messing up with sharpness (bluring) */
function messWithSharpness(element) {
    var aBlurFilter = "blur(" + Math.max(0, 8 * rndO() * degOfM2) + "px)";
    element.style.filter = element.style.filter + ' ' + aBlurFilter;
}
/* messing up with margins */
function messWithMargins(element) {
    var currentStyle = window.getComputedStyle(element);
    var horizontalFactor = parseFloat(currentStyle.width) / 8;
    var verticalFactor = parseFloat(currentStyle.height) / 8;
    var margin = [];
    margin[0] = messWithLength(currentStyle.marginTop, verticalFactor);
    margin[1] = messWithLength(currentStyle.marginRight, horizontalFactor);
    margin[2] = messWithLength(currentStyle.marginBottom, verticalFactor);
    margin[3] = messWithLength(currentStyle.marginLeft, horizontalFactor);
    var messedUpMargin = margin.join(' ');
    element.style.marginTop = margin[0];
    element.style.marginLeft = margin[3];
}
/* messing up with paddings */
function messWithPaddings(element) {
    var currentStyle = window.getComputedStyle(element);
    var horizontalFactor = parseFloat(currentStyle.width) / 8;
    var verticalFactor = parseFloat(currentStyle.height) / 8;
    var padding = [];
    padding[0] = messWithLength(currentStyle.paddingTop, verticalFactor);
    padding[1] = messWithLength(currentStyle.paddingRight, horizontalFactor);
    padding[2] = messWithLength(currentStyle.paddingBottom, verticalFactor);
    padding[3] = messWithLength(currentStyle.paddingLeft, horizontalFactor);
    var messedUpPadding = padding.join(' ');
    element.style.paddingTop = padding[0];
    element.style.paddingRight = padding[1];
    element.style.paddingBottom = padding[2];
    element.style.paddingLeft = padding[3];
}
/* messing up with border radii */
function messWithBorderRadii(element) {
    var _a;
    var currentStyle = window.getComputedStyle(element);
    var currentBorderRadii = [];
    currentBorderRadii[0] = currentStyle.borderTopLeftRadius.split('/');
    currentBorderRadii[1] = currentStyle.borderTopRightRadius.split('/');
    currentBorderRadii[2] = currentStyle.borderBottomRightRadius.split('/');
    currentBorderRadii[3] = currentStyle.borderBottomLeftRadius.split('/');
    var messedUpBorderRadii = [[], []];
    for (var i = 0; i < 4; i++) {
        currentBorderRadii[i][1] = (_a = currentBorderRadii[i][1]) !== null && _a !== void 0 ? _a : currentBorderRadii[i][0];
        messedUpBorderRadii[0][i] = messWithDistance(currentBorderRadii[i][0], Math.min(parseFloat(currentStyle.paddingLeft) + parseFloat(currentStyle.paddingRight)));
        messedUpBorderRadii[1][i] = messWithDistance(currentBorderRadii[i][1], Math.min(parseFloat(currentStyle.paddingTop) + parseFloat(currentStyle.paddingBottom)));
    }
    element.style.borderRadius = messedUpBorderRadii[0].join(' ') + " / " + messedUpBorderRadii[1].join(' ');
}
/* messing with 3D rotation */
function messWith3DRotation(element) {
    var aRotation = ("rotate3d(" + rndO() * degOfM + ", " + rndO() * degOfM + ", " + rndO() * degOfM + ", " + rndO() * degOfM / 80 + "turn)");
    element.style.transform += ' ' + aRotation;
    element.style.transformStyle = 'flat';
}
/* messing with 3D transform */
function messWith3DTransforms(element) {
    var degOfM50th = degOfM / 50;
    var aMatrix = "matrix3d(\n        " + rndO() * degOfM50th + "," + rndO() * degOfM50th + ",0,\n        " + rndO() * degOfM50th + ",1," + rndO() * degOfM50th + ",0,\n        " + rndO() * degOfM50th + "," + rndO() * degOfM50th + ",1,0,\n       0,0,0," + (1 + rndO() * degOfM50th) + "\n    )";
    element.style.transform = element.style.transform + ' ' + aMatrix;
}
/* List order messing */
/* list type messing */
/* sheep in the middle */
/* add smoke */
/* make physical */
// messing up with global perspective
document.body.style.perspective = Math.ceil(512 + rnd() * 512) + "px";
document.body.style.perspectiveOrigin = 50 + rndO() * 50 * degOfM2 + "% " + (50 + rndO() * 50 * degOfM2) + "%";
//************************************
// NOW THE BIG MESSING SHOULD HAPPEN !
// Listing all content elements except not-visual ones
var elements = document.querySelectorAll(':not(script):not(style)');
console.log(elements);
var numberOfAvailableEffects = Object.keys(messingEffects).length;
var numberOfEffectsToApply = Math.ceil(numberOfAvailableEffects * degOfM);
// Applying so much effects
for (var step = 0; step < numberOfEffectsToApply; step++) {
    // pick a random effect in the list of effect
    var someEffect = elements[Math.floor(rnd() * numberOfAvailableEffects)];
    // apply it to the page
}
// Et voil?? !
console.log('the page should be all messed up now.');
//# sourceMappingURL=messer2.js.map