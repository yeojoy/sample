// by Chtiwi Malek ===> CODICODE.COM
// change function names

var mousePressed = false;
var lastX, lastY;
var context;
var pointObjArray = new Array();
var pointObj = {};

function InitThis() {
    context = document.getElementById('myCanvas').getContext("2d");

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        var x = e.pageX - $(this).offset().left, y = e.pageY - $(this).offset().top;

        // 시작하는 x, y 좌표를 pointObj에 저장
        pointObj.startX = x;
        pointObj.startY = y;

        drawLine(x, y, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        if (mousePressed) {
            mousePressed = false;
            pushPointsToArray();

            var x = e.pageX - $(this).offset().left, y = e.pageY - $(this).offset().top;
            // 종료할 때 x, y 좌표를 pointObj에 저장
            pointObj.endX = x;
            pointObj.endY = y;
            pointObjArray.push(pointObj);
            // obj 초기화
            pointObj = {};
            console.log(pointObjArray);
        }
    });

    $('#myCanvas').mouseleave(function (e) {
        if (mousePressed) {
            mousePressed = false;
            pushPointsToArray();
        }
    });
    drawImage();
}

function drawImage() {
    var image = new Image();
    image.src = 'images/myimg.jpg';
    $(image).load(function () {
        context.drawImage(image, 0, 0, 1000, 600);
        pushPointsToArray();
    });    
}

function drawLine(x, y, isDown) {
    if (isDown) {
        context.beginPath();
        context.strokeStyle = $('#selColor').val();
        context.lineWidth = $('#selWidth').val();
        context.lineJoin = "round";
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.closePath();
        context.stroke();
    }

    lastX = x;
    lastY = y;
}

var lineArray = new Array();
var stageCount = -1;

function pushPointsToArray() {
    stageCount++;
    // 다시 그릴 때 초기화 하는 코드
    // if (stageCount < lineArray.length) { 
    //     lineArray.length = stageCount;
    //     pointObjArray.length = stageCount;
    // }
    var dataUrl = document.getElementById('myCanvas').toDataURL();
    lineArray.push(dataUrl);
    document.title = stageCount + ":" + lineArray.length;
}

function undoDrawLine() {
    if (stageCount > 0) {
        stageCount--;
        var canvasPic = new Image();
        canvasPic.src = lineArray[stageCount];
        canvasPic.onload = function () { context.drawImage(canvasPic, 0, 0); }
        document.title = stageCount + ":" + lineArray.length;
    }
}

function redoDrawLine() {
    if (stageCount < lineArray.length-1) {
        stageCount++;
        var canvasPic = new Image();
        canvasPic.src = lineArray[stageCount];
        canvasPic.onload = function () { context.drawImage(canvasPic, 0, 0); }
        document.title = stageCount + ":" + lineArray.length;
    }
}