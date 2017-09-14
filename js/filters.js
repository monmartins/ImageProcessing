function photoShop(){
}
photoShop.prototype.getPreview = function(){
    return this._preview;
}
// photoShop.prototype.getCanvas = function(){
//     return this._canvas;
// }
photoShop.prototype.set = function(preview){
    this._preview = preview;
    // this._canvas = canvas;
}
photoShop.prototype.blackWhite = function(){
    preview = photo.getPreview();
    
                ctxt = canvas.getContext('2d');
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
    
                ctxt = canvas.getContext('2d');
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
    
                ctxt = canvas.getContext('2d');// 
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
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
    
                ctxt = canvas.getContext('2d');
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
    
                ctxt = canvas.getContext('2d');
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
    
                ctxt = canvas.getContext('2d');
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
                
                ctxt = canvas.getContext('2d');
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
    
                ctxt = canvas.getContext('2d');
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

photoShop.prototype.histogramEqGlobal= function(){
    preview = photo.getPreview();
    
                ctxt = canvas.getContext('2d');
    ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var x = [];
    var cdf = new Array(255).fill(0);
    var min = 255;
    for(var i=0; i<imgData.data.length; i+=4) {
        average = parseInt((imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3);
        //x[i] = average;
        cdf[average] += 1; 
        if (average < min)
            min = average;
    }
    for (var i = 1; i < cdf.length; i++) {
        cdf[i] = cdf[i] + cdf[i-1];
    }
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
    Plotly.newPlot("histogramDiv", data, layout);
}

photoShop.prototype.histogramEqLocal= function(){}

photoShop.prototype.convolution55 = function(linha1,linha2,linha3,linha4,linha5){
        var matrix = [[parseInt(linha1.split(',')[0].split('(')[1]),parseInt(linha1.split(',')[1]),parseInt(linha1.split(',')[2]),parseInt(linha1.split(',')[3]),parseInt(linha1.split(',')[4].split(')')[0])],
        [parseInt(linha2.split(',')[0].split('(')[1]),parseInt(linha2.split(',')[1]),parseInt(linha2.split(',')[2]),parseInt(linha2.split(',')[3]),parseInt(linha2.split(',')[4].split(')')[0])],
        [parseInt(linha3.split(',')[0].split('(')[1]),parseInt(linha3.split(',')[1]),parseInt(linha3.split(',')[2]),parseInt(linha3.split(',')[3]),parseInt(linha3.split(',')[4].split(')')[0])],
        [parseInt(linha4.split(',')[0].split('(')[1]),parseInt(linha4.split(',')[1]),parseInt(linha4.split(',')[2]),parseInt(linha4.split(',')[3]),parseInt(linha4.split(',')[4].split(')')[0])],
        [parseInt(linha5.split(',')[0].split('(')[1]),parseInt(linha5.split(',')[1]),parseInt(linha5.split(',')[2]),parseInt(linha5.split(',')[3]),parseInt(linha5.split(',')[4].split(')')[0])]];
        var div = matrix[0].reduce((x, y) => x + y);
        div += matrix[1].reduce((x, y) => x + y);
        div += matrix[2].reduce((x, y) => x + y);
        div += matrix[3].reduce((x, y) => x + y);
        div += matrix[4].reduce((x, y) => x + y);
        preview = photo.getPreview();
        
                ctxt = canvas.getContext('2d');
        ctxt.drawImage(photo.getPreview(), 0, 0,preview.width, preview.height );
        var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);

        for(var i=0; i<imgData.data.length; i+=4) {
            var r = i,g=i+1,b=i+2;
            try{
                //primeira coluna

                mr = imgData.data[(r-4*2)+(-imgData.width*4*2)] * matrix[0][0]
                mr += imgData.data[(r-4*2)+(-imgData.width*4)] * matrix[1][0]
                mr += imgData.data[(r-4*2)]  * matrix[2][0]
                mr += imgData.data[(r-4*2)+(imgData.width*4)] * matrix[3][0]
                mr += imgData.data[(r-4*2)+(imgData.width*4*2)] * matrix[4][0]

                mg = imgData.data[(g-4*2)+(-imgData.width*4*2)] * matrix[0][0]
                mg += imgData.data[(g-4*2)+(-imgData.width*4)] * matrix[1][0]
                mg += imgData.data[g-4*2] * matrix[2][0]
                mg += imgData.data[(g-4*2)+(imgData.width*4)] * matrix[3][0]
                mg += imgData.data[(g-4*2)+(imgData.width*4*2)] * matrix[4][0]

                mb = imgData.data[(b-4*2)+(-imgData.width*4*2)] * matrix[0][0]
                mb += imgData.data[(b-4*2)+(-imgData.width*4)] * matrix[1][0]
                mb += imgData.data[b-4*2]* matrix[2][0]
                mb += imgData.data[(b-4*2)+(imgData.width*4)] * matrix[3][0]
                mb += imgData.data[(b-4*2)+(imgData.width*4*2)] * matrix[4][0]

                //segunda coluna

                mr += imgData.data[(r-4)+(-imgData.width*4*2)] * matrix[0][1]
                mr += imgData.data[(r-4)+(-imgData.width*4)] * matrix[1][1]
                mr += imgData.data[(r-4)]  * matrix[2][1]
                mr += imgData.data[(r-4)+(imgData.width*4)] * matrix[3][1]
                mr += imgData.data[(r-4)+(imgData.width*4*2)] * matrix[4][1]

                mg += imgData.data[(g-4)+(-imgData.width*4*2)] * matrix[0][1]
                mg += imgData.data[(g-4)+(-imgData.width*4)] * matrix[1][1]
                mg += imgData.data[g-4] * matrix[2][1]
                mg += imgData.data[(g-4)+(imgData.width*4)] * matrix[3][1]
                mg += imgData.data[(g-4)+(imgData.width*4*2)] * matrix[4][1]

                mb += imgData.data[(b-4)+(-imgData.width*4*2)] * matrix[0][1]
                mb += imgData.data[(b-4)+(-imgData.width*4)] * matrix[1][1]
                mb += imgData.data[b-4]* matrix[2][1]
                mb += imgData.data[(b-4)+(imgData.width*4)] * matrix[3][1]
                mb += imgData.data[(b-4)+(imgData.width*4*2)] * matrix[4][1]

                //terceira coluna
                mr += imgData.data[(r)+(-imgData.width*4*2)] * matrix[0][2]
                mr += imgData.data[(r)+(-imgData.width*4)] * matrix[1][2]
                mr += imgData.data[(r)]  * matrix[2][2]
                mr += imgData.data[(r)+(imgData.width*4)] * matrix[3][2]
                mr += imgData.data[(r)+(imgData.width*4*2)] * matrix[4][2]

                mg += imgData.data[(g)+(-imgData.width*4*2)] * matrix[0][2]
                mg += imgData.data[(g)+(-imgData.width*4)] * matrix[1][2]
                mg += imgData.data[g] * matrix[2][2]
                mg += imgData.data[(g)+(imgData.width*4)] * matrix[3][2]
                mg += imgData.data[(g)+(imgData.width*4*2)] * matrix[4][2]

                mb += imgData.data[(b)+(-imgData.width*4*2)] * matrix[0][2]
                mb += imgData.data[(b)+(-imgData.width*4)] * matrix[1][2]
                mb += imgData.data[b]* matrix[2][2]
                mb += imgData.data[(b)+(imgData.width*4)] * matrix[3][2]
                mb += imgData.data[(b)+(imgData.width*4*2)] * matrix[4][2]

                //quarta coluna
                mr += imgData.data[(r+4)+(-imgData.width*4*2)] * matrix[0][3]
                mr += imgData.data[(r+4)+(-imgData.width*4)] * matrix[1][3]
                mr += imgData.data[(r+4)]  * matrix[2][3]
                mr += imgData.data[(r+4)+(imgData.width*4)] * matrix[3][3]
                mr += imgData.data[(r+4)+(imgData.width*4*2)] * matrix[4][3]

                mg += imgData.data[(g+4)+(-imgData.width*4*2)] * matrix[0][3]
                mg += imgData.data[(g+4)+(-imgData.width*4)] * matrix[1][3]
                mg += imgData.data[g+4] * matrix[2][3]
                mg += imgData.data[(g+4)+(imgData.width*4)] * matrix[3][3]
                mg += imgData.data[(g+4)+(imgData.width*4*2)] * matrix[4][3]

                mb += imgData.data[(b+4)+(-imgData.width*4*2)] * matrix[0][3]
                mb += imgData.data[(b+4)+(-imgData.width*4)] * matrix[1][3]
                mb += imgData.data[b+4]* matrix[2][3]
                mb += imgData.data[(b+4)+(imgData.width*4)] * matrix[3][3]
                mb += imgData.data[(b+4)+(imgData.width*4*2)] * matrix[4][3]

                //quinta coluna
                mr += imgData.data[(r+4*2)+(-imgData.width*4*2)] * matrix[0][4]
                mr += imgData.data[(r+4*2)+(-imgData.width*4)] * matrix[1][4]
                mr += imgData.data[(r+4*2)]  * matrix[2][4]
                mr += imgData.data[(r+4*2)+(imgData.width*4)] * matrix[3][4]
                mr += imgData.data[(r+4*2)+(imgData.width*4*2)] * matrix[4][4]

                mg += imgData.data[(g+4*2)+(-imgData.width*4*2)] * matrix[0][4]
                mg += imgData.data[(g+4*2)+(-imgData.width*4)] * matrix[1][4]
                mg += imgData.data[g+4*2] * matrix[2][4]
                mg += imgData.data[(g+4*2)+(imgData.width*4)] * matrix[3][4]
                mg += imgData.data[(g+4*2)+(imgData.width*4*2)] * matrix[4][4]

                mb += imgData.data[(b+4*2)+(-imgData.width*4*2)] * matrix[0][4]
                mb += imgData.data[(b+4*2)+(-imgData.width*4)] * matrix[1][4]
                mb += imgData.data[b+4*2]* matrix[2][4]
                mb += imgData.data[(b+4*2)+(imgData.width*4)] * matrix[3][4]
                mb += imgData.data[(b+4*2)+(imgData.width*4*2)] * matrix[4][4]


                if(isNaN(mr)||isNaN(mg)||isNaN(mb)){
                }else{
                    // console.log(div)
                    imgData.data[r] = mr/div
                    imgData.data[g] = mg/div
                    imgData.data[b] = mb/div 
                }
            }catch(exp){
                continue
            }
        }

    ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.convolution33 = function(linha1,linha2,linha3){
        var matrix = [[parseInt(linha1.split(',')[0].split('(')[1]),parseInt(linha1.split(',')[1]),parseInt(linha1.split(',')[2].split(')')[0])],
        [parseInt(linha2.split(',')[0].split('(')[1]),parseInt(linha2.split(',')[1]),parseInt(linha2.split(',')[2].split(')')[0])],
        [parseInt(linha3.split(',')[0].split('(')[1]),parseInt(linha3.split(',')[1]),parseInt(linha3.split(',')[2].split(')')[0])]];
        var div = matrix[0].reduce((x, y) => x + y);
        div += matrix[1].reduce((x, y) => x + y);
        div += matrix[2].reduce((x, y) => x + y);
        preview = photo.getPreview();
        photo.blackWhite()
        ctxt = canvas.getContext('2d');
        ctxt.drawImage(photo.getPreview(), 0 , 0,preview.width, preview.height );
        var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);

        for(var i=0; i<imgData.data.length; i+=4) {
            var r = i,g=i+1,b=i+2;
            try{
                //primeira coluna
                mr = imgData.data[(r-4)+(-imgData.width*4)] * matrix[0][0]
                mr += imgData.data[(r-4)]  * matrix[1][0]
                mr += imgData.data[(r-4)+(imgData.width*4)] * matrix[2][0]

                mg = imgData.data[(g-4)+(-imgData.width*4)] * matrix[0][0]
                mg += imgData.data[g-4] * matrix[1][0]
                mg += imgData.data[(g-4)+(imgData.width*4)] * matrix[2][0]

                mb = imgData.data[(b-4)+(-imgData.width*4)] * matrix[0][0]
                mb += imgData.data[b-4]* matrix[1][0]
                mb += imgData.data[(b-4)+(imgData.width*4)] * matrix[2][0]

                //segunda coluna
                mr += imgData.data[(r)+(-imgData.width*4)] * matrix[0][1]
                mr += imgData.data[(r)]  * matrix[1][1]
                mr += imgData.data[(r)+(imgData.width*4)] * matrix[2][1]

                mg += imgData.data[(g)+(-imgData.width*4)] * matrix[0][1]
                mg += imgData.data[g] * matrix[1][1]
                mg += imgData.data[(g)+(imgData.width*4)] * matrix[2][1]

                mb += imgData.data[(b)+(-imgData.width*4)] * matrix[0][1]
                mb += imgData.data[b]* matrix[1][1]
                mb += imgData.data[(b)+(imgData.width*4)] * matrix[2][1]

                //terceira coluna
                mr += imgData.data[(r+4)+(-imgData.width*4)] * matrix[0][2]
                mr += imgData.data[(r+4)]  * matrix[1][2]
                mr += imgData.data[(r+4)+(imgData.width*4)] * matrix[2][2]

                mg += imgData.data[(g+4)+(-imgData.width*4)] * matrix[0][2]
                mg += imgData.data[g+4] * matrix[1][2]
                mg += imgData.data[(g+4)+(imgData.width*4)] * matrix[2][2]

                mb += imgData.data[(b+4)+(-imgData.width*4)] * matrix[0][2]
                mb += imgData.data[b+4]* matrix[1][2]
                mb += imgData.data[(b+4)+(imgData.width*4)] * matrix[2][2]
                if(isNaN(mr)||isNaN(mg)||isNaN(mb)){
                }else{
                    // console.log(div)
                    imgData.data[r] = mr/div
                    imgData.data[g] = mg/div
                    imgData.data[b] = mb/div  
                }
            }catch(exp){
                continue
            }
        }

    ctxt.putImageData(imgData,0,0);
}

photoShop.prototype.meanFilter = function(){
    photo.convolution33("(1,1,1)","(1,1,1)","(1,1,1)")
}

photoShop.prototype.mediumFilter = function(){
    photo.convolution33("(1,1,1)","(1,2,1)","(1,1,1)")
}

photoShop.prototype.medianFilter = function(){
    photo.convolution33("(0,1,0)","(1,1,1)","(0,1,0)")
}
var photo = new photoShop();