window.addEventListener('DOMContentLoaded', (event) => {

    document.body.bgColor = "black";

    let vinceImage = document.createElement('img');
    vinceImage.src = 'vince.gif';
    vinceImage.style.width = 'auto';
    vinceImage.style.display = "block";
    vinceImage.style.position = 'fixed';
    vinceImage.style.bottom = 0;
    vinceImage.id = "vince_image";
    document.body.appendChild(vinceImage);


    vinceImageWidth = vinceImage.clientwidth ?? vinceImage.naturalWidth; // cette merde de client renvoie "undefined" ou "0" par toutes les méthodes sensée renvoyer la largeur calculée si jamais elle n'a pas été spécifiée explicitement dans le programme. Valeur "calculée" mon cul ! Du coup, tester et prendre la valeur naturelle si pas trouvé est la seule solution pour compenser cette ignominie. Quelle bande de cons ces développeurs de logiciels !

    // déplacement de Vince
    const animationDuration = 11000; // in milliseconds
    const additionalMargin = 18; //in px
    const vinceMAxOffset = vinceImageWidth + additionalMargin;
    function deplacement(elapsedTime) {
        const progress = elapsedTime / animationDuration;
        let styling = `${vinceMAxOffset * (Math.sin(progress * Math.PI) - 1) ^ (1 / 16)}px`;
        vinceImage.style.right = styling;
        return progress < 1;
    }


    // animation
    let firstTimestamp;
    function animateFurther(timestamp) {
        firstTimestamp = firstTimestamp ?? timestamp;
        if (deplacement(timestamp - firstTimestamp)) requestAnimationFrame(animateFurther);
    }

    requestAnimationFrame(animateFurther);


}, { once: true })