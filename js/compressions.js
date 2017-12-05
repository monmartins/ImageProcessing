function compressions() {

}
compressions.prototype.getPreview = function () {
    return this._preview;
}
compressions.prototype.set = function (preview) {
    this._preview = preview;
}

compressions.prototype.fileHuffman = function () {
    file = document.getElementById("huffman").files[0]; //sames as here
    var reader = new FileReader();
    reader.readAsArrayBuffer(file); //reads the data as a txt
    reader.onloadend = function () {

        file = (reader.result);
        uint = new Uint8Array(file);
        var image = Huffman.parseUint8arrayToData(uint);


        preview = document.createElement('img');
        preview.width = image.width;
        preview.height = image.height;

        canvas.width = preview.width;
        canvas.height = preview.height;
        ctxt = canvas.getContext('2d');
        ctxt.drawImage(preview, canvas.width, 0, canvas.width, canvas.height);
        var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

        var huffmanR = Huffman.Tree.decodeTree(JSON.parse(image.huffmanRTree));
        var huffmanG = Huffman.Tree.decodeTree(JSON.parse(image.huffmanGTree));
        var huffmanB = Huffman.Tree.decodeTree(JSON.parse(image.huffmanBTree));
        var huffmanRdecode = huffmanR.decode(image.huffmanREncode);
        var huffmanGdecode = huffmanG.decode(image.huffmanGEncode);
        var huffmanBdecode = huffmanB.decode(image.huffmanBEncode);


        for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
            imgData.data[i] = huffmanRdecode[j];
            imgData.data[i + 1] = huffmanGdecode[j];
            imgData.data[i + 2] = huffmanBdecode[j];
            imgData.data[i + 3] = 255;
        }
        ctxt.putImageData(imgData, 0, 0);
    }

}
compressions.prototype.huffman = function () {
    preview = comp.getPreview();

    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    var r = [];
    var g = [];
    var b = [];
    for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        r[j] = (imgData.data[i]);
        g[j] = (imgData.data[i + 1]);
        b[j] = (imgData.data[i + 2]);
    }
    var huffmanR = Huffman.treeFromImage(r);
    var huffmanG = Huffman.treeFromImage(g);
    var huffmanB = Huffman.treeFromImage(b);
    var huffmanRencode = huffmanR.encode(r);
    var huffmanGencode = huffmanG.encode(g);
    var huffmanBencode = huffmanB.encode(b);
    var huffmanRTreeEncode = huffmanR.encodeTree();
    var huffmanGTreeEncode = huffmanG.encodeTree();
    var huffmanBTreeEncode = huffmanB.encodeTree();
    var file = Huffman.parseDataToUint8array(preview.width,
        preview.height,
        huffmanRTreeEncode,
        huffmanGTreeEncode,
        huffmanBTreeEncode,
        huffmanRencode,
        huffmanGencode,
        huffmanBencode);

    var data = new Blob([file]);
    var a2 = document.getElementById("a2");
    a2.href = URL.createObjectURL(data);

    ctxt.putImageData(imgData, 0, 0);
}

compressions.prototype.lzw = function () {
    preview = comp.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    var r = [];
    var g = [];
    var b = [];
    for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        r[j] = (imgData.data[i]);
        g[j] = (imgData.data[i + 1]);
        b[j] = (imgData.data[i + 2]);
    }

    r_seq = comp.lzw_encode(r)
    g_seq = comp.lzw_encode(g)
    b_seq = comp.lzw_encode(b)
    var string = "";
    for(i in r_seq){
        string+=String(i)
    }
    for(i in g_seq){
        string+=String(i)
    }
    for(i in b_seq){
        string+=String(i)
    }
    var uint = new Uint8Array(string.length);
    var index = 0;
    for(i in string){
        uint[index] = i.charCodeAt(0);
        index++;
    }
    var file = uint;
    var data = new Blob([file]);
    var r4 = document.getElementById("r4");
    r4.href = URL.createObjectURL(data);
    console.log("Feito")

    ctxt.putImageData(imgData, 0, 0);
}
compressions.prototype.run_length = function () {
    preview = comp.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0,preview.width, preview.height );
    var imgData=ctxt.getImageData(0, 0, preview.width, preview.height);
    var r = [];
    var g = [];
    var b = [];
    for(var i=0,j=0; i<imgData.data.length; i+=4,j+=1) {
        r[j] = (imgData.data[i]);
        g[j] = (imgData.data[i+1]);
        b[j] = (imgData.data[i+2]);
    }
    var run_lengthR = run.encode(r);
    var run_lengthG = run.encode(g);
    var run_lengthB = run.encode(b);
    var lengthR = String(run_lengthR.length);
    var lengthG = String(run_lengthG.length);
    var lengthB = String(run_lengthB.length);

    var uint = new Uint8Array(lengthR.length+
        lengthG.length+
        lengthB.length+
       ( 2*run_lengthR.length)+(2*run_lengthG.length)+(2*run_lengthB.length));
    var indexuint = 0;
    uint[indexuint]=lengthR.length;//.charCodeAt(j);
    indexuint++;
    uint[indexuint]=lengthG.length;//.charCodeAt(j);
    indexuint++;
    uint[indexuint]=lengthB.length;//.charCodeAt(j);
    indexuint++;
    for(let j=0;j<lengthR.length;j++){
        uint[indexuint]=lengthR[j];//.charCodeAt(j);
        indexuint++;
    }       
    for(let j=0;j<lengthG.length;j++){
        uint[indexuint]=lengthG[j];//.charCodeAt(j);
        indexuint++;
    } 
    for(let j=0;j<lengthB.length;j++){
        uint[indexuint]=lengthB[j];//.charCodeAt(j);
        indexuint++;
    } 

    for(let j=0;j<run_lengthR.length;j++){
        uint[indexuint]=run_lengthR[j][0];//.charCodeAt(j);
        indexuint++;
        uint[indexuint]=run_lengthR[j][1];//.charCodeAt(j);
        indexuint++;
    }       
    for(let j=0;j<run_lengthG.length;j++){
        uint[indexuint]=run_lengthG[j][0];//.charCodeAt(j);
        indexuint++;
        uint[indexuint]=run_lengthG[j][1];//.charCodeAt(j);
        indexuint++;
    } 
    for(let j=0;j<run_lengthB.length;j++){
        uint[indexuint]=run_lengthB[j][0];//.charCodeAt(j);
        indexuint++;
        uint[indexuint]=run_lengthB[j][1];//.charCodeAt(j);
        indexuint++;
    } 

    uint[indexuint]=String(preview.width).length;//.charCodeAt(j);
    indexuint++;
    uint[indexuint]=String(preview.height).length;//.charCodeAt(j);
    indexuint++;
    for(let j=0;j<String(preview.width).length;j++){
        uint[indexuint]=String(preview.width)[j];//.charCodeAt(j);
        indexuint++;
    }       
    for(let j=0;j<String(preview.height).length;j++){
        uint[indexuint]=String(preview.height)[j];//.charCodeAt(j);
        indexuint++;
    } 
    var file= uint;

    var data = new Blob([file]);
    var r2 = document.getElementById("r2");
    r2.href = URL.createObjectURL(data);
    ctxt.putImageData(imgData, 0, 0);
}


compressions.prototype.fileRun_Length = function () {
    file = document.getElementById("run_length").files[0]; //sames as here
    var reader = new FileReader();
    reader.readAsArrayBuffer(file); //reads the data as a txt
    reader.onloadend = function () {

        file = (reader.result);
        uint = new Uint8Array(file);
        var indexuint = 0;
        var lenR = uint[indexuint];
        indexuint++;
        var lenG = uint[indexuint];
        indexuint++;
        var lenB = uint[indexuint];
        var lengthR = "";
        var lengthG = "";
        var lengthB = "";
        for(let j=0;j<parseInt(lenR);j++){
            lengthR+=uint[indexuint];
            indexuint++;
        }       
        for(let j=0;j<parseInt(lenG);j++){
            lengthG+=uint[indexuint];
            indexuint++;
        }   
        for(let j=0;j<parseInt(lenB);j++){
            lengthB+=uint[indexuint];
            indexuint++;
        }   
        var r_encode = [];
        var g_encode = [];
        var b_encode = [];
        for(let j=0;j<parseInt(lengthR);j++){
            let value =[];
            value.push(uint[indexuint]);
            indexuint++;
            value.push(uint[indexuint]);
            indexuint++;
            r_encode.push(value);
        }       
        for(let j=0;j<parseInt(lengthG);j++){
            let value =[];
            value.push(uint[indexuint]);
            indexuint++;
            value.push(uint[indexuint]);
            indexuint++;
            g_encode.push(value);
        }   
        for(let j=0;j<parseInt(lengthB);j++){
            let value =[];
            value.push(uint[indexuint]);
            indexuint++;
            value.push(uint[indexuint]);
            indexuint++;
            b_encode.push(value);
        }   

        var r = run.decode(r_encode);
        var g = run.decode(g_encode);
        var b = run.decode(b_encode);


        var image = {};
        var lenWidth = uint[indexuint];//.charCodeAt(j);
        indexuint++;
        var lenHeight = uint[indexuint];//.charCodeAt(j);
        indexuint++;
        var width ="";
        var height ="";
        for(let j=0;j<parseInt(lenWidth);j++){
            width+= uint[indexuint]
            indexuint++;
        }       
        for(let j=0;j<parseInt(lenHeight);j++){
            height+= uint[indexuint]
            indexuint++;
        }   
        image.width=parseInt(width)
        image.height=parseInt(height)


        preview = document.createElement('img');
        preview.width = image.width;
        preview.height = image.height;

        canvas.width = preview.width;
        canvas.height = preview.height;
        ctxt = canvas.getContext('2d');
        ctxt.drawImage(preview, canvas.width, 0, canvas.width, canvas.height);
        var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


        for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
            imgData.data[i] = r[j];
            imgData.data[i + 1] = g[j];
            imgData.data[i + 2] = b[j];
            imgData.data[i + 3] = 255;
        }
        ctxt.putImageData(imgData, 0, 0);
    }

}
compressions.prototype.predictivecoding = function () {
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i + 1] = 255 - imgData.data[i + 1];
        imgData.data[i + 2] = 255 - imgData.data[i + 2];
    }
    ctxt.putImageData(imgData, 0, 0);
}
compressions.prototype.waveletencoding = function () {
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i + 1] = 255 - imgData.data[i + 1];
        imgData.data[i + 2] = 255 - imgData.data[i + 2];
    }
    ctxt.putImageData(imgData, 0, 0);
}

compressions.prototype.lzw_encode = function (data) {
    //data é um vetor
    //usando imagens o dict deve ser iniciado com os valores 0 .. 255
    let dict = [];
    // let dictreverse = [];
    // if(typeof dictreverse[parseInt(word + next_char)] != "undefined"){
    //     word += next_char

    // }else{
    //     seq.push(dict.indexOf(word))
    //     dict[next_id++] = word + next_char
    //     dictreverse[parseInt(word + next_char)] = next_id++;
    //     word = next_char

    // }
    for (let i = 0; i < 256; i++) {
        stringfied = i.toString()
        if (stringfied.length == 1)
            stringfied = "00" + stringfied
        if (stringfied.length == 2)
            stringfied = "0" + stringfied
        dict[i] = stringfied
    }
    let word = ""
    let next_id = 256
    let seq = new Array()
    for (let i = 0; i < data.length; i++) {
        data[i] = data[i].toString();
    }
    
    // var objdict = Object.values(dict);
    for (let i = 0; i < data.length; i++) {
        let next_char = data[i]

        if (next_char.length == 1)
            next_char = "00" + next_char
        if (next_char.length == 2)
            next_char = "0" + next_char

        if (dict.indexOf(word + next_char) >= 0) {
            word += next_char
        } else {
            seq.push(dict.indexOf(word))
            dict[next_id++] = word + next_char
            word = next_char
        }
    }
    seq.push(dict.indexOf(word))
    console.log(seq.length)
    console.log("Feito")
    return seq
}


compressions.prototype.lzw_decode = function (data) {
    //let data = [3, 1, 4, 6, 5, 8, 3]
    let dict = {}
    for (let i = 0; i < 256; i++) {
        stringfied = i.toString()
        if (stringfied.length == 1)
            stringfied = "00" + stringfied
        if (stringfied.length == 2)
            stringfied = "0" + stringfied
        dict[i] = stringfied
    }

    let seq = new Array()
    let next_code = data[0]
    seq.push(dict[next_code])
    let code = ""
    let next_id = 256
    for (let i = 1; i < data.length; i++) {
        code = next_code
        next_code = data[i]

        if (dict[next_code]) {
            seq.push(dict[next_code])
            let word = dict[code]
            let next_char = (dict[next_code]).substring(0,3)
            dict[next_id++] = word + next_char
        } else {
            let word = dict[code]
            let next_char = (dict[code]).substring(0,3)
            seq.push(word + next_char)
            dict[next_id++] = word + next_char
        }
    }
    
    let sequencia = new Array()
    for(let i=0; i<seq.length; i++){
        for(let j=0; j<seq[i].length; j+=3){
            sequencia.push(parseInt(seq[i].substring(j, j+3)))
        }
    }

    return sequencia
}

compressions.prototype.huffman_run_length = function () {
    preview = comp.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    var r = [];
    var g = [];
    var b = [];
    for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        r[j] = (imgData.data[i]);
        g[j] = (imgData.data[i + 1]);
        b[j] = (imgData.data[i + 2]);
    }

    r_run = run.encode(r);
    g_run = run.encode(g);
    b_run = run.encode(b);

    console.log(r.length)
    console.log(r_run.length)
    console.log(g.length)
    console.log(g_run.length)
    console.log(b.length)
    console.log(b_run.length)
    
    var huffmanR = Huffman.treeFromImage(r_run);
    var huffmanG = Huffman.treeFromImage(g_run);
    var huffmanB = Huffman.treeFromImage(b_run);
    var huffmanRencode = huffmanR.encode(r_run);
    var huffmanGencode = huffmanG.encode(g_run);
    var huffmanBencode = huffmanB.encode(b_run);
    var huffmanRTreeEncode = huffmanR.encodeTree();
    var huffmanGTreeEncode = huffmanG.encodeTree();
    var huffmanBTreeEncode = huffmanB.encodeTree();
    var file = Huffman.parseDataToUint8array(preview.width,
        preview.height,
        huffmanRTreeEncode,
        huffmanGTreeEncode,
        huffmanBTreeEncode,
        huffmanRencode,
        huffmanGencode,
        huffmanBencode);

    var data = new Blob([file]);
    var r3 = document.getElementById("r3");
    r3.href = URL.createObjectURL(data);

    ctxt.putImageData(imgData, 0, 0);
}
compressions.prototype.huffman_lzw = function () {
    preview = comp.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(comp.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    var r = [];
    var g = [];
    var b = [];
    for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        r[j] = (imgData.data[i]);
        g[j] = (imgData.data[i + 1]);
        b[j] = (imgData.data[i + 2]);
    }

    r_seq = comp.lzw_encode(r)
    g_seq = comp.lzw_encode(g)
    b_seq = comp.lzw_encode(b)

    
    var huffmanR = Huffman.treeFromImage(r_seq);
    var huffmanG = Huffman.treeFromImage(g_seq);
    var huffmanB = Huffman.treeFromImage(b_seq);
    var huffmanRencode = huffmanR.encode(r_seq);
    var huffmanGencode = huffmanG.encode(g_seq);
    var huffmanBencode = huffmanB.encode(b_seq);
    var huffmanRTreeEncode = huffmanR.encodeTree();
    var huffmanGTreeEncode = huffmanG.encodeTree();
    var huffmanBTreeEncode = huffmanB.encodeTree();

    var file = Huffman.parseDataToUint8array(preview.width,
        preview.height,
        huffmanRTreeEncode,
        huffmanGTreeEncode,
        huffmanBTreeEncode,
        huffmanRencode,
        huffmanGencode,
        huffmanBencode);


    var data = new Blob([file]);
    var a3 = document.getElementById("a3");
    a3.href = URL.createObjectURL(data);
    console.log("Feito")

    ctxt.putImageData(imgData, 0, 0);
}

compressions.prototype.fileHuffmanLzw = function () {
    file = document.getElementById("huffmanlzw").files[0]; //sames as here
    var reader = new FileReader();
    reader.readAsArrayBuffer(file); //reads the data as a txt
    reader.onloadend = function () {

        file = (reader.result);
        uint = new Uint8Array(file);
        var image = Huffman.parseUint8arrayToData(uint);


        preview = document.createElement('img');
        preview.width = image.width;
        preview.height = image.height;

        canvas.width = preview.width;
        canvas.height = preview.height;
        ctxt = canvas.getContext('2d');
        ctxt.drawImage(preview, canvas.width, 0, canvas.width, canvas.height);
        var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

        var huffmanR = Huffman.Tree.decodeTree(JSON.parse(image.huffmanRTree));
        var huffmanG = Huffman.Tree.decodeTree(JSON.parse(image.huffmanGTree));
        var huffmanB = Huffman.Tree.decodeTree(JSON.parse(image.huffmanBTree));
        var huffmanRdecode = huffmanR.decode(image.huffmanREncode);
        var huffmanGdecode = huffmanG.decode(image.huffmanGEncode);
        var huffmanBdecode = huffmanB.decode(image.huffmanBEncode);

        var lzwRdecode = comp.lzw_decode(huffmanRdecode)
        var lzwGdecode = comp.lzw_decode(huffmanGdecode)
        var lzwBdecode = comp.lzw_decode(huffmanBdecode)   


        for (var i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
            imgData.data[i] = lzwRdecode[j];
            imgData.data[i + 1] = lzwGdecode[j];
            imgData.data[i + 2] = lzwBdecode[j];
            imgData.data[i + 3] = 255;
        }
        ctxt.putImageData(imgData, 0, 0);
    }

}
var CanvasToBMP = {
    
      /**
       * Convert a canvas element to ArrayBuffer containing a BMP file
       * with support for 32-bit (alpha).
       *
       * Note that CORS requirement must be fulfilled.
       *
       * @param {HTMLCanvasElement} canvas - the canvas element to convert
       * @return {ArrayBuffer}
       */
      toArrayBuffer: function(canvas) {
    
        var w = canvas.width,
            h = canvas.height,
            w4 = w * 4,
            idata = canvas.getContext("2d").getImageData(0, 0, w, h),
            data32 = new Uint32Array(idata.data.buffer), // 32-bit representation of canvas
    
            stride = Math.floor((32 * w + 31) / 32) * 4, // row length incl. padding
            pixelArraySize = stride * h,                 // total bitmap size
            fileLength = 122 + pixelArraySize,           // header size is known + bitmap
    
            file = new ArrayBuffer(fileLength),          // raw byte buffer (returned)
            view = new DataView(file),                   // handle endian, reg. width etc.
            pos = 0, x, y = 0, p, s = 0, a, v;
    
        // write file header
        setU16(0x4d42);          // BM
        setU32(fileLength);      // total length
        pos += 4;                // skip unused fields
        setU32(0x7a);            // offset to pixels
    
        // DIB header
        setU32(108);             // header size
        setU32(w);
        setU32(-h >>> 0);        // negative = top-to-bottom
        setU16(1);               // 1 plane
        setU16(32);              // 32-bits (RGBA)
        setU32(3);               // no compression (BI_BITFIELDS, 3)
        setU32(pixelArraySize);  // bitmap size incl. padding (stride x height)
        setU32(2835);            // pixels/meter h (~72 DPI x 39.3701 inch/m)
        setU32(2835);            // pixels/meter v
        pos += 8;                // skip color/important colors
        setU32(0xff0000);        // red channel mask
        setU32(0xff00);          // green channel mask
        setU32(0xff);            // blue channel mask
        setU32(0xff000000);      // alpha channel mask
        setU32(0x57696e20);      // " win" color space
    
        // bitmap data, change order of ABGR to BGRA
        while (y < h) {
          p = 0x7a + y * stride; // offset + stride x height
          x = 0;
          while (x < w4) {
            v = data32[s++];                     // get ABGR
            a = v >>> 24;                        // alpha channel
            view.setUint32(p + x, (v << 8) | a); // set BGRA
            x += 4;
          }
          y++
        }
    
        return file;
    
        // helper method to move current buffer position
        function setU16(data) {view.setUint16(pos, data, true); pos += 2}
        function setU32(data) {view.setUint32(pos, data, true); pos += 4}
      },
    
      /**
       * Converts a canvas to BMP file, returns a Blob representing the
       * file. This can be used with URL.createObjectURL().
       * Note that CORS requirement must be fulfilled.
       *
       * @param {HTMLCanvasElement} canvas - the canvas element to convert
       * @return {Blob}
       */
      toBlob: function(canvas) {
        return new Blob([this.toArrayBuffer(canvas)], {
          type: "image/bmp"
        });
      },
    
      /**
       * Converts the canvas to a data-URI representing a BMP file.
       * Note that CORS requirement must be fulfilled.
       *
       * @param canvas
       * @return {string}
       */
      toDataURL: function(canvas) {
        var buffer = new Uint8Array(this.toArrayBuffer(canvas)),
            bs = "", i = 0, l = buffer.length;
        while (i < l) bs += String.fromCharCode(buffer[i++]);
        return "data:image/bmp;base64," + btoa(bs);
      }
    };

var comp = new compressions();



