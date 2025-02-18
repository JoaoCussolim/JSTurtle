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

    function runCode() {
        const code = textarea.value.trim();

        try {
            const userFunction = new Function("ctx", "canvas", `
                function drawCircle(x, y, size, color) {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                function drawSquare(x, y, size, color){
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, size, size);
                }

                function clear() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                ${code} // Executa o código do usuário
            `);

            userFunction(ctx, canvas);
        } catch (error) {
            console.error("Erro ao executar código:", error);
        }
    }

    document.querySelector(".execute-button").addEventListener("click", function () {
        runCode();
    });
    
    document.querySelector(".help-button").addEventListener("click", function () {
        document.querySelector("#help-dialog").showModal()
    });

    document.querySelector("#help-dialog-close-button").addEventListener("click", function () {
        document.querySelector("#help-dialog").close()
    })

    document.querySelector(".challenges-button").addEventListener("click", function () {
        document.querySelector("#challenges-dialog").showModal()
    });

    document.querySelector("#challenges-dialog-close-button").addEventListener("click", function () {
        document.querySelector("#challenges-dialog").close()
    })
});