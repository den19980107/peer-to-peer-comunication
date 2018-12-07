var socket = io();
var closeBtn = document.getElementById('closeVideo');
var closeVideo = false;
var targetColor = {
    r: 25,
    g: 30,
    b: 101
};

closeBtn.onclick = function () {
    closeVideo = !closeVideo;
}
var w = 667;
var h = 375;
var cx = 0;
var cy = 0;

function setup() {
    createCanvas(w, h);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(w, h)
    video.hide();
    background(0);
}

function draw() {


    if (closeVideo) {
        closeBtn.innerText = "開啟影片";


    } else {
        closeBtn.innerText = "關閉影片";
        video.loadPixels();
        loadPixels();
        var blobs = [];


        var d;
        var worldRecord = 15;

        for (let y = 0; y < video.height; y++) {
            for (let x = 0; x < video.width; x++) {
                var index = (x + (y * video.width)) * 4;
                var r = video.pixels[index + 0];
                var g = video.pixels[index + 1];
                var b = video.pixels[index + 2];
                var a = video.pixels[index + 3];
                pixels[index + 0] = r;
                pixels[index + 1] = g;
                pixels[index + 2] = b;
                pixels[index + 3] = a;
                d = Math.sqrt((r - targetColor.r) * (r - targetColor.r) + (g - targetColor.g) * (g - targetColor.g) + (b - targetColor.b) * (b - targetColor.b));
                if (d < worldRecord) {

                    var found = false;
                    for (var i in blobs) {

                        if (blobs[i].isNear(x, y)) {
                            blobs[i].add(x, y);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        var b = new Blob(x, y);
                        blobs.push(b);
                    }

                }

            }
        }


        updatePixels();
        var flag = 0;
        var lowest = new Blob(0, 0);
        var data = [];
        for (var i in blobs) {
            if (blobs[i].area() > 100) {
                //console.log(blobs[i].area());

                blobs[i].show();
            } else {
                blobs.pop(blobs[i]);

            }
        }
        for (var i in blobs) {

            if (blobs[i].maxy > flag) {
                flag = blobs[i].maxy;
                lowest = blobs[i];
            }
            pos = {
                minx: blobs[i].minx,
                miny: blobs[i].miny,
                maxx: blobs[i].maxx,
                maxy: blobs[i].maxy
            }
            data.push(pos);
        }
        lowest.showmin();
        socket.emit("position", data);

    }



}

function mouseClicked() {
    var index = (parseInt(mouseX) + parseInt(mouseY) * video.width) * 4;

    targetColor = {
        r: pixels[index + 0],
        g: pixels[index + 1],
        b: pixels[index + 2]
    }
    console.log(targetColor);
    console.log(mouseY);



}

// var trackColor = {
//     r: 0,
//     g: 0,
//     b: 0,
//     a: 0
// }



var drawbtn = document.getElementById('draw');
var canDraw = false;
drawbtn.onclick = function () {
    canDraw = !canDraw;
}
socket.on("position", function (data) {
    if (canDraw) {

    } else {
        background(0);
    }


    var flag = 0;
    var lowest = new Blob(0, 0);
    for (let i = 0; i < data.length; i++) {
        if (data[i].maxy > flag) {
            flag = data[i].maxy;
            lowest.maxy = data[i].maxy;
            lowest.maxx = data[i].maxx;
            lowest.miny = data[i].miny;
            lowest.minx = data[i].minx;
        }
        // stroke(0);
        // fill(255);
        // strokeWeight(2);
        // rectMode(CORNERS);
        // rect(data[i].minx, data[i].miny, data[i].maxx, data[i].maxy);

    }


    lowest.showmin();
})


class Blob {
    constructor(x, y) {
        this.minx = x;
        this.miny = y;
        this.maxx = x;
        this.maxy = y;
    }
    isNear(x, y) {
        var cx = this.max(this.min(x, this.maxx), this.minx);
        var cy = this.max(this.min(y, this.maxy), this.miny);

        // var cx = (this.minx + this.maxx) / 2;
        // var cy = (this.miny + this.maxy) / 2;
        var d = dist(cx, cy, x, y);
        if (d < 20) {
            return true;
        } else {
            return false;
        }
    }
    area() {
        return (this.maxx - this.minx) * (this.maxy - this.miny);
    }
    add(x, y) {
        this.minx = min(this.minx, x);
        this.miny = min(this.miny, y);
        this.maxx = max(this.maxx, x);
        this.maxy = max(this.maxy, y);

    }

    show() {
        stroke(0);
        fill(255);
        strokeWeight(2);
        rectMode(CORNERS);
        rect(this.minx, this.miny, this.maxx, this.maxy);
    }
    showmin() {
        noStroke();
        fill(255, 0, 0);

        var newX = (this.minx + this.maxx) / 2;
        var newY = (this.maxy - 20);
        //smooth the path
        cx = lerp(cx, newX, 0.3);
        cy = lerp(cy, newY, 0.3);
        console.log(newX);
        console.log(newY);
        ellipse(w - cx, h - cy, 10, 10);
    }


    min(a, b) {
        if (a < b) {
            return a;
        } else {
            return b;
        }
    }
    max(a, b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }
}