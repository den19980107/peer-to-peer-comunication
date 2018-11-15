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
    var d;
    var worldRecord = 500;
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
                worldRecord = d;
                worldpos.x = x;
                worldpos.y = y;
            }

        }
    }
    console.log(worldRecord);

    updatePixels();
    fill(255);
    ellipse(worldpos.x, worldpos.y, 10, 10);
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