function reduction() {}

reduction.prototype.getPreview = function(){
    return this._preview;
}

reduction.prototype.set = function(preview){
    this._preview = preview;
}

reduction.prototype.imageReductionCommon = function() {
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    var new_imgData = ctxt.createImageData(Math.floor((preview.width+1)/2), Math.floor((preview.height+1)/2));
    var auxData = reduct.imageReduction(preview, imgData.data);

    for(var i=0; new_imgData.data.length; i+=4) {
    	new_imgData.data[i] = auxData[i]
    	new_imgData.data[i+1] = auxData[i+1]
    	new_imgData.data[i+2] = auxData[i+2]
    	new_imgData.data[i+3] = auxData[i+3]
    }

    console.log(new_imgData.data)
    ctxt.clearRect(0, 0, preview.width, preview.height);
    ctxt.putImageData(new_imgData,0,0);
}

reduction.prototype.imageReductionMean = function() {
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


}

reduction.prototype.imageReduction = function(preview, data, mean=false) {

    var erase = true;
    var auxData = new Array(Math.floor(data.length/2));

    if (mean) {
    	var m = [[1,1,1],[1,1,1],[1,1,1]];
    	var conv = new convolution();
    	var data = conv.applyConv(preview, m, data.slice(), 1/9);
    }

    //pegando metade dos pixels de forma entrelaçada.
    for(var i=0; i<preview.height; i++) {
    	if (i%2 == 0)
    		erase = true
    	else
    		erase = false
        for(var j=0; j<preview.width; j++) {
        	if (erase) {
        		var pos = ((i * preview.width) + j) * 4;
        		var auxPos = Math.floor((pos+1)/2);
        		auxData[auxPos] = data[pos];
        		auxData[auxPos+1] = data[pos+1];
        		auxData[auxPos+2] = data[pos+2];
        		auxData[auxPos+3] = data[pos+3];
        		erase = false;
        	} else {
        		erase = true;
        	}
        }
    }
    return auxData;
}

var reduct = new reduction();