import * as fft_image from './libs/fft_image';

function fourier() {}

fourier.prototype.getPreview = function(){
    return this._preview;
}

fourier.prototype.set = function(preview){
    this._preview = preview;
}

fourier.prototype.transformFFT = function() {
    preview = wave.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(wave.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    let data = fft_image.FFTImageDataRGBA(imgData.data, preview.width, preview.height)
    console.log(data)

    ctxt.putImageData(imgData,0,0)
}

var fourier = new fourier();