function reduction() {}

reduction.prototype.getPreview = function(){
    return this._preview;
}

reduction.prototype.set = function(preview){
    this._preview = preview;
}

reduction.prototype.imageReduction = function(tax, mean=false) {
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(reduct.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    var new_imgData = ctxt.createImageData(Math.floor(preview.width/tax), Math.floor(preview.height/tax));
    //var new_imgData = ctxt.createImageData(preview.width, preview.height);

    if (mean) {
    	var m = [[1,1,1],[1,1,1],[1,1,1]];
    	var data = conv.applyConv(preview, m, imgData.data, 1/9);
    } else {
    	var data = imgData.data;
    }

    var auxPos = 0;
    for(var i=0; i<preview.height; i+=tax) {
        for(var j=0; j<preview.width; j+=tax) {
    		var pos = ((i * preview.width) + j) * 4;
    		var intensity = data[pos];
    		for(k=0; k<3; k++)
    			new_imgData.data[auxPos++] = intensity;
    		new_imgData.data[auxPos++] = data[pos+3];
        }
    }

    /*for(var i=0; i<preview.height; i+=2) {
        for(var j=0; j<preview.width; j+=2) {
    		var pos = ((i * preview.width) + j) * 4;
    		intensity = data[pos];
    		for(k=0; k<4; k++)
    			new_imgData.data[pos+k] = data[pos+k];
    		if(i<preview.height-1){
    			pos = (((i+1) * preview.width) + j) * 4;
    			for(k=0; k<4; k++)
    				new_imgData.data[pos+k] = data[pos+k];
    		}
    		if(j<preview.width-1){
    			pos = ((i * preview.width) + (j+1)) * 4;
    			for(k=0; k<4; k++)
    				new_imgData.data[pos+k] = data[pos+k];
    		}
    		if(i<preview.height-1 && j<preview.width-1){
    			pos = (((i+1) * preview.width) + (j+1)) * 4;
    			for(k=0; k<4; k++)
    				new_imgData.data[pos+k] = data[pos+k];
    		}
        }
    }*/
  
    ctxt.clearRect(0, 0, preview.width, preview.height);
    ctxt.putImageData(new_imgData,0,0);
}


var reduct = new reduction();