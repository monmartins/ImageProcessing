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
	preview = wave.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(wave.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    if (Math.pow(2,level) > preview.width) {
    	console.log("Erro: muitos niveis")
    } else {
    	let haar_matrix = util.toMatrix(imgData.data, preview.height, preview.width)
    	console.log(haar_matrix)
    	for (let i = 0; i < level; i++) {
    		let dim = preview.height / Math.pow(2, i)
    		let tM = wave.haarLevelTrans(haar_matrix, dim)
    		for (let x = 0; x< dim; x++) {
    			for (let y = 0; y < dim; y++) {
    				for (let k = 0; k < 3; k++) {
    					haar_matrix[x][y][k] = tM[x][y][k]
    				}
    			}
    		}
    	}
    	//console.log(haar_matrix)
    	let A = util.toArray(haar_matrix, preview.height, preview.width)
    	for (let i = 0; i < A.length; i++) {
    		imgData.data[i] = A[i]
    	}
    	ctxt.putImageData(imgData,0,0);
    }
}

haar.prototype.haarLevelTrans = function(haar_matrix, dim) {
	let hM = Array.from(haar_matrix)
	/*-- para cada linha --*/
	for (let i = 0; i < dim; i++) {
		let lineR = wave.transform(util.getLineColor(hM, i, 0)) 
		let lineG = wave.transform(util.getLineColor(hM, i, 1))
		let lineB = wave.transform(util.getLineColor(hM, i, 2))
		for (let j = 0; j < dim; j++) {
			hM[i][j][0] = lineR[j]
			hM[i][j][1] = lineG[j]
			hM[i][j][2] = lineB[j]
		}
	}

	/*-- para cada coluna --*/
	for (let i = 0; i < dim; i++) {
		let colR = wave.transform(util.getColumnColor(hM, i, 0))
		let colG = wave.transform(util.getColumnColor(hM, i, 1))
		let colB = wave.transform(util.getColumnColor(hM, i, 2))
		for (let j = 0; j < dim; j++) {
			hM[j][i][0] = colR[j]
			hM[j][i][1] = colG[j]
			hM[j][i][2] = colB[j]
		}
	}

	return hM
}

var wave = new haar();