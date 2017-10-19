function pass() {}

pass.prototype.getPreview = function(){
    return this._preview;
}

pass.prototype.set = function(preview){
    this._preview = preview;
}

pass.prototype.lowPass = function(){
	conv.meanFilter();
}

pass.prototype.highPass = function(){
	conv.laplacianFilter();
}

pass.prototype.bandPass = function(){
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(reduct.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

	var low = [[1,1,1],[1,1,1],[1,1,1]];
	var aux = conv.applyConv(preview, low, imgData.data, 1/9);

	var hig = [[0,-1,0],[-1,4,-1],[0,-1,0]];
	var aux = conv.applyConv(preview, hig, aux, 1);

	for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = aux[pos];
            imgData.data[pos+1] = aux[pos+1];
            imgData.data[pos+2] = aux[pos+2];
        }
    }
    ctxt.putImageData(imgData,0,0);
}

pass.prototype.bandReject = function(){
	preview = reduct.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(reduct.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

	var low = [[1,1,1],[1,1,1],[1,1,1]];
	var lowconv = conv.applyConv(preview, low, imgData.data, 1/9);

	var hig = [[0,-1,0],[-1,4,-1],[0,-1,0]];
	var higconv = conv.applyConv(preview, hig, imgData.data, 1);

	for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = lowconv[pos] + higconv[pos];
            imgData.data[pos+1] = lowconv[pos+1] + higconv[pos+1];
            imgData.data[pos+2] = lowconv[pos+2] + higconv[pos+2];
        }
    }
    ctxt.putImageData(imgData,0,0);
}

var ps = new pass();