'use strict';

window.onload = function() {
    const PI2 = 2 * Math.PI;
    const AMOUNT_DIVIDER = 2800;
    const DIST_MAX = 100;
    const CONNECT_RADIUS = 100;
    const ROTATION = 0.0001;

    let canvas = document.getElementById('stars');
    let ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let center = { x: canvas.width / 2, y: canvas.height / 2 };
    let connectArea = { x: center.x, y: center.y, destX: center.x, destY: center.y * 0.1 };
    let dots = [];

    class Dot {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 1.2;
        }

        update() {
            this.x = Math.cos(ROTATION) * (this.x - center.x) - Math.sin(ROTATION) * (this.y - center.y) + center.x;
            this.y = Math.sin(ROTATION) * (this.x - center.x) + Math.cos(ROTATION) * (this.y - center.y) + center.y;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            ctx.arc(this.x, this.y, this.radius, 0, PI2);
            ctx.fill();
        }
    }

    function initStars() {
        dots = [];
        let amount = Math.floor(canvas.width * canvas.height / AMOUNT_DIVIDER);
        for (let i = 0; i < amount; i++) {
            dots.push(new Dot());
        }
    }

    function updateConnectArea() {
        connectArea.x += (connectArea.destX - connectArea.x) * 0.05;
        connectArea.y += (connectArea.destY - connectArea.y) * 0.05;
    }

    function connectDots() {
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                let dx = dots[i].x - dots[j].x;
                let dy = dots[i].y - dots[j].y;

                if (dx * dx + dy * dy < DIST_MAX * DIST_MAX) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateDots() {
        requestAnimationFrame(animateDots);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateConnectArea();

        dots.forEach(dot => dot.update());
        connectDots();
        dots.forEach(dot => dot.draw());
    }

    document.body.addEventListener('mousemove', (e) => {
        connectArea.destX = e.clientX;
        connectArea.destY = e.clientY;
    });

    document.body.addEventListener('mouseleave', () => {
        connectArea.destX = center.x;
        connectArea.destY = center.y;
    });

    initStars();
    animateDots();
};
