const chart = document.querySelector("#chart");
const canvas = document.createElement("canvas");

canvas.height = 120;
canvas.width = 120;

chart.appendChild(canvas);

const context2d = canvas.getContext("2d");
context2d.lineWidth = 10;

const radius = 50;

function drawCircle(color, ratio, anticlockwise){
    context2d.strokeStyle = color;
    context2d.beginPath();
    context2d.arc(60, 60, radius, 0, ratio*Math.PI*2, anticlockwise);
    context2d.stroke();
}

function updateChart(income, outcome){
    context2d.clearRect(0, 0, canvas.width, canvas.height);
    let ratio = (income) / (income + outcome);
    drawCircle("lawngreen", -ratio, true);
    drawCircle("tomato", 1 - ratio, false);}