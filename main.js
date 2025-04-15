document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector(".code-input");
    const canvas = document.querySelector(".canvas-display");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    textarea.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    });

    let animationId = null;

    function runCode() {
        const code = textarea.value.trim();
    
        try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            const userScope = {
                ctx,
                canvas,
                drawCircle(x, y, size, color = 'black') {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                },
                drawSquare(x, y, size, color = 'black') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, size, size);
                },
                drawRectangle(x, y, width, height, color = 'black') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, width, height);
                },
                drawTriangle(x1, y1, x2, y2, x3, y3, color = 'black') {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x3, y3);
                    ctx.closePath();
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                },
                drawHeart(x, y, size, color = 'red') {
                    ctx.beginPath();
                    let topCurveHeight = size * 0.3;
                    ctx.moveTo(x, y + topCurveHeight);
                    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + topCurveHeight);
                    ctx.bezierCurveTo(x - size, y + size * 0.9, x, y + size * 1.5, x, y + size * 2);
                    ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size * 0.9, x + size, y + topCurveHeight);
                    ctx.bezierCurveTo(x + size, y, x, y, x, y + topCurveHeight);
                    ctx.closePath();
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                },
                drawLine(x1, y1, x2, y2, color = 'black') {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = color;
                    ctx.stroke();
                },
                clear() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                },
                middleX() {
                    return canvas.width / 2;
                },
                middleY() {
                    return canvas.height / 2;
                }
            };
    
            // Substitui `draw() {` por `userScope.draw = function() {`
            const fixedCode = code.replace(/^\s*draw\s*\(\s*\)\s*\{/m, "userScope.draw = function() {");
    
            // Envolve o código no escopo do userScope
            const wrappedCode = `
                with (userScope) {
                    ${fixedCode}
                }
            `;
            const executeUserCode = new Function("userScope", wrappedCode);
            executeUserCode(userScope);
    
            // Roda o loop apenas se a função draw foi definida
            if (typeof userScope.draw === "function") {
                function animationLoop() {
                    userScope.draw();
                    animationId = requestAnimationFrame(animationLoop);
                }
                animationLoop();
            }
    
        } catch (error) {
            showErrorMessage(error);
        }
    }
    
    

    function showErrorMessage(msg) {
        const errorBox = document.getElementById("error-message");
        errorBox.innerText = msg;
        errorBox.style.display = "block";

        setTimeout(() => {
            errorBox.style.display = "none";
        }, 5000);
    }

    document.querySelector(".execute-button").addEventListener("click", function () {
        runCode();
    });

    document.querySelector(".help-button").addEventListener("click", function () {
        document.querySelector("#help-dialog").showModal();
    });

    document.querySelector("#help-dialog-close-button").addEventListener("click", function () {
        document.querySelector("#help-dialog").close();
    });

    document.querySelector(".challenges-button").addEventListener("click", function () {
        document.querySelector("#challenges-dialog").showModal();
    });

    document.querySelector("#challenges-dialog-close-button").addEventListener("click", function () {
        document.querySelector("#challenges-dialog").close();
    });
});
