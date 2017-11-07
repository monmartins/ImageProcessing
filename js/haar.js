function haar() {}

haar.prototype.getPreview = function(){
    return this._preview;
}

haar.prototype.set = function(preview){
    this._preview = preview;
}

haar.prototype.transform = function(v){
	let result = [];
	for (var i = 0; i < v.length/2; i++) {
		result[i] = (v[i*2] + v[(i*2)+1]) / 2;
		result[i+(v.length/2)] = v[i*2] - result[i];
	}
	return result;
}

haar.prototype.back = function(v){
	let result = [];
	for (var i = 0; i < v.length/2; i++) {
		result[i*2] = v[i] + v[i+(v.length/2)];
		result[(i*2)+1] = v[i] - v[i+(v.length/2)];
	}
	return result;
}

haar.prototype.haarTrans = function(level) {
	preview = haar.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(haar.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    if (Math.pow(2,level) > preview.width) {
    	console.log("Erro: muitos niveis")
    } else {
    	let M = util.toMatrix(imgData, preview.height, preview.width)
    	for (let i = 0; i < level; i++) {
    		let dim = Math.pow(2, preview.height - i)
    	}
    }
}

haar.prototype.haarLevelTrans = function(matrix, dim) {
	/*-- para cada linha --*/
	for (let i = 0; i < dim; i++) {
		let lineR = wave.transform(util.getLineColor(matrix, i, 0)) 
		let lineG = wave.transform(util.getLineColor(matrix, i, 1))
		let lineB = wave.transform(util.getLineColor(matrix, i, 2))
		for (let j = 0; j < dim; j++) {
			matrix[i][j][0] = lineR[j]
			matrix[i][j][1] = lineG[j]
			matrix[i][j][2] = lineB[j]
		}
	}

	/*-- para cada coluna --*/
	for (let i = 0; i < dim; i++) {
		let colR = wave.transform(util.getColumnColor(matrix, i, 0))
		let colG = wave.transform(util.getColumnColor(matrix, i, 1))
		let colB = wave.transform(util.getColumnColor(matrix, i, 2))
		for (let j = 0; j < dim; j++) {
			matrix[j][i][0] = lineR[j]
			matrix[j][i][1] = lineG[j]
			matrix[j][i][2] = lineB[j]
		}
	}

	return matrix
}

var wave = new haar();