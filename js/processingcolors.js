function processingcolors() {}

processingcolors.prototype.getPreview = function(){
    return this._preview;
}

processingcolors.prototype.set = function(preview){
    this._preview = preview;
}
processingcolors.prototype.getPreviewChroma = function(){
    return this._chroma;
}

processingcolors.prototype.setChroma = function(chromapreview){
    this._chroma = chromapreview;
}
processingcolors.prototype.brightness = function(bright){
    preview = proccol.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4)
      {
        var b  = [bright*imgData.data[i],bright*imgData.data[i+1],bright*imgData.data[i+2]];

        imgData.data[i] = b[0];
        imgData.data[i+1] = b[1];
        imgData.data[i+2] = b[2];
            
      }
      ctxt.putImageData(imgData,0,0);
}

processingcolors.prototype.HSIbrightness = function(bright){
    preview = proccol.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        let HSI = col.RGBtoHSI(imgData.data[i], imgData.data[i+1], imgData.data[i+2])
        HSI[2] = HSI[2]*bright
        if(HSI[2] > 1)
            HSI[2] = 1
        let RGB = col.HSItoRGB(HSI[0], HSI[1], HSI[2])
        imgData.data[i] = RGB[0]
        imgData.data[i+1] = RGB[1]
        imgData.data[i+2] = RGB[2]
    }
    ctxt.putImageData(imgData,0,0);
}

processingcolors.prototype.medianfilter = function(){
    conv.convolution33("(1,1,1)","(1,1,1)","(1,1,1)",1/9,false);
    
}
processingcolors.prototype.laplacian = function(bright){
    conv.convolution33("(0,-1,0)","(-1,4,-1)","(0,-1,0)", 1,false);
    
}
processingcolors.prototype.chromakey = function(color,tr,radio){
    if(tr == ""){
        tr = 1;
    }
    tr = parseFloat(tr);

    // transperency * pixel[x][y][z] + (1 - transperency)*pixelback[x][y][z]

    var c = [parseInt(color.split(',')[0].split('(')[1],10), 
    parseInt(color.split(',')[1].split(',')[0],10), 
    parseInt(color.split(',')[2].split(')')[0],10)];

    preview = proccol.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);


    photoBack =  proccol.getPreviewChroma();
    var canvasOriBack = document.getElementById("canvasOriBack");
    canvasOriBack.width = photoBack.width;
    canvasOriBack.height = photoBack.height;
    ctxtOriBack = canvasOriBack.getContext('2d');
    ctxtOriBack.drawImage(proccol.getPreviewChroma(), 0, 0,canvasOriBack.width, canvasOriBack.height );
    var photoBackimgData=ctxtOriBack.getImageData(0, 0, preview.width, preview.height);


    for (var i=0;i<imgData.data.length;i+=4)
      {
        var b  = [imgData.data[i],imgData.data[i+1],imgData.data[i+2]];

        if(proccol.distance(c,b)<=radio){
            imgData.data[i] = photoBackimgData.data[i];
            imgData.data[i+1] = photoBackimgData.data[i+1];
            imgData.data[i+2] = photoBackimgData.data[i+2];
        }else{
            imgData.data[i] = tr*imgData.data[i] + (1 - tr)*photoBackimgData.data[i];
            imgData.data[i+1] = tr*imgData.data[i+1] + (1 - tr)*photoBackimgData.data[i+1];
            imgData.data[i+2] = tr*imgData.data[i+1] + (1 - tr)*photoBackimgData.data[i+2]; 
        }
      }
      ctxt.putImageData(imgData,0,0);

}
processingcolors.prototype.distance = function(a,b){
    var k = Math.pow((a[0]-b[0]),2);
    var i = Math.pow((a[1]-b[1]),2);
    var z = Math.pow((a[2]-b[2]),2);
    distance = Math.sqrt(k+i+z);
    return distance
}
processingcolors.prototype.previewFile = function(proccol){
    var previewOriBack = document.getElementById('imgOriBack'); //selects the query named img
    image    = document.getElementById('backphoto').files[0]; //sames as here
    var readerOriBack  = new FileReader();//canvasOriBack

    readerOriBack.onloadend = function () {
        previewOriBack =document.createElement('img');
        previewOriBack.src = readerOriBack.result;
        previewOriBack.onload = function () {
            var canvasOriBack = document.getElementById("canvasOriBack");
            preview = proccol.getPreview();
            previewOriBack.width = preview.width;
            previewOriBack.height = preview.height;
            canvasOriBack.width = previewOriBack.width;
            canvasOriBack.height = previewOriBack.height;
            ctxt = canvasOriBack.getContext('2d');
            ctxt.drawImage(previewOriBack, 0, 0,canvasOriBack.width, canvasOriBack.height );
            proccol.setChroma(previewOriBack);
        }
    }

    if (image) {
        readerOriBack.readAsDataURL(image); //reads the data as a URL
    } else {
        previewOriBack.src = "";
    }
}

processingcolors.prototype.contrast = function(constant,gamma){
    if(!constant){
        constant = 1;
    }
    preview = proccol.getPreview();
    
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4)
        {
        imgData.data[i]=constant*(Math.pow(imgData.data[i]/255,gamma))*255;
        imgData.data[i+1]=constant*(Math.pow(imgData.data[i+1]/255,gamma))*255;
        imgData.data[i+2]=constant*(Math.pow(imgData.data[i+2]/255,gamma))*255;
        }

        ctxt.putImageData(imgData,0,0);
    
}
processingcolors.prototype.contrastsigmoid = function(a,b,c,d){
    preview = proccol.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=d + (a-d)/ (1 + (imgData.data[i]/c)*b);
        imgData.data[i+1]=d + (a-d)/ (1 + (imgData.data[i+1]/c)*b);
        imgData.data[i+2]=d + (a-d)/(1 + (imgData.data[i+2]/c)*b);
    }

        ctxt.putImageData(imgData,0,0);
    
}

var proccol = new processingcolors();