function fourierTransform() { }

fourierTransform.prototype.getPreview = function () {
    return this._preview;
}

fourierTransform.prototype.set = function (preview) {
    this._preview = preview;
}

fourierTransform.prototype.transformFFT = function () {
    preview = wave.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(wave.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    r = []
    g = []
    b = []
    for(let i=0; i<imgData.data.length/4; i++) {
        r[i] = imgData.data[4*i]
        g[i] = imgData.data[4*i+1]
        b[i] = imgData.data[4*i+2]
    }
    out_r = []
    out_g = []
    out_b = []
    Fourier.transform(r, out_r)
    Fourier.transform(g, out_g)
    Fourier.transform(b, out_b)

    //console.log(out)
    for(let i=0; i<imgData.data.length/4; i++) {
        imgData.data[4*i] = out_r[i].real
        imgData.data[4*i+1] = out_g[i].real
        imgData.data[4*i+2] = out_b[i].real
    }

    ctxt.putImageData(imgData, 0, 0)
}

var fourierTransform = new fourierTransform();