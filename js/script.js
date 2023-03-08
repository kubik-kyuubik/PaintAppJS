const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
ctx = canvas.getContext("2d");

//Глобальные переменные с значениями по умолчанию 
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;


window.addEventListener("load", () => {
    //Установка ширины и высоты canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;    
});

const drawRect = (e) => {
    if(!fillColor.checked) { //Без заливки
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    // С заливкой
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);    
};

const startDraw = (e) => {
    isDrawing = true; 
    prevMouseX = e.offsetX; //Текущая позиция по Х как значение  prevMouseX
    prevMouseY = e.offsetY; //Текущая позиция по Y как значение  prevMouseY
    ctx.beginPath(); //Создание нового пути для рисования
    ctx.lineWidth = brushWidth; //Ширина линии равна brushSize
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
    if(!isDrawing) return; // Если isDrawing = false 
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY); //Cоздание линии в соответствии с указателем мыши
        ctx.stroke();
    } else if(selectedTool === "rectangle") {
        drawRect(e);
    }
    
};

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //Добавление события по клику к каждому инструменту
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(btn.id);
    });
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", drawing);

