function fourierTransform() { }

fourierTransform.prototype.getPreview = function () {
    return this._preview;
}

fourierTransform.prototype.set = function (preview) {
    this._preview = preview;
}

fourierTransform.prototype.transformFFT = function () {
    var input = document.getElementById("input_photo");
    input.onchange="handleImage(event)";
}

var fourierTransform = new fourierTransform();