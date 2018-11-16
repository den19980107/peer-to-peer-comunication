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
        if (d < 25) {
            return true;
        } else {
            return false;
        }
    }

    add(x, y) {
        minx = min(this.minx, x);
        miny = min(this.miny, y);
        maxx = max(this.maxx, x);
        maxy = max(this.maxy, y);

    }

    show() {
        stroke(0);
        fill(255);
        strokeWeight(2);
        rectMode(CORNERS);
        rect(this.minx, this.miny, this.maxx, this.maxy);
    }
}