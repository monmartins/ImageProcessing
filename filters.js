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
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    // invert colors
    for (var i=0;i<imgData.data.length;i+=4)
      {
          sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]
          media = sum/3;
          
        imgData.data[i] = media;
        imgData.data[i+1] = media;
        imgData.data[i+2] = media;
        imgData.data[i+3]=255;
      }
      ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.threshold = function(constant){
    if(constant){
        //ok
    }else{
        constant = 383
    }
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    // invert colors
    for (var i=0;i<imgData.data.length;i+=4)
      {
          sum = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]
          if(sum>constant){
            imgData.data[i] = 255
            imgData.data[i+1] = 255
            imgData.data[i+2] = 255
          }else{
            imgData.data[i] = 0
            imgData.data[i+1] = 0
            imgData.data[i+2] = 0
          }
      imgData.data[i+3]=255;
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
      imgData.data[i+3]=255;
      }
      ctxt.putImageData(imgData,0,0);
}
photoShop.prototype.logTransformation= function(constant){
    if(constant){

    }else{
        constant = 1;
    }
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=constant*(Math.log(1 + imgData.data[i]))*25;
        imgData.data[i+1]=constant*(Math.log(1 + imgData.data[i+1]))*25;
        imgData.data[i+2]=constant*(Math.log(1 + imgData.data[i+2]))*25;
        imgData.data[i+3]=255;
    }

        ctxt.putImageData(imgData,0,0);
    Math.log(2);
}
photoShop.prototype.gamma = function (constant,gamma){
    if(constant){
        
    }else{
        constant = 1;
    }
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    console.log(gamma)
    console.log(Math.pow(imgData.data[1],gamma))
    for (var i=0;i<imgData.data.length;i+=4)
        {
        imgData.data[i]=constant*(Math.pow(imgData.data[i],1/gamma));
        imgData.data[i+1]=constant*(Math.pow(imgData.data[i+1],1/gamma));
        imgData.data[i+2]=constant*(Math.pow(imgData.data[i+2],1/gamma));
        imgData.data[i+3]=255;
        }

        ctxt.putImageData(imgData,0,0);
    
}
photoShop.prototype.layer= function (layer){
    console.log(layer)
    layer = layer - 1
    preview =document.createElement('img');
    preview.src = photo.get();
    canvas.width = preview.width;
    canvas.height=preview.height;
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
    var imgData=ctxt.getImageData(0,0,canvas.width,canvas.height);
    console.log(imgData.data[1].toString(2));
    console.log(imgData.data[1].toString(2)[layer]);
    var listBin = new String("00000000");
    listBin.replaceAt(layer,imgData.data[1].toString(2)[layer]) 
    console.log(listBin)
    num = parseInt(listBin.value,2);
    console.log(num)
    for (var i=0;i<imgData.data.length;i+=4){
        var listBin = new String("00000000");
        listBin.replaceAt(layer,imgData.data[i].toString(2)[layer]) 
        num = parseInt(listBin.value,2);
        imgData.data[i]=num;
        var listBin = new String("00000000");
        listBin.replaceAt(layer,imgData.data[i+1].toString(2)[layer]) 
        num = parseInt(listBin.value,2);
        imgData.data[i+1]=num;
        var listBin = new String("00000000");
        listBin.replaceAt(layer,imgData.data[i+2].toString(2)[layer]) 
        num = parseInt(listBin.value,2);
        imgData.data[i+2]=num;
        imgData.data[i+3]=255;
    }

     ctxt.putImageData(imgData,0,0);
    
}
var photo = new photoShop();