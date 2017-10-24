function processingcolors() {}

processingcolors.prototype.getPreview = function(){
    return this._preview;
}

processingcolors.prototype.set = function(preview){
    this._preview = preview;
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
processingcolors.prototype.chromakey = function(color,colorchroma,radio){
    var a = [parseInt(colorchroma.split(',')[0].split('(')[1],10), 
    parseInt(colorchroma.split(',')[1].split(',')[0],10), 
    parseInt(colorchroma.split(',')[2].split(')')[0],10)];

    var c = [parseInt(color.split(',')[0].split('(')[1],10), 
    parseInt(color.split(',')[1].split(',')[0],10), 
    parseInt(color.split(',')[2].split(')')[0],10)];
    preview = proccol.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(proccol.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4)
      {
        var b  = [imgData.data[i],imgData.data[i+1],imgData.data[i+2]];

        if(proccol.distance(c,b)<=radio){
            imgData.data[i] = a[0];
            imgData.data[i+1] = a[1];
            imgData.data[i+2] = a[2];
        }
      }
      ctxt.putImageData(imgData,0,0);
      console.log(radio);

}
processingcolors.prototype.distance = function(a,b){
    var k = Math.pow((a[0]-b[0]),2);
    var i = Math.pow((a[1]-b[1]),2);
    var z = Math.pow((a[2]-b[2]),2);
    distance = Math.sqrt(k+i+z);
    return distance
}
processingcolors.prototype.contrast = function(bright){
    
}

var proccol = new processingcolors();