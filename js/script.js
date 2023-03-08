const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//Глобальные переменные с значениями по умолчанию 
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    //Установка цвета всего холста на белый. Скачанное изображение будет с белым фоном
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //Возвращение цвета selectedColor
};

window.addEventListener("load", () => {
    //Установка ширины и высоты canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillColor.checked) { //Без заливки
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    // С заливкой
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);    
};

const drawCircle = (e) => {
    ctx.beginPath(); //Новый путь для рисования круга
    //Радиус круга в соответствии с курсором мыши
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //Создание круга
    fillColor.checked ? ctx.fill() : ctx.stroke(); //С заливкой или без
};

const drawTriangle = (e) => {
    ctx.beginPath(); //Новый путь для рисования треугольника
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
    isDrawing = true; 
    prevMouseX = e.offsetX; //Текущая позиция по Х как значение  prevMouseX
    prevMouseY = e.offsetY; //Текущая позиция по Y как значение  prevMouseY
    ctx.beginPath(); //Создание нового пути для рисования
    ctx.lineWidth = brushWidth; //Ширина линии равна brushSize
    ctx.strokeStyle = selectedColor; //Цвет
    ctx.fillStyle = selectedColor; //Цвет заливки
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
    if(!isDrawing) return; // Если isDrawing = false 
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        //Если выбран eraser, то устанавливает белый strokeStyle
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //Cоздание линии в соответствии с указателем мыши
        ctx.stroke();
    } else if(selectedTool === "rectangle") {
        drawRect(e);
    } else if(selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
    
};

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { //Добавление события по клику к каждому инструменту
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;        
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //Передача значения слайдера как значение brushWidth

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //Цвет фона как значение выбранного цвета
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});

colorPicker.addEventListener("change", () => {
    //Выбор цвета для последнего элемента colorBtns
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистить весь холст
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); //Создание нового элемента <a>
    link.download = `${Date.now()}.jpg`; //Текущая дата как название скачанного файла
    link.href = canvas.toDataURL(); //Значение href
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", drawing);

