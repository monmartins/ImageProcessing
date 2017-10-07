function reduction() {}

reduction.prototype.getPreview = function(){
    return this._preview;
}

reduction.prototype.set = function(preview){
    this._preview = preview;
}

reduction.prototype.imageReduction = function(mean=false) {
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(reduct.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    var new_imgData = ctxt.createImageData(Math.floor(preview.width/2), Math.floor(preview.height/2));

    if (mean) {
    	var m = [[1,1,1],[1,1,1],[1,1,1]];
    	//var conv = new convolution();
    	var data = conv.applyConv(preview, m, imgData.data, 1/9);
    } else {
    	var data = imgData.data;
    }

    var auxPos = 0;
    for(var i=0; i<preview.height; i+=2) {
        for(var j=0; j<preview.width; j+=2) {
    		var pos = ((i * preview.width) + j) * 4;
    		new_imgData.data[auxPos++] = data[pos];
    		new_imgData.data[auxPos++] = data[pos+1];
    		new_imgData.data[auxPos++] = data[pos+2];
    		new_imgData.data[auxPos++] = data[pos+3];
        }
    }

   
    ctxt.clearRect(0, 0, preview.width, preview.height);
    ctxt.putImageData(new_imgData,0,0);
}


var reduct = new reduction();