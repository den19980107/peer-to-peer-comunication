var capture;
var w = 640;
var h = 480;

function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.hide();
    capture.size(w, h);
    canvas = createCanvas(w, h);
    console.log(capture);

}

function draw() {

    image(capture, 0, 0);

}