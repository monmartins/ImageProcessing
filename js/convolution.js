function convolution(){
}
convolution.prototype.getPreview = function(){
    return this._preview;
}
convolution.prototype.set = function(preview){
    this._preview = preview;
}

convolution.prototype.convolution55 = function(line1,line2,line3,line4,line5){
    var matrix = [[parseInt(line1.split(',')[0].split('(')[1]),parseInt(line1.split(',')[1]),parseInt(line1.split(',')[2]),parseInt(line1.split(',')[3]),parseInt(line1.split(',')[4].split(')')[0])],
    [parseInt(line2.split(',')[0].split('(')[1]),parseInt(line2.split(',')[1]),parseInt(line2.split(',')[2]),parseInt(line2.split(',')[3]),parseInt(line2.split(',')[4].split(')')[0])],
    [parseInt(line3.split(',')[0].split('(')[1]),parseInt(line3.split(',')[1]),parseInt(line3.split(',')[2]),parseInt(line3.split(',')[3]),parseInt(line3.split(',')[4].split(')')[0])],
    [parseInt(line4.split(',')[0].split('(')[1]),parseInt(line4.split(',')[1]),parseInt(line4.split(',')[2]),parseInt(line4.split(',')[3]),parseInt(line4.split(',')[4].split(')')[0])],
    [parseInt(line5.split(',')[0].split('(')[1]),parseInt(line5.split(',')[1]),parseInt(line5.split(',')[2]),parseInt(line5.split(',')[3]),parseInt(line5.split(',')[4].split(')')[0])]];
    preview = conv.getPreview();
    
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var auxData = new Array(imgData.data.length);
    for(var i=2; i<preview.height-2; i++) {
        for(var j=2; j<preview.width-2; j++) {
            var intensity = 0;
            for(var x=0; x<5; x++) {
                for(var y=0; y<5; y++) {
                    var relativePos = (((i+x-2) * preview.width) + (j+y-2)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = intensity * factor;
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }
    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}

convolution.prototype.convolution33 = function(line1,line2,line3,factor){
    var matrix = [[parseInt(line1.split(',')[0].split('(')[1]),parseInt(line1.split(',')[1]),parseInt(line1.split(',')[2].split(')')[0])],
                [parseInt(line2.split(',')[0].split('(')[1]),parseInt(line2.split(',')[1]),parseInt(line2.split(',')[2].split(')')[0])],
                [parseInt(line3.split(',')[0].split('(')[1]),parseInt(line3.split(',')[1]),parseInt(line3.split(',')[2].split(')')[0])]];

    preview = conv.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    var auxData = new Array(imgData.data.length);
    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var intensity = 0;
            for(var x=0; x<3; x++) {
                for(var y=0; y<3; y++) {
                    var relativePos = (((i+x-1) * preview.width) + (j+y-1)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = intensity * factor;
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}

convolution.prototype.applyConv = function(preview, matrix, data, factor) {
    var auxData = new Array(data.length);
    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var intensity = 0;
            for(var x=0; x<3; x++) {
                for(var y=0; y<3; y++) {
                    var relativePos = (((i+x-1) * preview.width) + (j+y-1)) * 4;
                    var average = parseInt((data[relativePos] + data[relativePos+1] + data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = intensity * factor;
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = data[pos+3];
        }
    }
    return auxData;
}

convolution.prototype.meanFilter = function(){
    conv.convolution33("(1,1,1)","(1,1,1)","(1,1,1)",1/9);
}

convolution.prototype.mediumFilter = function(){
    conv.convolution33("(1,2,1)","(2,4,2)","(1,2,1)",1/16);
}

convolution.prototype.medianFilter = function(){
    preview = conv.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var auxData = new Array(imgData.data.length)

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {

            //conversao de posição no array para posição na matriz
            var pos = ((i * preview.width) + j) * 4;
            
            //criando array de 9 posições para toda vizinhaça do pixel
            var square = new Array(9);

            //preenchendo com os valores dos pixels
            var k=0;
            for(var x=0; x<3; x++) {
                for(var y=0; y<3; y++) {
                    var relativePos = ((i+x-1) * preview.width + (j+y-1)) * 4
                        square[k] = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    k++;
                }
            }

            //ordenar o vetor e selecionar o elemento mediano
            square.sort();
            var mediana = square[4];

            //modificar os valores nos pixels
            auxData[pos] = mediana;
            auxData[pos+1] = mediana;
            auxData[pos+2] = mediana;
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}

convolution.prototype.laplacianFilter = function() {
conv.convolution33("(0,-1,0)","(-1,4,-1)","(0,-1,0)", 1);
}

convolution.prototype.sobelFilter = function() {
    preview = conv.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);

    var matrix1 = [[-1,0,1],[-2,0,2],[-1,0,1]];
    var matrix2 = [[1,2,1],[0,0,0],[-1,-2,-1]];

    var data1 = conv.applyConv(preview, matrix1, imgData.data, 1);
    var data2 = conv.applyConv(preview, matrix2, imgData.data, 1);

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = data1[pos] + data2[pos];
            imgData.data[pos+1] = data1[pos+1] + data2[pos+1];;
            imgData.data[pos+2] = data1[pos+2] + data2[pos+2];;
        }
    }

    ctxt.putImageData(imgData,0,0);

}

convolution.prototype.highBoostFilter = function(constant) {
    if(!constant)
        constant = 1;
    preview = conv.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);

    var matrix = [[1,2,1], [2,4,2], [1,2,1]];
    var auxData = conv.applyConv(preview, matrix, imgData.data, 1/16);

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = ((2 * imgData.data[pos]) - auxData[pos]) * constant;
            imgData.data[pos+1] = ((2 * imgData.data[pos+1]) - auxData[pos+1]) * constant;
            imgData.data[pos+2] = ((2 * imgData.data[pos+2]) - auxData[pos+2]) * constant;

        }
    }

    ctxt.putImageData(imgData,0,0);
}

var conv = new convolution();