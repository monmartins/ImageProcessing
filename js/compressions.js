function compressions(){

}
compressions.prototype.getPreview = function(){
    return this._preview;
}
compressions.prototype.set = function(preview){
    this._preview = preview;
}

compressions.prototype.file = function(){
    var sep = "\n\n\n\n\n\n\n\n";
    file    = document.getElementById("huffman").files[0]; //sames as here
    var reader  = new FileReader();
    reader.readAsText(file); //reads the data as a txt
    reader.onloadend = function () {

        file = (reader.result);
        preview =document.createElement('img');
        preview.width=file.split(sep)[0];
        preview.height=file.split(sep)[1];
        
        canvas.width = preview.width;
        canvas.height= preview.height;
        ctxt = canvas.getContext('2d');
        ctxt.drawImage(preview, canvas.width, 0,canvas.width, canvas.height );
        var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);

        var huffmanR = Huffman.Tree.decodeTree(JSON.parse(file.split(sep)[2]));
        var huffmanG = Huffman.Tree.decodeTree(JSON.parse(file.split(sep)[3]));
        var huffmanB = Huffman.Tree.decodeTree(JSON.parse(file.split(sep)[4]));

        var huffmanRdecode = huffmanR.decode(file.split(sep)[5]);
        var huffmanGdecode = huffmanG.decode(file.split(sep)[6]);
        var huffmanBdecode = huffmanB.decode(file.split(sep)[7]);


        for(var i=0,j=0; i<imgData.data.length; i+=4,j+=1) {
            imgData.data[i] = huffmanRdecode[j];
            imgData.data[i+1]= huffmanGdecode[j];
            imgData.data[i+2]= huffmanBdecode[j];
            imgData.data[i+3] = 255;
        }
        ctxt.putImageData(imgData,0,0);
        console.log("feito")
    }

}
compressions.prototype.huffman = function(){
    var sep = "\n\n\n\n\n\n\n\n";
    preview = comp.getPreview();
    
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var r = [];
    var g = [];
    var b = [];
    for(var i=0,j=0; i<imgData.data.length; i+=4,j+=1) {
        r[j] = imgData.data[i];
        g[j] = imgData.data[i+1];
        b[j] = imgData.data[i+2];
    }
    var huffmanR = Huffman.treeFromImage(r);
    var huffmanG = Huffman.treeFromImage(g);
    var huffmanB = Huffman.treeFromImage(b);
    var huffmanRencode = huffmanR.encode(r);
    var huffmanGencode = huffmanG.encode(g);
    var huffmanBencode = huffmanB.encode(b);
    
    var file = preview.width + sep + preview.height + sep;
    file +=  JSON.stringify(huffmanR.encodeTree()) + sep + JSON.stringify(huffmanG.encodeTree()) + sep + JSON.stringify(huffmanB.encodeTree())
    file += sep + huffmanRencode + sep + huffmanGencode + sep + huffmanBencode;
 
    var data = new Blob([(String(file))]);
    var a2 = document.getElementById("a2");
    a2.href = URL.createObjectURL(data);

    console.log("feito")
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
