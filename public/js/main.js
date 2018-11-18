var socket = io();
var closeBtn = document.getElementById('closeVideo');
var closeVideo = false;
var targetColor = {
    r: 0,
    g: 0,
    b: 0
};

closeBtn.onclick = function () {
    closeVideo = !closeVideo;
}


function setup() {
    createCanvas(320, 240);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(320, 240)
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
        var worldRecord = 50;

        for (let y = 0; y < video.height; y++) {
            for (let x = 0; x < video.width; x++) {
                var index = (video.width - x + 1 + y * video.width) * 4;
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

        var data = [];
        for (var i in blobs) {

            blobs[i].show();
            pos = {
                minx: blobs[i].minx,
                miny: blobs[i].miny,
                maxx: blobs[i].maxx,
                maxy: blobs[i].maxy
            }
            data.push(pos);
        }
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


}

// var trackColor = {
//     r: 0,
//     g: 0,
//     b: 0,
//     a: 0
// }





socket.on("position", function (data) {
    background(0);
    for (let i = 0; i < data.length; i++) {
        stroke(0);
        fill(255);
        strokeWeight(2);
        rectMode(CORNERS);
        rect(data[i].minx, data[i].miny, data[i].maxx, data[i].maxy);
    }


})


class Blob {
    constructor(x, y) {
        this.minx = x;
        this.miny = y;
        this.maxx = x;
        this.maxy = y;
    }
    isNear(x, y) {
        var cx = (this.minx + this.maxx) / 2;
        var cy = (this.miny + this.maxy) / 2;
        var d = dist(cx, cy, x, y);
        if (d < 10) {
            return true;
        } else {
            return false;
        }
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