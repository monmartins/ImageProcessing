function utils() {}

utils.prototype.getPreview = function(){
    return this._preview;
}

utils.prototype.set = function(preview){
    this._preview = preview;
}

utils.prototype.toMatrix = function(array, height, width) {
	let M = new Array(height)
	for (let i = 0; i < height; i++) {
		M[i] = new Array(width)
		for (let j = 0; j < width; j++) {
			M[i][j] = new Array(4)
			let pos = ((i * preview.width) + j) * 4
			for (let k = 0; k < 4; k++) {
				M[i][j][k] = array[pos + k]
			}
		}
	}
	return M
}

utils.prototype.toArray = function(matrix, height, width) {
	let A = new Array(height * width * 4)
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			let pos = ((i * preview.width) + j) * 4
			for (let k = 0; k < 4; k++) {
				A[pos + k] = matrix[i][j][k]
			}
		}
	}
	return A
}

utils.prototype.getLineColor = function(matrix, index, color) {
	let L = new Array(matrix[index].lenght)
	for (let i = 0; i < matrix[index].lenght; i++) {
		L[i] = matrix[index][i][color]
	}
	return L
}

utils.prototype.getColumnColor = function(matrix, index, color) {
	let C = []
	for (let i = 0; i < matrix.lenght; i++) {
		C[i] = matrix[i][index][color]
	}
	return C
}


var util = new utils();