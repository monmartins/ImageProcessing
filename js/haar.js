function haar() {}

haar.prototype.getPreview = function(){
    return this._preview;
}

haar.prototype.set = function(preview){
    this._preview = preview;
}

haar.prototype.setHaar = function(haar_matrix){
    this.haar_matrix = haar_matrix;
}

haar.prototype.getHaar = function(){
    return this.haar_matrix;
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
    	for(let i=0; i<level; i++) {
    		let dim = preview.height/Math.pow(2,i)
    		let tr_matrix = wave.haarLevelTrans(haar_matrix, dim)
    		for(let x=0; x<dim; x++) {
    			for(let y=0; y<dim; y++) {
    				for(let k=0; k<3; k++) {
    					haar_matrix[x][y][k] = tr_matrix[x][y][k]
    				}
    			}
    		}
    	}
		this.setHaar(haar_matrix);
    	let A = util.toArray(haar_matrix, preview.height, preview.width)
    	for (let i = 0; i < A.length; i++) {
    		imgData.data[i] = A[i]
		}
		ctxt.putImageData(imgData,0,0);
    }
}

haar.prototype.haarLevelTrans = function(haar_matrix, dim) {
	let hM = haar_matrix.slice()
	/*-- para cada linha --*/
	for(let i=0; i<dim; i++) {
		let lineR = wave.transform(util.getLineColor(hM, i, 0, dim))
		let lineG = wave.transform(util.getLineColor(hM, i, 1, dim))
		let lineB = wave.transform(util.getLineColor(hM, i, 2, dim))
		for (let j = 0; j < dim; j++) {
			hM[i][j][0] = lineR[j]
			hM[i][j][1] = lineG[j]
			hM[i][j][2] = lineB[j]
		}
	}

	/*-- para cada coluna --*/
	for (let i = 0; i < dim; i++) {
		let colR = wave.transform(util.getColumnColor(hM, i, 0, dim))
		let colG = wave.transform(util.getColumnColor(hM, i, 1, dim))
		let colB = wave.transform(util.getColumnColor(hM, i, 2, dim))
		for (let j = 0; j < dim; j++) {
			hM[j][i][0] = colR[j]
			hM[j][i][1] = colG[j]
			hM[j][i][2] = colB[j]
		}
	}

	return hM
}

haar.prototype.haarTransBack = function(level, actual){
	actual = actual-1
	preview = wave.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(wave.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

	let haar_matrix = this.getHaar()
	
	for(let i=actual; i>=level; i--) {
		let dim = preview.height/Math.pow(2,i)
		let bk_matrix = wave.haarBackLevel(haar_matrix, dim)
		for(let x=0; x<dim; x++) {
			for(let y=0; y<dim; y++) {
				for(let k=0; k<3; k++) {
					haar_matrix[x][y][k] = bk_matrix[x][y][k]
				}
			}
		}
	}

	let A = util.toArray(haar_matrix, preview.height, preview.width)
	for (let i = 0; i < A.length; i++) {
		imgData.data[i] = A[i]
	}

	ctxt.putImageData(imgData,0,0);
}

haar.prototype.haarBackLevel = function(haar_matrix, dim) {
	let hM = haar_matrix.slice()

	/*-- para cada coluna --*/
	for (let i = 0; i < dim; i++) {
		let colR = wave.back(util.getColumnColor(hM, i, 0, dim))
		let colG = wave.back(util.getColumnColor(hM, i, 1, dim))
		let colB = wave.back(util.getColumnColor(hM, i, 2, dim))
		for (let j = 0; j < dim; j++) {
			hM[j][i][0] = colR[j]
			hM[j][i][1] = colG[j]
			hM[j][i][2] = colB[j]
		}
	}

	/*-- para cada linha --*/
	for(let i=0; i<dim; i++) {
		let lineR = wave.back(util.getLineColor(hM, i, 0, dim))
		let lineG = wave.back(util.getLineColor(hM, i, 1, dim))
		let lineB = wave.back(util.getLineColor(hM, i, 2, dim))
		for (let j = 0; j < dim; j++) {
			hM[i][j][0] = lineR[j]
			hM[i][j][1] = lineG[j]
			hM[i][j][2] = lineB[j]
		}
	}

	return hM;
}

haar.prototype.testHaar = function() {
	let vec = [3, 2, 5, 1]
	console.log(vec)
	for(let i=0; i<2; i++) {
		let dim = vec.length/Math.pow(2, i)
		let tv = []
		for(let j=0; j<dim; j++) {
			tv.push(vec[j])
		}
		
		let result = wave.transform(tv)
		//let b_result = wave.back(result)
		//console.log(result)
		
		for(let j=0; j<dim; j++){
			vec[j] = result[j]
		}
		console.log(vec)
	}

	for(let i=1; i>=0; i--){
		let dim = vec.length/Math.pow(2, i)
		
		let tv = []
		for(let j=0; j<dim; j++) {
			tv.push(vec[j])
		}

		let result = wave.back(tv)

		for(let j=0; j<dim; j++){
			vec[j] = result[j]
		}
		console.log(vec)
	}
	//console.log(vec)
}

var wave = new haar();