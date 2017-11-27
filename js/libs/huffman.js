var Huffman;
Huffman = {
  treeFromImage: function(imageData) {
    var builder;
    builder = new Huffman.TreeBuilder(imageData);
    return builder.build();
  }
};
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