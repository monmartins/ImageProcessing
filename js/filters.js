function photoShop(){
}
photoShop.prototype.getPreview = function(){
    return this._preview;
}
photoShop.prototype.set = function(preview){
    this._preview = preview;
}
photoShop.prototype.blackWhite = function(){
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
     for (var i=0;i<imgData.data.length;i+=4)
      {
        sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]
        average = sum/3;  
        imgData.data[i] = average;
        imgData.data[i+1] = average;
        imgData.data[i+2] = average;
      }
      ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.threshold = function(constant){
    if(!constant){
        //127 é aproximadamente a metade de 255 e será o limite padrão
       constant = 127;
    }
    
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    // dada uma cor, se a intensidade media dela for maior que a constante, então vira preto, caso contrário branco
    for (var i=0;i<imgData.data.length;i+=4)
      {
        sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
        average = sum/3;
        intensity = 0;
        if(average > constant) {
            intensity = 255;
        }
        imgData.data[i] = intensity;
        imgData.data[i+1] = intensity;
        imgData.data[i+2] = intensity;
      }
      ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.negative= function(){
    preview = photo.getPreview();
    // ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4)
      {
      imgData.data[i]=255-imgData.data[i];
      imgData.data[i+1]=255-imgData.data[i+1];
      imgData.data[i+2]=255-imgData.data[i+2];
      }
      ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.logTransformation= function(constant){
    if(!constant){
        //analisando a C*ln(x+1), C=45 permite q C*(255+1) = 255
        constant = 45;
    }
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i] = constant * (Math.log(imgData.data[i] + 1));
        imgData.data[i+1] = constant * (Math.log(imgData.data[i+1] + 1));
        imgData.data[i+2] = constant * (Math.log(imgData.data[i+2] + 1));
    }

    ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.gamma = function (constant,gamma){
    if(!constant){
        constant = 1;
    }
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4)
        {
        imgData.data[i]=constant*(Math.pow(imgData.data[i]/255,gamma))*255;
        imgData.data[i+1]=constant*(Math.pow(imgData.data[i+1]/255,gamma))*255;
        imgData.data[i+2]=constant*(Math.pow(imgData.data[i+2]/255,gamma))*255;
        }

        ctxt.putImageData(imgData,0,0);
    
}
photoShop.prototype.layer= function (layer){
    layer = layer - 1
    layer = 7 - layer
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        var listBin = "";

        listBin = new StringBit(imgData.data[i].toString(2));
        listBin.bitSlicingLayer(layer) 
        num = parseInt(listBin.value,2);
        imgData.data[i]=num;

        listBin = new StringBit(imgData.data[i+1].toString(2));
        listBin.bitSlicingLayer(layer) 
        num = parseInt(listBin.value,2);
        imgData.data[i+1]=num;

        listBin = new StringBit(imgData.data[i+2].toString(2));
        listBin.bitSlicingLayer(layer) 
        num = parseInt(listBin.value,2);
        imgData.data[i+2]=num;       
    }

     ctxt.putImageData(imgData,0,0);
    
}
photoShop.prototype.piecewise= function (points){
    if(points){
        if(points.length>=10){
            //(a,b),(c,d)
            var a = parseInt(points.split(',')[0].split('(')[1],10);
            var b =  parseInt(points.split(',')[1].split(')')[0],10);
            var c =  parseInt(points.split(',')[2].split('(')[1],10);
            var d =  parseInt(points.split(',')[3].split(')')[0],10);
            if( a >= 0 && a <= 255 && b >= 0 && b <= 255 && c >= 0 && c <= 255 && d >= 0 && d <= 255 && a <= c){
                preview = photo.getPreview();
                ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
                var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
                 for (var i=0;i<imgData.data.length;i+=4){
                    sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
                    average = sum/3;
                    
                    intensity = 0;
                    if(average <= a) {

                        //dois pontos: (0,0) e (a,b)
                        //m é o coeficiente angular
                        m = (0 - b)/(0 - a);
                        //equação da reta y - y1 = m(x - x1)
                        //sendo (x1,y1) = (0,0)
                        intensity = m * average;
                    }else if(average > a && average <= c) {

                        //dois pontos: (a,b) e (c,d)
                        //m é o coeficiente angular
                        m = (b - d)/(a - c);
                        //equação da reta y - y1 = m(x - x1)
                        //sendo (x1,y1) = (a,b)
                        intensity = (m * (average - a)) + b;
                    }else{
                        //dois pontos: (c,d) e (255,255)
                        //m é o coeficiente angular
                        m = (d - 255)/(c - 255);
                        //equação da reta y - y1 = m(x - x1)
                        //sendo (x1,y1) = (c,d)
                        intensity = (m * (average - c)) + d;
                    }     
                    imgData.data[i] = intensity;
                    imgData.data[i+1] = intensity;
                    imgData.data[i+2] = intensity;    
                }
            
                 ctxt.putImageData(imgData,0,0);

            }else{
                return;
            }
        }else{
            return;
        }
    }else{
        return;
    } 
}

photoShop.prototype.histogram= function (){
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
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

photoShop.prototype.cumulativeDistribution = function(imgData, cdf) {
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

photoShop.prototype.histogramEqGlobal= function(){
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var x = [];
    var cdf = new Array(255).fill(0);
    var min = photo.cumulativeDistribution(imgData, cdf);
    
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


photoShop.prototype.localEqualization = function(x, y, matrix) {
    var auxMatrix = new Array(3);
    for(var i=0; i<3; i++) {
        auxMatrix[i] = new Array(3);
    }
    var count = new Map();
    for(var i=0; i<3; i++) {
        for(var j=0; j<3; j++) {
            var intensity = 0;
            if(x+(i-1)>0 && x+(i-1)<preview.height-1 && y+(j-1)>0 && y+(j-1)<preview.width-1)
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
        mapDistrib.set(keys[i], count.get(keys[0])+mapDistrib.get(keys[i-1]));
    }

    var average = auxMatrix[1][1];
    var intensity = (mapDistrib.get(average) - mapDistrib.get(keys[0])) * 255 / 8;
    matrix[x][y] = intensity;
}

photoShop.prototype.histogramEqLocal= function(){
    preview = photo.getPreview();
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    console.log(preview.width + "  " + preview.height);

    var intensityMatrix = new Array(preview.height);
    for(var i=0; i<intensityMatrix.length; i++){
        intensityMatrix[i] = new Array(preview.width);
    }
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
            photo.localEqualization(x,y,intensityMatrix);
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

var photo = new photoShop();