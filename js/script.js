const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d");

let isDrawing = false,
brushWidth = 5;

window.addEventListener("load", () => {
    //Установка ширины и высоты canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;    
});

const startDraw = () => {
    isDrawing = true; 
    ctx.beginPath(); //Создание нового пути для рисования
    ctx.lineWidth = brushWidth; //Ширина линии равна brushSize
};

const drawing = (e) => {
    if(!isDrawing) return; // Если isDrawing = false 
    ctx.lineTo(e.offsetX, e.offsetY); //Cоздание линии в соответствии с указателем мыши
    ctx.stroke();
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", drawing);

