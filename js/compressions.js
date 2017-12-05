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

        let next_char = data[i].toString()
        if (next_char.length == 1)
            next_char = "00" + next_char
        if (next_char.length == 2)
            next_char = "0" + next_char

        if (Object.values(dict).indexOf(word + next_char) >= 0) {
            word += next_char
        } else {
            seq.push(Object.values(dict).indexOf(word))
            dict[next_id++] = word + next_char
            word = next_char
        }
    }
    seq.push(Object.values(dict).indexOf(word))

    return seq
}


compressions.prototype.lzw_decode = function () {
    let data = [3, 1, 4, 6, 5, 8, 3]
    let dict = {}
    for (let i = 0; i < 4; i++) {
        dict[i] = i.toString()
    }

    let seq = new Array()
    let next_code = data[0]
    seq.push(dict[next_code])
    let code = ""
    let next_id = 4
    for (let i = 1; i < data.length; i++) {
        code = next_code
        next_code = data[i]
        if (dict[next_code]) {
            seq.push(dict[next_code])
            let word = dict[code]
            let next_char = (dict[next_code]).charAt(0)
            dict[next_id++] = word + next_char
        } else {
            let word = dict[code]
            let next_char = (dict[code]).charAt(0)
            seq.push(word + next_char)
            dict[next_id++] = word + next_char
        }
    }

    console.log(Object.keys(dict))
    console.log(Object.values(dict))
    console.log(seq)

}

var comp = new compressions();



