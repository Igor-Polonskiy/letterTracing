(() => {
    let c = document.querySelector('canvas');
    let cx = c.getContext('2d');
    let mousedown = false;
    //let oldx = null;
    //let oldy = null;
    let pixels = null;
    let letterpixels = null;
    let letter = 'Aa'
    let isLetterComplete = false
    let r = 220
    let g = 0
    let b = 0
    let drowColor = `rgb(${r}, ${g}, ${b})`

    function setupCanvas() {
        c.height = 480;
        c.width = 600;
        cx.lineCap = 'round';
        // cx.strokeStyle = 'rgb(0, 0, 100)';
        cx.font = 'bold 310px Arial';
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
        //cx.lineWidth = 30;
        //cx.strokeText(letter, centerx, centery);
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
        if (colour.a === 0 || colour.r === 240) {
            // showerror('you are outside');
            /*чтобы линия не рисовалась вне буквы*/
            mousedown = false;
        } else {
            cx.strokeStyle = drowColor;
            //cx.fillStyle = 'rgb(0, 50, 50)';
            /*if (oldx > 0 && oldy > 0) {
                cx.moveTo(oldx, oldy);
            }*/
            cx.lineWidth = 28;
            cx.lineTo(x, y);
            cx.stroke();
            cx.beginPath();
            //cx.arc(x, y, 10, 0, Math.PI * 2)
            cx.stroke();

            cx.beginPath();
            cx.moveTo(x, y)
                //oldx = x;
                //oldy = y;
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

        if (getpixelamount(r, g, b) / letterpixels > 0.85) {
            if (!isLetterComplete) {
                pulse()
            }
        }
    };

    function pulse() {
        let size = 310

        let timerId1 = setInterval(() => {
            size += 2
            cx.clearRect(0, 0, c.width, c.height)
            cx.font = `bold ${size}px Arial`;
            drawletter(letter, drowColor)
        }, 40);

        // остановить вывод через 5 секунд
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
        let x = ev.clientX;
        let y = ev.clientY;
        if (mousedown) {
            paint(x, y);
        }
    };

    c.addEventListener('mousedown', onmousedown, false);
    c.addEventListener('mouseup', onmouseup, false);
    c.addEventListener('mousemove', onmousemove, false);

    setupCanvas();
})()