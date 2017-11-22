function compressions(){
}
compressions.prototype.getPreview = function(){
    return this._preview;
}
compressions.prototype.set = function(preview){
    this._preview = preview;
}

compressions.prototype.huffman = function(){
    preview = comp.getPreview();
    
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
    }
    ctxt.putImageData(imgData,0,0);
}
compressions.prototype.lzw = function(){
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
    }
    ctxt.putImageData(imgData,0,0);
}
compressions.prototype.run_length = function(){
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
    }
    ctxt.putImageData(imgData,0,0);
}
compressions.prototype.predictivecoding = function(){
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
    }
    ctxt.putImageData(imgData,0,0);
}
compressions.prototype.waveletencoding = function(){
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i=0;i<imgData.data.length;i+=4){
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
    }
    ctxt.putImageData(imgData,0,0);
}

var comp = new compressions();
