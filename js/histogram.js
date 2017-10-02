function histogram(){
}
histogram.prototype.getPreview = function(){
    return this._preview;
}
histogram.prototype.set = function(preview){
    this._preview = preview;
}
histogram.prototype.histogram= function (){
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var r = [];
    var g = [];
    var b = [];
    for(var i=0; i<imgData.data.length; i+=4) {
        r[i] = imgData.data[i];
        g[i] = imgData.data[i+1];
        b[i] = imgData.data[i+2];
    }
    var traceR = {
        x: r,
        type: "histogram",
        name: "red",
        opacity: 0.5,
        marker: {
            color: 'red',
        }
    }
    var traceG = {
        x: g,
        type: "histogram",
        name: "green",
        opacity: 0.5,
        marker: {
            color: 'green',
        }
    }
    var traceB = {
        x: b,
        type: "histogram",
        name: "blue",
        opacity: 0.5,
        marker: {
            color: 'blue',
        }
    }
    var data = [traceR, traceG, traceB];
    var layout = {barmode: "overlay"};
    Plotly.newPlot("histogramDiv", data, layout);

}

histogram.prototype.cumulativeDistribution = function(imgData, cdf) {
    for(var i=0; i<imgData.data.length; i+=4) {
        average = parseInt((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3);
        cdf[average] += 1;
    }
    var min = cdf[0];
    for (var i = 1; i < cdf.length; i++) {
        if(min == 0 && cdf[i] > 0)
            min = cdf[i];
        cdf[i] = cdf[i] + cdf[i-1];
    }
    return min;
}

histogram.prototype.histogramEqGlobal= function(){
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var x = [];
    var cdf = new Array(255).fill(0);
    var min = hist.cumulativeDistribution(imgData, cdf);
    
    for(var i=0; i<imgData.data.length; i+=4) {
        average = parseInt((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3);
        var intensity = (cdf[average] - min) * 255 / ((imgData.data.length / 4) - 1);
        intensity = parseInt(intensity);
        imgData.data[i] = intensity;
        imgData.data[i+1] = intensity;
        imgData.data[i+2] = intensity;
        x[i] = intensity;
    }
    ctxt.putImageData(imgData,0,0);
    var trace = {
        x: x,
        type: "histogram",
        opacity: 0.5,
        marker: {
            color: 'green',
        }
    }
    var data = [trace];
    var layout = {barmode: "overlay"};
    Plotly.newPlot("histEquaDiv", data, layout);
}


histogram.prototype.localEqualization = function(x, y, matrix) {
    var auxMatrix = new Array(3);
    for(var i=0; i<3; i++) {
        auxMatrix[i] = new Array(3);
    }
    var count = new Map();
    for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
            var intensity = 0;
            if(x+i-1>0 && x+i-1<preview.height-1 && y+j-1>0 && y+j-1<preview.width-1)
                intensity = matrix[x+i-1][y+j-1];
            auxMatrix[i][j] = intensity;
            if(count.has(intensity))
                count.set(intensity, count.get(intensity)+1);
            else
                count.set(intensity, 1);
        }
    }

    var keys = Array.from( count.keys() );
    keys.sort();
    var mapDistrib = new Map();
    mapDistrib.set(keys[0], count.get(keys[0]));
    for(var i=1; i<keys.length; i++){
        mapDistrib.set(keys[i], count.get(keys[i])+mapDistrib.get(keys[i-1]));
    }

    var average = auxMatrix[1][1];
    var intensity = (mapDistrib.get(average) - count.get(keys[0])) * 255 / 9;
    matrix[x][y] = parseInt(intensity);
}
histogram.prototype.histogramEqLocal= function(){
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    //matriz com a media de intensidades RGB de cada pixel
    //iniciando a matriz
    var intensityMatrix = new Array(preview.height);
    for(var i=0; i<intensityMatrix.length; i++){
        intensityMatrix[i] = new Array(preview.width);
    }
    //preenchendo com os valores dos pixels
    for(var x=0; x<preview.height; x++) {
        for(var y=0; y<preview.width; y++) {
            var pos = ((x * preview.width) + y) * 4;
            var average = parseInt((imgData.data[pos] + imgData.data[pos+1] + imgData.data[pos+2])/3);
            intensityMatrix[x][y] = average;
        }
    }

    var v = [];
    for(var x=0; x<preview.height-1; x++) {
        for(var y=0; y<preview.width-1; y++) {
            hist.localEqualization(x,y,intensityMatrix);
            var pos = ((x * preview.width) + y) * 4;
            imgData.data[pos] = intensityMatrix[x][y];
            imgData.data[pos+1] = intensityMatrix[x][y];
            imgData.data[pos+2] = intensityMatrix[x][y];
            v[pos] = intensityMatrix[x][y]
        }
    }
    ctxt.putImageData(imgData,0,0);
    var trace = {
        x: v,
        type: "histogram",
        opacity: 0.5,
        marker: {
            color: 'green',
        }
    }
    var data = [trace];
    var layout = {barmode: "overlay"};
    Plotly.newPlot("histLocalEquaDiv", data, layout);
}

var hist = new histogram();