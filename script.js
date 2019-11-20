var canvasFront = document.getElementById('front-canvas'),
    canvasBack = document.getElementById('back-canvas'),
    ctxf = canvasFront.getContext('2d'),
    ctxb = canvasBack.getContext('2d');

var canvasWidth = document.getElementById('canvas-width'),
    canvasHeight = document.getElementById('canvas-height');

var canvasPosition;

var mouseX, mouseY,
    mouseXl = document.getElementById('mouseX'),
    mouseYl = document.getElementById('mouseY');

var tools = [], sizes = [];

tools.pencil = document.getElementById('pencil');
tools.eraser = document.getElementById('eraser');

sizes.small = document.getElementById('small');
sizes.middle = document.getElementById('middle');
sizes.big = document.getElementById('big');

var eraserSize = 8;
eraserCursor = "url('eraser.png'), auto";

var canvasClear = document.getElementById('clear-canvas'),
    fileImg = document.getElementById('file-img'),
    properties = document.getElementById('properties'),
    imgWidth = document.getElementById('img-width'),
    imgHeight = document.getElementById('img-height');

var startX = 100, startY = 100;

window.onload = function() {
    canvasPosition = canvasBack.getBoundingClientRect();
}

canvasWidth.onchange = function() {
    canvasFront.width = canvasWidth.value;
    canvasBack.width = canvasWidth.value;
}

canvasHeight.onchange = function() {
    canvasFront.height = canvasHeight.value;
    canvasBack.height = canvasHeight.value;
}

canvasFront.onmousemove = function(e) {
    mouseX = e.clientX = canvasPosition.left;
    mouseY = e.clientY = canvasPosition.top;
    mouseXl.innerHTML = mouseX;
    mouseYl.innerHTML = mouseY;
}
canvasClear.onclick = function() {
    canvasBack.width = canvasBack.width;
    canvasFront.width = canvasFront.width;
}

addAllHAndlers(tools, "tool-active");
addAllHAndlers(sizes, "size-active");

function addAllHAndlers(arr, className) {
    return function() {
        removeAllClasses(arr);
            arr[items].removeAttributes("class");
    }
}

function addHandler(element, arr, className) {
    return function() {
        removeAllClasses(arr);
        element.setAttribute("class", className);
    }
}

function removeAllClasses(arr) {
    for (var item in arr) {
        arr[item].removeAttributes("class");
    }
}

sizes.small.onclick = function() {
    ctxb.lineWidth = 1;
    eraserSize = 8;
    eraserCursor = "url('eraser.png'), auto";
}

sizes.middle.onclick = function() {
    ctxb.lineWidth = 5;
    eraserSize = 16;
    eraserCursor = "url('eraser.png'), auto";
}

sizes.big.onclick = function() {
    ctxb.lineWidth = 15;
    eraserSize = 32;
    eraserCursor = "url('eraser.png'), auto";
}

var processing = false;
var operations = [];

operations['mousedown'] = function() {
    processing = true;
    ctxb.beginPath();
};

operations['mouseup'] = function() {
    processing = false;
};

canvasFront.addEventListener("mousedown", operations["mousedown"]);

canvasFront.addEventListener("mouseup", operations["mouseup"]);

canvasFront.addEventListener("mousemove", operations["mousemove"]);

tools.pencil.onclick = function() {
    canvasFront.style.cursor = "pointer";
    operations['mousemove'] = function() {
        if (processing) {
            ctxb.lineTo(mouseX, mouseY);
            ctxb.stroke();
        };
    };
};

tools.eraser.onclick = function() {
    operations['mousemove'] = function() {
        canvasFront.style.cursor = eraserCursor;
        if (processing) {
            ctxb.clearRect(mouseX, mouseY, eraserSize, eraserSize);
        };
    };
};

color.onchange = function(e) {
    ctxb.strokeStyle = e.srcElement.value;
}

fileImg.onchange = function() {
    var file = fileImg.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var dataUri = event.target.result;
        img = new Image();
    img.onload = function() {
        ctxf.strokeRect(startX, startY, img.width, img.height);
        ctxf.drawImage(img, startX, startY);

            operations['mousemove'] = function() {
                if(processing) {
                    canvasFront.width = canvasFront.width;
                    ctxf.strokeRect(mouseX, mouseY, imgWidth.value, imgHeight.value);
                    ctxf.drawImage(img, mouseX, mouseY, imgWidth.value);
                };
            };

            operations['mouseup'] = function() {
                properties.style.display = 'none';
                canvasFront.width = canvasFront.width;
                processing = False;
                ctxb.drawImage(img, mouseX, mouseY, imgWidth.value, imgHeight.value);
                operations['mousemove'] = undefined;
                operations['mouseup'] = function() {
                    processing = false;
                };
            };
        };

        img.src = dataUri;
        properties.style.display = 'block';
        imgWidth.value = img.width;
        imgHeight.value = img.height;
    };
    reader.readAsDataURL(file);
}

imgWidth.addEventListener("change", changeImgSize);
imgHeight.addEventListener("change", changeImgSize);

function changeImgSize() {
    canvasFront.width = canvasFront.width;
    ctxf.strokeRect(startX, startY, imgWidth.value, imgHeight.value);
    ctxf.drawImage(img, startX, startY, imgWidth.value, imgHeight.value);
}

invert.onclick = function() {
    var imageData = ctxf.getImageData(startX, startY, imgWidth.value, imgHeight.value);
    for (var i = 0; i < imageData.data.lenght; i+=4) {
        for (var j = i; j < i + 3; j++){
            imageData.data[j] = 255 - imageData.data[j];
        }
    }
    ctxf.putImageData(imageData, startX, startY);
};
