function photoShop(){
}
photoShop.prototype.get = function(){
    return this._url
}
photoShop.prototype.set = function(url){
    this._url = url;
}
photoShop.prototype.blackWhite = function(){
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height = preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    // cada um dos 3 pixels de cor recebe o mesmo valor, que é a media entre seus valores originais
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
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
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
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
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
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
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
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
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
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    for (var i=0;i<imgData.data.length;i+=4){
        var listBin = "";

        listBin = new String(imgData.data[i].toString(2));
        listBin.bitSlicingLayer(layer) 
        num = parseInt(listBin.value,2);
        imgData.data[i]=num;

        listBin = new String(imgData.data[i+1].toString(2));
        listBin.bitSlicingLayer(layer) 
        num = parseInt(listBin.value,2);
        imgData.data[i+1]=num;

        listBin = new String(imgData.data[i+2].toString(2));
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
                preview =document.createElement('img');
                preview.src = photo.get();
                canvas.width = preview.width;
                canvas.height=preview.height;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
                var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
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
var photo = new photoShop();