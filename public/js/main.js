// var socket = io();
// var video;

var targetColor = {
    r: 0,
    g: 0,
    b: 0
};


function setup() {
    createCanvas(320, 240);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.size(320, 240)
    video.hide();

}

function draw() {
    background(51);
    video.loadPixels();
    loadPixels();

    var blobs = [];


    var d;
    var worldRecord = 20;
    var worldpos = {
        x: 0,
        y: 0
    }
    for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
            var index = (x + y * video.width) * 4;
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
    // fill(255);
    // ellipse(worldpos.x, worldpos.y, 10, 10);
    for (var i in blobs) {
        blobs[i].show();
    }


}

function mouseClicked() {
    var index = (mouseX + mouseY * video.width) * 4;
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







// setInterval(function () {
//     viewVideo(capture);
// }, 70);

// socket.on("video", function (video) {
//     // console.log('get');
//     //image(video, 640, 0);
//     // console.log(video);
// })


// socket.on("message", function (string) {
//     console.log(string);

// })


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