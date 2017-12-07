function EDG(){

}
EDG.prototype.getPreview = function () {
    return this._preview;
}
EDG.prototype.set = function (preview) {
    this._preview = preview;
}

EDG.prototype.dilation = function(level){
    preview = edg.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(edg.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    if(level == ""){
        level = 1;
    }
    
    var auxData = new Array(imgData.data.length);
    for (var i=0;i<imgData.data.length;i+=4)
    {
      auxData[i] = imgData.data[i];
      auxData[i+1] = imgData.data[i+1];
      auxData[i+2] = imgData.data[i+2];
    }
    console.log(level)
    for(let k=0;k<level;k++){
        for (var i=0;i<imgData.data.length;i+=4)
        {
          imgData.data[i] =  auxData[i];
          imgData.data[i+1] =  auxData[i+1];
          imgData.data[i+2] =  auxData[i+2];
        }
        for(var i=1; i<preview.height-1; i++) {
            for(var j=1; j<preview.width-1; j++) {
                var r=0,g=0,b=0,value=0;
                // var relativePosChoose = (((i+1-1) * preview.width) + (j+1-1)) * 4;
                for(var x=0; x<3; x++) {
                    for(var y=0; y<3; y++) {
                        var relativePos = (((i+x-1) * preview.width) + (j+y-1)) * 4;
                        if(r<imgData.data[relativePos]&&g<imgData.data[relativePos+1]&&b<imgData.data[relativePos+2]){
                            r=imgData.data[relativePos]
                            g=imgData.data[relativePos+1]
                            b=imgData.data[relativePos+2]
                            value++;
                        }
                        if(x==1 && y==1){
                            var relativePosChoose =relativePos;// (((i+x-1) * preview.width) + (j+y-1)) * 4;
                            // var relativePosr = (((i-1) * preview.width) + (j-1)) * 4;                         
                        }
                        // if(imgData.data[relativePos]<imgData.data[relativePosChoose]){
                        //     imgData.data[relativePosChoose]=imgData.data[relativePos];
                        // }
                        // if(imgData.data[relativePos+1]<imgData.data[relativePosChoose+1]){
                        //     imgData.data[relativePosChoose+1]=imgData.data[relativePos+1];
                        // }if(imgData.data[relativePos+2]<imgData.data[relativePosChoose+2]){
                        //     imgData.data[relativePosChoose+2]=imgData.data[relativePos+2];
                        // }
    
                    }
                }
                if(value>0){
                    auxData[relativePosChoose]= r;      
                    auxData[relativePosChoose+1]=  g;       
                    auxData[relativePosChoose+2]=  b;  
                }  
                
            }
        }
    }
    for (var i=0;i<imgData.data.length;i+=4)
    {
      imgData.data[i] = auxData[i];
      imgData.data[i+1] = auxData[i+1];
      imgData.data[i+2] = auxData[i+2];
    }
    if(auxData==imgData.data){
        console.log("oi")
    }

    console.log("Feito");
    ctxt.putImageData(imgData,0,0);
    return imgData;
}
EDG.prototype.erosion = function(level){
    preview = edg.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(edg.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    if(level == ""){
        level = 1;
    }
    var auxData = new Array(imgData.data.length);
    for (var i=0;i<imgData.data.length;i+=4)
    {
      auxData[i] = imgData.data[i];
      auxData[i+1] = imgData.data[i+1];
      auxData[i+2] = imgData.data[i+2];
    }
    console.log(level)
    for(let k=0;k<level;k++){
        for (var i=0;i<imgData.data.length;i+=4)
        {
          imgData.data[i] =  auxData[i];
          imgData.data[i+1] =  auxData[i+1];
          imgData.data[i+2] =  auxData[i+2];
        }
        for(var i=1; i<preview.height-1; i++) {
            for(var j=1; j<preview.width-1; j++) {
                var r=255,g=255,b=255,value=0;
                // var relativePosChoose = (((i+1-1) * preview.width) + (j+1-1)) * 4;
                for(var x=0; x<3; x++) {
                    for(var y=0; y<3; y++) {
                        var relativePos = (((i+x-1) * preview.width) + (j+y-1)) * 4;
                        if(r>imgData.data[relativePos]&&g>imgData.data[relativePos+1]&&b>imgData.data[relativePos+2]){
                            r=imgData.data[relativePos]
                            g=imgData.data[relativePos+1]
                            b=imgData.data[relativePos+2]
                            value++;
                        }
                        if(x==1 && y==1){
                            var relativePosChoose =relativePos;// (((i+x-1) * preview.width) + (j+y-1)) * 4;
                            // var relativePosr = (((i-1) * preview.width) + (j-1)) * 4;                         
                        }
                        // if(imgData.data[relativePos]<imgData.data[relativePosChoose]){
                        //     imgData.data[relativePosChoose]=imgData.data[relativePos];
                        // }
                        // if(imgData.data[relativePos+1]<imgData.data[relativePosChoose+1]){
                        //     imgData.data[relativePosChoose+1]=imgData.data[relativePos+1];
                        // }if(imgData.data[relativePos+2]<imgData.data[relativePosChoose+2]){
                        //     imgData.data[relativePosChoose+2]=imgData.data[relativePos+2];
                        // }
    
                    }
                }
                if(value>0){
                    auxData[relativePosChoose]= r;      
                    auxData[relativePosChoose+1]=  g;       
                    auxData[relativePosChoose+2]=  b;  
                }  
                
            }
        }
    }
    for (var i=0;i<imgData.data.length;i+=4)
    {
      imgData.data[i] = auxData[i];
      imgData.data[i+1] = auxData[i+1];
      imgData.data[i+2] = auxData[i+2];
    }
    if(auxData==imgData.data){
        console.log("oi")
    }

    console.log("Feito");
    ctxt.putImageData(imgData,0,0);
    return imgData;
}
EDG.prototype.mgradient = function(gradient){
    preview = edg.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(edg.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
      var dilation = edg.dilation(gradient);
      var erosion = edg.erosion(gradient);
      for (var i=0;i<imgData.data.length;i++){
          if(dilation.data[i]!=erosion.data[i]){
            imgData.data[i]=dilation.data[i]-erosion.data[i];
          }

      }
    ctxt.putImageData(imgData,0,0);
}

var edg = new EDG();