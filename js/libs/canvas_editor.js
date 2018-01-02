var ce = {};

ce.createCanvas = function (parentId, width, height) {
    let canvasEdit = ce.Canvas()
        .parentId(parentId)
        .width(width)
        .height(height);
        canvasEdit.render();
    return canvasEdit;
}

ce.Canvas = function() {

    let makeGaussian = function(amplitude, x0, y0, sigmaX, sigmaY) {
        return function(amplitude, x0, y0, sigmaX, sigmaY, x, y) {
            var exponent = -(
                    ( Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)))
                    + ( Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)))
                );
            return amplitude * Math.pow(Math.E, exponent);
        }.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
    }

    let self = {
        _id: undefined,
        _parentId: undefined,
        _imgData: undefined,
        _brushRadius: 10,
        _brushX: -1,
        _brushY: -1,
        _gaussian: makeGaussian(10, 0, 0, 5, 5),
        _isPainting: false,
    };

    // Container
    self._container = document.createElement('div');
    self._container.style.position = 'relative';
    self._container.style.border = 'solid 2px'

    // Image canvas
    self._canvas = document.createElement('canvas');
    self._canvas.style.position = 'absolute';

    // Auxiliar canvas (brush)
    self._auxCanvas = document.createElement('canvas');
    self._auxCanvas.style.position = 'absolute';
    self._auxCanvas.style.zIndex = 10;

    // Contexts
    self._ctx = self._canvas.getContext('2d');
    self._auxCtx = self._auxCanvas.getContext('2d');

    self.loadImage = function(imgUrl) {
        let img = new Image();
        img.src = imgUrl;
        img.onload = function() {
            self._ctx.drawImage(img, 0, 0, self._canvas.width, self._canvas.height);
            self._imgData = self._ctx.getImageData(0, 0, self._canvas.width, self._canvas.height);
        }
        return self;
    }

    self.getImageData = function() {
        return self._imgData;
    }

    self.setImageData = function(imgData,width,height) {
        self._imgData = imgData;
        self._ctx.putImageData(imgData, 0, 0, 0, 0,width,height /*self._canvas.width, self._canvas.height*/);
    }

    self.id = function(id) {
        self._id = id;
        return self;
    }

    self.parentId = function(id) {
        self._parentId = id;
        return self;
    }

    self.width = function(value) {
        self._container.style.width = value + 'px';
        self._canvas.width = value;
        self._auxCanvas.width = value;
        return self;
    }

    self.height = function(value) {
        self._container.style.height = value + 'px';
        self._canvas.height = value;
        self._auxCanvas.height = value;
        return self;
    }

    let checkRequirements = function() {
        if (self._parentId === undefined)
            throw 'Cannot render canvas without setting parent id. Use "canvas.parentId(id)"';
    }

    self.render = function() {
        checkRequirements();
        let div = document.getElementById(self._parentId);
        div.appendChild(self._container);
        self._container.appendChild(self._canvas);
        self._container.appendChild(self._auxCanvas);
    }

    // Canvas events

    let updateBrush = function() {
        self._auxCtx.clearRect(0, 0, self._auxCanvas.width, self._auxCanvas.height);
        if (self._brushX >= 0 && self._brushY >= 0) {
            self._auxCtx.strokeStyle = '#000';
            self._auxCtx.beginPath();
            self._auxCtx.arc(self._brushX, self._brushY, self._brushRadius, 0, 2*Math.PI);
            self._auxCtx.stroke();
            self._auxCtx.strokeStyle = '#FFF';
            self._auxCtx.beginPath();
            self._auxCtx.arc(self._brushX, self._brushY, self._brushRadius+1, 0, 2*Math.PI);
            self._auxCtx.stroke();
        }
    }

    self._auxCanvas.onmousemove = (e) => {
        self._brushX = e.offsetX;
        self._brushY = e.offsetY;
        updateBrush();
    }

    self._auxCanvas.onmouseout = (e) => {
        self._brushX = -1;
        self._brushY = -1;
        self._isPainting = false;
        updateBrush();
    }

    document.onkeydown = (e) => {
        if (e.key === '=' || e.key === '-') {
            if (e.key === '=') self._brushRadius = Math.min(20, self._brushRadius + 1);
            else self._brushRadius = Math.max(5, self._brushRadius - 1);
            self._gaussian = makeGaussian(self._brushRadius, 0, 0, self._brushRadius/2, self._brushRadius/2);
            updateBrush();
        }
    }

    self._auxCanvas.oncontextmenu = (e => false);

    let xyToPixel = function(x, y) {
        return (x*self._canvas.width + y)*4;
    }

    let pixelToXY = function(pixel) {
        return {x: parseInt((pixel/4)/self._canvas.width), y: (pixel/4)%self._canvas.width};
    }

    let paint = function(darken) {
        let pixels = self._imgData.data;
        for (let i = -self._brushRadius; i < self._brushRadius; i++) {
            for (let j = -self._brushRadius; j < self._brushRadius; j++) {
                // within brush
                if (i*i + j*j <= self._brushRadius*self._brushRadius) {
                    let absI = self._brushY + i;
                    let absJ = self._brushX + j;
                    // within canvas
                    if (absI >= 0 && absJ >= 0 && absI < self._canvas.width && absJ < self._canvas.height) {
                        let index = xyToPixel(absI, absJ);
                        let paintFactor = darken ? -self._gaussian(i, j) : self._gaussian(i, j);
                        pixels[ index ] = Math.max(0, Math.min(255, pixels[ index ] + paintFactor));
                        pixels[index+1] = Math.max(0, Math.min(255, pixels[index+1] + paintFactor));
                        pixels[index+2] = Math.max(0, Math.min(255, pixels[index+2] + paintFactor));
                    }
                }
            }
        }
        self.setImageData(self._imgData);
        if (self._isPainting) setTimeout(() => paint(darken), 16);
    }

    self._auxCanvas.onmousedown = (e) => {
        self._isPainting = true;
        if (e.which === 3 || e.button === 2) {
            paint(false);
        } else {
            paint(true);
        }
    }

    self._auxCanvas.onmouseup = (e) => {
        self._isPainting = false;
    }

    // -----------------

    return self;
}