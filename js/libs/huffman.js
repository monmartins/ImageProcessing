var Huffman;
Huffman = {
  treeFromImage: function(imageData) {
    var builder;
    builder = new Huffman.TreeBuilder(imageData);
    return builder.build();
  }
};
// Huffman.DataImage =function(){}
Huffman.CoreHelpers = {
    isArray: function(obj) {
      return !!(obj && obj.constructor === Array);
    },
    lpad: function(string, length) {
      length = length || 8;
      while (string.length < length) {
        string = "0" + string;
      }
      return string;
    }
  };
Huffman.Tree = function(_a) {
    this.root = _a;
    this.root = this.root || new Huffman.Tree.Node();
    return this;
};
Huffman.Tree.prototype.encode = function(imageData) {
    return this.bitStringToString(this.encodeBitString(imageData));
  };
  Huffman.Tree.prototype.decode = function(text) {
    var _a, _b, _c, bitString, d, decoded, direction, node;
    bitString = this.stringToBitString(text);
    decoded = [];
    node = this.root;
    _b = bitString.split('');
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      direction = _b[_a];
      d = direction === '0' ? 'left' : 'right';
      node = node[d];
      if (node.isLeaf()) {
        decoded.push(parseInt(node.value));
        node = this.root;
      }
    }
    return decoded;
  };
  Huffman.Tree.prototype.encodeBitString = function(imageData) {
    var _a, _b, _c, chr, encoded;
    encoded = "";
    _b = imageData;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      pxl = _b[_a];
      encoded += this.bitValue(pxl);
    }
    return encoded;
  };
  Huffman.Tree.prototype.bitStringToString = function(bitString) {
    var _a, _b, encoded, i, padByte;
    padByte = 8 - bitString.length % 8;
    for (i = 0; (0 <= padByte ? i < padByte : i > padByte); (0 <= padByte ? i += 1 : i -= 1)) {
      bitString += "0";
    }
    encoded = (function() {
      _a = []; _b = bitString.length;
      for (i = 0; (0 <= _b ? i < _b : i > _b); i += 8) {
        _a.push(String.fromCharCode(parseInt(bitString.substr(i, 8), 2)));
      }
      return _a;
    })();
    return encoded.join('') + padByte.toString();
  };
  Huffman.Tree.prototype.stringToBitString = function(bitString) {
    var _a, _b, _c, _d, chr, pad, pieces;
    pieces = bitString.split('');
    pad = parseInt(pieces.pop());
    pieces = (function() {
      _a = []; _c = pieces;
      for (_b = 0, _d = _c.length; _b < _d; _b++) {
        chr = _c[_b];
        _a.push(Huffman.CoreHelpers.lpad(chr.charCodeAt(0).toString(2)));
      }
      return _a;
    })();
    pieces = pieces.join('');
    return pieces.substr(0, pieces.length - pad);
  };
  Huffman.Tree.prototype.bitValue = function(chr) {
    var _a;
    if (!((typeof (_a = this.leafCache) !== "undefined" && _a !== null))) {
      this.generateLeafCache();
    }
    return this.leafCache[chr];
  };
  Huffman.Tree.prototype.generateLeafCache = function(node, path) {
    this.leafCache = (typeof this.leafCache !== "undefined" && this.leafCache !== null) ? this.leafCache : {};
    node = node || this.root;
    path = path || "";
    if (node.isLeaf()) {
      return (this.leafCache[node.value] = path);
    } else {
      this.generateLeafCache(node.left, path + "0");
      return this.generateLeafCache(node.right, path + "1");
    }
  };
  Huffman.Tree.prototype.encodeTree = function() {
    return this.root.encode();
  };
  Huffman.Tree.decodeTree = function(data) {
    return new Huffman.Tree(Huffman.Tree.parseNode(data));
  };
  Huffman.Tree.parseNode = function(data) {
    var node;
    node = new Huffman.Tree.Node();
    if (Huffman.CoreHelpers.isArray(data)) {
      node.left = Huffman.Tree.parseNode(data[0]);
      node.right = Huffman.Tree.parseNode(data[1]);
    } else {
      node.value = data;
    }
    return node;
  };
  Huffman.Tree.Node = function() {
    this.left = (this.right = (this.value = null));
    return this;
  };
  Huffman.Tree.Node.prototype.isLeaf = function() {
    return (this.left === this.right) && (this.right === null);
  };
  Huffman.Tree.Node.prototype.encode = function() {
    return this.value ? this.value : [this.left.encode(), this.right.encode()];
  };



  var __hasProp = Object.prototype.hasOwnProperty;
  Huffman.TreeBuilder = function(_a) {
    this.ImageData = _a;
    return this;
  };
  Huffman.TreeBuilder.prototype.build = function() {
    var combinedList, frequencyTable;
    frequencyTable = this.buildFrequencyTable();
    combinedList = this.combineTable(frequencyTable);
    return Huffman.Tree.decodeTree(this.compressCombinedTable(combinedList));
  };
  Huffman.TreeBuilder.prototype.buildFrequencyTable = function() {
    var _a, _b, _c, _d, chr, frequency, table, tableHash;
    tableHash = {};
    _b = this.ImageData;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      pxl = _b[_a];
      tableHash[pxl] = (typeof tableHash[pxl] !== "undefined" && tableHash[pxl] !== null) ? tableHash[pxl] : 0;
      tableHash[pxl] += 1;
    }
    table = [];
    _d = tableHash;
    for (pxl in _d) {
      if (!__hasProp.call(_d, pxl)) continue;
      frequency = _d[pxl];
      table.push([frequency, pxl]);
    }
    table.sort(this.frequencySorter);
    return table;
  };
  Huffman.TreeBuilder.prototype.frequencySorter = function(a, b) {
    return a[0] > b[0] ? 1 : (a[0] < b[0] ? -1 : 0);
  };
  Huffman.TreeBuilder.prototype.combineTable = function(table) {
    var first, second;
    while (table.length > 1) {
      first = table.shift();
      second = table.shift();
      table.push([first[0] + second[0], [first, second]]);
      table.sort(this.frequencySorter);
    }
    return table[0];
  };
  Huffman.TreeBuilder.prototype.compressCombinedTable = function(table) {
    var value;
    value = table[1];
    return Huffman.CoreHelpers.isArray(value) ? [this.compressCombinedTable(value[0]), this.compressCombinedTable(value[1])] : value;
  };



  Huffman.parseDataToUint8array = function(width,
                                    height,
                                    huffmanR,
                                    huffmanG,
                                    huffmanB,
                                    huffmanRencode,
                                    huffmanGencode,
                                    huffmanBencode){
        var prewviewWidth = String(width).length;
        var prewviewHeight = String(height).length;
        var huffmanRLength = String((JSON.stringify(huffmanR).length));
        var huffmanGLength = String((JSON.stringify(huffmanG).length));
        var huffmanBLength = String((JSON.stringify(huffmanB).length));
        var huffmanRencodeLength = String((huffmanRencode.length));
        var huffmanGencodeLength = String((huffmanGencode.length));
        var huffmanBencodeLength = String((huffmanBencode.length));
        var uint = new Uint8Array(11+ //Itens in uint
            prewviewWidth+
            prewviewHeight+
            (JSON.stringify(huffmanR).length)+
            (JSON.stringify(huffmanG).length)+
            (JSON.stringify(huffmanB).length)+
            huffmanRencode.length+
            huffmanGencode.length+
            huffmanBencode.length+
            huffmanRLength.length+
            huffmanGLength.length+
            huffmanBLength.length+
            huffmanRencodeLength.length+
            huffmanGencodeLength.length+
            huffmanBencodeLength.length+
            String(huffmanRencode.length).length+
            String(huffmanGencode.length).length+
            String(huffmanBencode.length).length);
        var indexuint = 0;
        uint[indexuint]=prewviewWidth;
        indexuint++;
        for(i=0;i<prewviewWidth;i++){
            let value = String(width)[i];
            uint[indexuint]=value;
            indexuint++;
        }
       uint[indexuint]=prewviewHeight;
        indexuint++;
        for(i=0;i<prewviewHeight;i++){
            let value = String(height)[i];
            uint[indexuint]=value;
            indexuint++;
        }
       uint[indexuint]=huffmanRLength.length;
        indexuint++;
        for(i=0;i<huffmanRLength.length;i++){
            let value = huffmanRLength[i]
            uint[indexuint]=value;
            indexuint++;
        }
       uint[indexuint]=huffmanGLength.length;
        indexuint++;
        for(i=0;i<huffmanGLength.length;i++){
            let value = huffmanGLength[i]
            uint[indexuint]=value;
            indexuint++;
        }
       uint[indexuint]=huffmanBLength.length;
        indexuint++;
        for(i=0;i<huffmanBLength.length;i++){
            let value = huffmanBLength[i];
            uint[indexuint]=value;
            indexuint++;
        }

       uint[indexuint]=huffmanRencodeLength.length;
        indexuint++;
        for(i=0;i<huffmanRencodeLength.length;i++){
            let value = huffmanRencodeLength[i]
            uint[indexuint]=value;
            indexuint++;
        }
       
        uint[indexuint]=huffmanGencodeLength.length;
        indexuint++;
        for(i=0;i<huffmanGencodeLength.length;i++){
            let value = huffmanGencodeLength[i]
            uint[indexuint]=value;
            indexuint++;
        }
       
        uint[indexuint]=huffmanBencodeLength.length;
        indexuint++;
        for(i=0;i<huffmanBencodeLength.length;i++){
            let value = huffmanBencodeLength[i]
            uint[indexuint]=value;
            indexuint++;
        }
       
        for(let i=0;i < JSON.stringify(huffmanR).length;i++){
            uint[indexuint]=JSON.stringify(huffmanR).charCodeAt(i);
            indexuint += 1;
        }
       for(let i=0;i < JSON.stringify(huffmanG).length;i++){
            uint[indexuint]=JSON.stringify(huffmanG).charCodeAt(i);
            indexuint += 1;
        }
       for(let i=0;i < JSON.stringify(huffmanB).length;i++){
            uint[indexuint]=JSON.stringify(huffmanB).charCodeAt(i);
            indexuint += 1;
        }
       
        //Length of HuffRencode
        uint[indexuint]=String(huffmanRencode.length).length;
        indexuint++;
        for(i=0;i<String(huffmanRencode.length).length;i++){
            let value = String(huffmanRencode.length)[i]
            uint[indexuint]=value;
            indexuint++;
        }
       
        //
        uint[indexuint]=String(huffmanGencode.length).length;
        indexuint++;
        for(i=0;i<String(huffmanGencode.length).length;i++){
            let value = String(huffmanGencode.length)[i]
            uint[indexuint]=value;
            indexuint++;
        }
       //
        uint[indexuint]=String(huffmanBencode.length).length;
        indexuint++;
        for(i=0;i<String(huffmanBencode.length).length;i++){
            let value = String(huffmanBencode.length)[i]
            uint[indexuint]=value;
            indexuint++;
        }
       for(let i=0;i < (huffmanRencode.length);i++){
            uint[indexuint]=huffmanRencode.charCodeAt(i);
            indexuint += 1;
        }
       for(let i=0;i < (huffmanGencode.length);i++){
            uint[indexuint]=huffmanGencode.charCodeAt(i);
            indexuint += 1;
        }
       
        for(let i=0;i < huffmanBencode.length;i++){
            uint[indexuint]=huffmanBencode.charCodeAt(i);
            indexuint += 1;
        }
       

        return uint;
    }


    Huffman.parseUint8arrayToData = function(uint){
        var image = {};
        var indexuint = 0;
        var prewviewWidth = uint[indexuint];
        indexuint++;
        var width = "";
        for(i=0;i<prewviewWidth;i++){
            width += uint[indexuint];
            indexuint++
        }
        width = Number(width);
        //
        var prewviewHeight = uint[indexuint];
        indexuint++;
        var height = "";
        for(i=0;i<prewviewWidth;i++){
            height += uint[indexuint];
            indexuint++
        }
        height = Number(height);
        //
        var huffmanRLengthArray = uint[indexuint];
        indexuint++;
        var huffmanRLength= "";
        for(i=0;i<huffmanRLengthArray;i++){
            let value = uint[indexuint]
            huffmanRLength+=(value);
            indexuint++;
        }

        //
        var huffmanGLengthArray = uint[indexuint];
        indexuint++;
        var huffmanGLength= "";
        for(i=0;i<huffmanGLengthArray;i++){
            let value = uint[indexuint]
            huffmanGLength+=(value);
            indexuint++;
        }
        //
        var huffmanBLengthArray = uint[indexuint];
        indexuint++;
        var huffmanBLength= "";
        for(i=0;i<huffmanBLengthArray;i++){
            let value = uint[indexuint]
            huffmanBLength+=(value);
            indexuint++;
        }
        //
        var huffmanREncodeLengthArray = uint[indexuint];
        indexuint++;
        var huffmanREncodeLength= "";
        for(i=0;i<parseInt(huffmanREncodeLengthArray);i++){
            let value = uint[indexuint]
            huffmanREncodeLength+=(value);
            indexuint++;
        }
        //
        var huffmanGEncodeLengthArray = uint[indexuint];
        indexuint++;
        var huffmanGEncodeLength= "";
        for(i=0;i<huffmanGEncodeLengthArray;i++){
            let value = uint[indexuint]
            huffmanGEncodeLength+=(value);
            indexuint++;
        }
        //
        var huffmanBEncodeLengthArray = uint[indexuint];
        indexuint++;
        var huffmanBEncodeLength= "";
        for(i=0;i<huffmanBEncodeLengthArray;i++){
            let value = uint[indexuint]
            huffmanBEncodeLength+=(value);
            indexuint++;
        }
        
        //
        var huffmanRTree = "";
        for(i=0;i<parseInt(huffmanRLength);i++){
            let value = uint[indexuint]
            huffmanRTree+=String.fromCharCode(value);
            indexuint++;
        }
        //
        var huffmanGTree = "";
        for(i=0;i<parseInt(huffmanGLength);i++){
            let value = uint[indexuint]
            huffmanGTree+=String.fromCharCode(value);
            indexuint++;
        }
        //
        var huffmanBTree = "";
        for(i=0;i<parseInt(huffmanBLength);i++){
            let value = uint[indexuint]
            huffmanBTree+=String.fromCharCode(value);
            indexuint++;
        }
        
        var HuffmanRencodelengthLength = uint[indexuint];
        var HuffmanRencodelength = "";
        indexuint++;
        for(i=0;i<parseInt(HuffmanRencodelengthLength);i++){
            let value = uint[indexuint];
            HuffmanRencodelength +=value;
            indexuint++;
        }
        
        var HuffmanGencodelengthLength = uint[indexuint];
        var HuffmanGencodelength = "";
        indexuint++;
        for(i=0;i<parseInt(HuffmanGencodelengthLength);i++){
            let value = uint[indexuint];
            HuffmanGencodelength +=value;
            indexuint++;
        }
        
        var HuffmanBencodelengthLength = uint[indexuint];
        var HuffmanBencodelength = "";
        indexuint++;
        for(i=0;i<parseInt(HuffmanBencodelengthLength);i++){
            let value = uint[indexuint];
            HuffmanBencodelength +=value;
            indexuint++;
        }
        //
        var huffmanREncode = "";
        for(i=0;i<parseInt(HuffmanRencodelength);i++){
            let value = uint[indexuint]
            huffmanREncode+=String.fromCharCode(value);
            indexuint++;
        }
        //
        var huffmanGEncode = "";
        for(i=0;i<parseInt(HuffmanGencodelength);i++){
            let value = uint[indexuint]
            huffmanGEncode+=String.fromCharCode(value);
            indexuint++;
        }
        //
        var huffmanBEncode = "";
        for(i=0;i<parseInt(HuffmanBencodelength);i++){
            let value = uint[indexuint]
            huffmanBEncode+=String.fromCharCode(value);
            indexuint++;
        }


        

        image.width = width;
        image.height = height;
        image.huffmanR = huffmanRLength;
        image.huffmanG = huffmanGLength;
        image.huffmanB = huffmanBLength;
        image.huffmanRTree = huffmanRTree;
        image.huffmanGTree = huffmanGTree;
        image.huffmanBTree = huffmanBTree;
        image.huffmanREncodeLength = huffmanREncodeLength;
        image.huffmanGEncodeLength = huffmanGEncodeLength;
        image.huffmanBEncodeLength = huffmanBEncodeLength;
        image.huffmanREncode = huffmanREncode;
        image.huffmanGEncode = huffmanGEncode;
        image.huffmanBEncode = huffmanBEncode;
        return image;

    }