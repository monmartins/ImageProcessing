function utils() {}

utils.prototype.getPreview = function(){
    return this._preview;
}

utils.prototype.set = function(preview){
    this._preview = preview;
}

utils.prototype.toMatrix = function(array, height, width) {
	let haar_matrix = new Array(height)
	for (let i = 0; i < height; i++) {
		haar_matrix[i] = new Array(width)
		for (let j = 0; j < width; j++) {
			haar_matrix[i][j] = new Array(4)
			let pos = ((i * width) + j) * 4
			for (let k = 0; k < 4; k++) {
				haar_matrix[i][j][k] = array[pos + k]
			}
		}
	}
	return haar_matrix
}

utils.prototype.toArray = function(haar_matrix, height, width) {
	let A = new Array(height * width * 4)
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			let pos = ((i * width) + j) * 4
			for (let k = 0; k < 4; k++) {
				A[pos + k] = haar_matrix[i][j][k]
			}
		}
	}
	return A
}

utils.prototype.getLineColor = function(haar_matrix, index, color, dim) {
	let L = []
	for (let i = 0; i < dim; i++) {
		L[i] = haar_matrix[index][i][color]
	}
	return L
}

utils.prototype.getColumnColor = function(haar_matrix, index, color, dim) {
	let C = []
	for (let i = 0; i < dim; i++) {
		C[i] = haar_matrix[i][index][color]
	}
	return C
}


var util = new utils();