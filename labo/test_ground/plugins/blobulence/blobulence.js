window.addEventListener("DOMContentLoaded", (event) => {

    // target detection
    const target = document.getElementById("victime");
    const targetStyle = window.getComputedStyle(target, null);

    // récupération des 8 rayons de forme de la bordure
    let targetRadii = targetStyle.borderRadius.split('/');
    targetRadii[0] = targetRadii[0].split(' ');
    targetRadii[0][1] = targetRadii[0][1] ?? targetRadii[0][0];
    targetRadii[0][2] = targetRadii[0][2] ?? targetRadii[0][0];
    targetRadii[0][3] = targetRadii[0][3] ?? targetRadii[0][1];
    targetRadii[1] = targetRadii[1] ? targetRadii[1].split(' ') : targetRadii[0];
    targetRadii[1][1] = targetRadii[1][1] ?? targetRadii[1][0];
    targetRadii[1][2] = targetRadii[1][2] ?? targetRadii[1][0];
    targetRadii[1][3] = targetRadii[1][3] ?? targetRadii[1][1];
    // normalisation de px en float
    targetRadii.forEach((v0) => {
        v0.forEach((v1, i1, a1) => {
            a1[i1] = parseFloat(v1);
        });
    });

    // calcul de la surface du block comme rectangle arrondi
    // calcul sans les arrondis
    let targetArea = target.offsetWidth * target.offsetHeight;
    // retranchement des arrondis
    cuttinRounded = Math.PI / 4 - 1;
    for (i = 0; i < 4; i++) {
        targetArea += targetRadii[0][i] * targetRadii[1][i] * cuttinRounded;
    }

    // calcul des diametre et rayon du cercle à atteindre
    const targetRadius = Math.sqrt(targetArea / Math.PI);
    const targetDiameter = targetRadius * 2;


    // Méthode de blobulisation
    let targetWidth = target.offsetWidth;
    let targetHeight = target.offsetHeight;
    let targetWidthSpeed = 0;
    let targetHeightSpeed = 0
    let targetRadiiSpeed = [[0, 0, 0, 0], [0, 0, 0, 0]];
    let targetWidthAcceleration = 0;
    let targetHeightAcceleration = 0
    let targetRadiiAcceleration = [[0, 0, 0, 0], [0, 0, 0, 0]];


    function blobulise(target, lapse = undefined) {

        const accelerationFactor = 0.005;
        const speedFactor = 0.995;

        // Recalcul des accélérations
        targetWidthAcceleration = (targetDiameter - targetWidth) * accelerationFactor;
        targetHeightAcceleration = (targetDiameter - targetHeight) * accelerationFactor;
        targetRadiiAcceleration.forEach((v0, i0) => {
            v0.forEach((v1, i1, a1) => {
                a1[i1] = (targetRadius - targetRadii[i0][i1]) * accelerationFactor;
            });
        });

        // Recalcul des vitesses
        targetWidthSpeed = targetWidthSpeed * speedFactor + targetWidthAcceleration;
        targetHeightSpeed = targetHeightSpeed * speedFactor + targetHeightAcceleration;
        targetRadiiSpeed.forEach((v0, i0) => {
            v0.forEach((v1, i1, a1) => {
                a1[i1] = v1 * speedFactor + targetRadiiAcceleration[i0][i1];
            });
        });

        // Recalcul des dimensions
        targetWidth += targetWidthSpeed;
        targetHeight += targetHeightSpeed;
        targetRadii.forEach((v0, i0) => {
            v0.forEach((v1, i1, a1) => {
                a1[i1] += targetRadiiSpeed[i0][i1];
            });
        });


        // Application des nouvelles dimensions
        target.style.width = `${targetWidth}px`;
        target.style.height = `${targetHeight}px`;
        // re-application des arrondis
        target.style.borderRadius = `${targetRadii[0][0]}px ${targetRadii[0][1]}px ${targetRadii[0][2]}px ${targetRadii[0][3]}px / ${targetRadii[1][0]}px ${targetRadii[1][1]}px ${targetRadii[1][2]}px ${targetRadii[1][3]}px`;

        // renvoir de true seulement si ça vaut le coup de continuer la simulation
        return (Math.abs(targetWidthAcceleration) + Math.abs(targetWidthSpeed)) > 0.001
    }

    // animation
    let lastTimestamp = undefined;
    function animateFurther(timestamp) {
        const lapse = timestamp - (lastTimestamp ?? timestamp);
        lastTimestamp = timestamp;
        if (blobulise(target, lapse)) requestAnimationFrame(animateFurther);
    }
    requestAnimationFrame(animateFurther);

})