function histogram(){
}
histogram.prototype.getPreview = function(){
    return this._preview;
}
histogram.prototype.set = function(preview){
    this._preview = preview;
}

histogram.prototype.makeHistogram = function (imgData, div){
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
    Plotly.newPlot(div, data, layout);
}


histogram.prototype.histogram = function (){
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    hist.makeHistogram(imgData, "histogramDiv");    
}

histogram.prototype.calculateMin = function(min, cdf) {
    for (var i = 1; i < cdf.length; i++) {
        if(min == 0 && cdf[i] > 0)
            min = cdf[i];
        cdf[i] = cdf[i] + cdf[i-1];
    }
    return min;
}

histogram.prototype.cumulativeDistribution = function(imgData, cdf) {
    for(var i=0; i<imgData.data.length; i+=4) {
        average = parseInt((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3);
        cdf[average] += 1;
    }
    return hist.calculateMin(cdf[0], cdf);
}

histogram.prototype.cumulativeDistributionRGB = function(imgData, cdfRGB) {
    for(var i=0; i<imgData.data.length; i+=4) {
        cdfRGB[0][imgData.data[i]] += 1;
        cdfRGB[1][imgData.data[i+1]] += 1;
        cdfRGB[2][imgData.data[i+2]] += 1;
    }
    var minR = hist.calculateMin(cdfRGB[0][0], cdfRGB[0]);
    var minG = hist.calculateMin(cdfRGB[1][0], cdfRGB[1]);
    var minB = hist.calculateMin(cdfRGB[2][0], cdfRGB[2]);
    return [minR, minG, minB];
}

histogram.prototype.cumulativeDistributionHSI = function(imgData, cdf) {
    for(var i=0; i<imgData.data.length; i+=4) {
        cdf[parseInt(imgData.data[i+2])] += 1;
    }
    return hist.calculateMin(cdf[0], cdf);
}

histogram.prototype.histogramEqGlobal= function(){
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var cdf = new Array(255).fill(0);
    var min = hist.cumulativeDistribution(imgData, cdf);
    
    for(var i=0; i<imgData.data.length; i+=4) {
        average = parseInt((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3);
        var intensity = (cdf[average] - min) * 255 / ((imgData.data.length / 4) - 1);
        intensity = parseInt(intensity);
        imgData.data[i] = intensity;
        imgData.data[i+1] = intensity;
        imgData.data[i+2] = intensity;
    }
    ctxt.putImageData(imgData,0,0);
    hist.makeHistogram(imgData, "histEquaDiv");
}

histogram.prototype.RGBGlobalEqualization = function() {
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var cdfR = new Array(255).fill(0);
    var cdfG = new Array(255).fill(0);
    var cdfB = new Array(255).fill(0);
    var min = hist.cumulativeDistributionRGB(imgData, [cdfR, cdfG, cdfB])
    for(var i=0; i<imgData.data.length; i+=4) {
        imgData.data[i] = parseInt((cdfR[imgData.data[i]] - min[0]) * 255 / ((imgData.data.length / 4) - 1));
        imgData.data[i+1] = parseInt((cdfG[imgData.data[i+1]] - min[1]) * 255 / ((imgData.data.length / 4) - 1));
        imgData.data[i+2] = parseInt((cdfB[imgData.data[i+2]] - min[2]) * 255 / ((imgData.data.length / 4) - 1));
    }
    ctxt.putImageData(imgData,0,0);
    hist.makeHistogram(imgData, "histEquaDiv");
}

histogram.prototype.HSIGlobalEqualization = function() {
    preview = hist.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(hist.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var HSIimgData = [];
    for (var i = 0; i < imgData.data.length; i+=4) {
        var HSI = col.RGBtoHSI(imgData.data[i], imgData.data[i+1], imgData.data[i+2])
        HSIimgData[i] = HSI[0];
        HSIimgData[i+1] = HSI[1];
        HSIimgData[i+2] = parseInt(HSI[2]*255);
        //console.log("RGB: "+ imgData.data[i]+" "+imgData.data[i+1]+" "+imgData.data[i+2])
        //console.log("HSI: "+ HSIimgData[i]+" "+HSIimgData[i+1]+" "+HSIimgData[i+2])
    }
    var cdf = new Array(255).fill(0);
    var min = hist.cumulativeDistributionHSI(imgData, cdf);
    for(var i=0; i<imgData.data.length; i+=4) {
        HSIimgData[i+2] = parseInt((cdf[parseInt(imgData.data[i+2])] - min) * 255 / ((imgData.data.length / 4) - 1));
    }
    for (var i = 0; i < imgData.data.length; i+=4) {
        var RGB = col.HSItoRGB(HSIimgData[i], HSIimgData[i+1], HSIimgData[i+2])
        imgData.data[i] = RGB[0];
        imgData.data[i+1] = RGB[1];
        imgData.data[i+2] = RGB[2];
    }
    ctxt.putImageData(imgData,0,0);
    hist.makeHistogram(imgData, "histEquaDiv");
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

    for(var x=0; x<preview.height-1; x++) {
        for(var y=0; y<preview.width-1; y++) {
            hist.localEqualization(x,y,intensityMatrix);
            var pos = ((x * preview.width) + y) * 4;
            imgData.data[pos] = intensityMatrix[x][y];
            imgData.data[pos+1] = intensityMatrix[x][y];
            imgData.data[pos+2] = intensityMatrix[x][y];
        }
    }
    ctxt.putImageData(imgData,0,0);
    hist.makeHistogram(imgData, "histLocalEquaDiv")
}


var hist = new histogram();