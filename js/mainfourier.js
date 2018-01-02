var canvasEdit;

window.onload = function() {
	canvasEdit = ce.createCanvas('canvas-div', 530, 813);
}

function handleImage(e) {
	var reader = new FileReader();
	reader.onload = event => canvasEdit.loadImage(event.target.result);
	reader.readAsDataURL(e.target.files[0]);
}

function createComplex(real, imag) {
  return {
    real: real,
    imag: imag
  };
}

function dft(samples, inverse) {
  var len = samples.length;
  var arr = Array(len);
  var pi2 = inverse ? Math.PI * 2 : Math.PI * (-2);
  var invlen = 1 / len;
  for (var i = 0; i < len; i++) {
    arr[i] = createComplex(0, 0);
    for (var n = 0; n < len; n++) {
      var theta = pi2 * i * n * invlen;
      var costheta = Math.cos(theta);
      var sintheta = Math.sin(theta);
      arr[i].real += samples[n].real * costheta - samples[n].imag * sintheta;
      arr[i].imag += samples[n].real * sintheta + samples[n].imag * costheta;
    }
    if (!inverse) {
      arr[i].real *= invlen;
      arr[i].imag *= invlen;
    }
  }
  return arr;
}
