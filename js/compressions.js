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

var comp = new compressions();



