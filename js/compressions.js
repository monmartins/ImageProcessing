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
    console.log(r.length);
    var run_lengthR = run.encode(r);
    console.log(run_lengthR);
    console.log((run_lengthR).length);       
    var file= run_lengthR;

    var data = new Blob([file]);
    var r2 = document.getElementById("r2");
    r2.href = URL.createObjectURL(data);
    ctxt.putImageData(imgData, 0, 0);
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
    let dict = {}
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
    var objdict = Object.values(dict);
    
    for (let i = 0; i < data.length; i++) {
        let next_char = data[i]

        if (next_char.length == 1)
            next_char = "00" + next_char
        if (next_char.length == 2)
            next_char = "0" + next_char

        if (objdict.indexOf(word + next_char) >= 0) {
            word += next_char
        } else {
            seq.push(objdict.indexOf(word))
            dict[next_id++] = word + next_char
            word = next_char
        }
    }
    seq.push(objdict.indexOf(word))
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
    console.log("r_seq")
    console.log(r_seq)
    g_seq = comp.lzw_encode(g)
    console.log("g_seq")
    console.log(g_seq)
    b_seq = comp.lzw_encode(b)
    console.log("b_seq")
    console.log(b_seq)

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
    var a2 = document.getElementById("a2");
    a2.href = URL.createObjectURL(data);

    ctxt.putImageData(imgData, 0, 0);
}

compressions.prototype.fileHuffmanLzw = function () {
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



