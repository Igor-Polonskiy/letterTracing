(() => {
    /*все вхождения letter_B... заменить A на нужную букву*/
    let reload = document.querySelector('.letter_B_reloadTask')
    let audio = document.querySelector('.letter_B_audio')
    let c = document.querySelector('.letter_B_canvas');
    let cx = c.getContext('2d');
    let mousedown = false;

    let pixels = null;
    let letterpixels = null;
    /*заменить Aa на нужные буквы*/
    let letter = 'Bb'
        /**/
        /*при необходимости подобрать нужный шрифт*/
    let font = 'arial'
        /**/
    let isLetterComplete = false
        /*заменть цвет закраски буквы на нужный в формате rgb*/
    let r = 0
    let g = 0
    let b = 220
        /**/
    let drowColor = `rgb(${r}, ${g}, ${b})`



    function setupCanvas() {
        c.height = 400;
        c.width = 500;
        cx.lineCap = 'round';
        cx.font = `bold 310px ${font}`;
        cx.fillStyle = 'rgb(255, 255, 255)';
        cx.textBaseline = 'middle';

        drawletter(letter, 'white');
        pixels = cx.getImageData(0, 0, c.width, c.height);
        letterpixels = getpixelamount(255, 255, 255);
    }

    function drawletter(letter, color) {
        let centerx = (c.width - cx.measureText(letter).width) / 2;
        let centery = c.height / 2;
        cx.fillStyle = color;
        cx.strokeStyle = 'rgb(240, 0, 0)';

        cx.fillText(letter, centerx, centery);
        drawletterBorder(letter)
    };

    function drawletterBorder(letter) {
        let centerx = (c.width - cx.measureText(letter).width) / 2;
        let centery = c.height / 2;
        cx.lineWidth = 15;
        cx.lineCap = 'round'
        cx.strokeStyle = 'rgb(240, 100, 0)';
        cx.strokeText(letter, centerx, centery);
    };

    function showerror(error) {
        mousedown = false;
        alert(error);
    };

    function paint(x, y) {
        let colour = getpixelcolour(x, y);
        if ( /*colour.a === 0 ||*/ (colour.r !== 255 && colour.g !== 255 && colour.b !== 255)) {
            // showerror('you are outside');
            /*чтобы линия не рисовалась вне буквы*/
            mousedown = false;
        } else {
            cx.strokeStyle = drowColor;

            cx.lineWidth = 28;
            cx.lineTo(x, y);
            cx.stroke();
            cx.beginPath();
            cx.stroke();

            cx.beginPath();
            cx.moveTo(x, y)

            drawletterBorder(letter)
        }
    };

    function getpixelcolour(x, y) {
        let index = ((y * (pixels.width * 4)) + (x * 4));
        return {
            r: pixels.data[index],
            g: pixels.data[index + 1],
            b: pixels.data[index + 2],
            a: pixels.data[index + 3]
        };
    }

    function getpixelamount(r, g, b) {
        let pixels = cx.getImageData(0, 0, c.width, c.height);
        let all = pixels.data.length;
        let amount = 0;
        for (i = 0; i < all; i += 4) {
            if (pixels.data[i] === r &&
                pixels.data[i + 1] === g &&
                pixels.data[i + 2] === b) {
                amount++;
            }
        }
        return amount;
    };

    function pixelthreshold() {

        if (getpixelamount(r, g, b) / letterpixels > 0.75) {
            if (!isLetterComplete) {
                pulse()
            }
        }
    };

    function pulse() {
        let size = 310

        audio.play()

        let timerId1 = setInterval(() => {
            size += 2
            cx.clearRect(0, 0, c.width, c.height)
            cx.font = `bold ${size}px ${font}`;
            drawletter(letter, drowColor)
        }, 40);

        setTimeout(() => {
            clearInterval(timerId1);
            let timerId2 = setInterval(() => {
                size -= 2
                cx.clearRect(0, 0, c.width, c.height)
                cx.font = `bold ${size}px Arial`;
                drawletter(letter, drowColor)
                console.log(size)
            }, 40);
            setTimeout(() => {
                clearInterval(timerId2);
            }, 1000);
        }, 1000);

        isLetterComplete = true
    }

    function onmousedown(ev) {
        mousedown = true;
        ev.preventDefault();

    };

    function onmouseup(ev) {
        mousedown = false;
        pixelthreshold();
        ev.preventDefault();
        cx.beginPath();
    };

    function onmousemove(ev) {
        if (mousedown) {
            let x = ev.clientX - c.getBoundingClientRect().x;
            let y = ev.clientY - c.getBoundingClientRect().y;

            paint(x, y);
        }
    };

    function reloadTask() {
        isLetterComplete = false
        setupCanvas();
    }

    reload.addEventListener('click', reloadTask)

    c.addEventListener('mousedown', onmousedown, false);
    c.addEventListener('mouseup', onmouseup, false);
    c.addEventListener('mousemove', onmousemove, false);

    setupCanvas();
})()