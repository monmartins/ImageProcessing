Array.prototype.max = function() {
return Math.max.apply(null, this);
};

Array.prototype.min = function() {
return Math.min.apply(null, this);
};

Array.prototype.range = function() {
    return arr.max(this) - arr.min(this);
};
Array.prototype.midrange = function() {
    return arr.range(this) / 2;
};
Array.prototype.sum = function() {
    var num = 0;
    for (var i = 0, l = this.length; i < l; i++) num += this[i];
    return num;
};

Array.prototype.mean = function() {
    return this.sum() / this.length;
};


Array.prototype.modes = function() {
    if (!this.length) return [];
    var modeMap = {},
        maxCount = 0,
        modes = [];

    this.forEach(function(val) {
        if (!modeMap[val]) modeMap[val] = 1;
        else modeMap[val]++;

        if (modeMap[val] > maxCount) {
            modes = [val];
            maxCount = modeMap[val];
        }
        else if (modeMap[val] === maxCount) {
            modes.push(val);
            maxCount = modeMap[val];
        }
    });
    return modes;
};

Array.prototype.variance = function() {
    var mean = this.mean(this);
    var array = new Array(0);
    for(i=0;i<this.length;i++){
        array.push(Math.pow((this[i] - mean),2));
    }
    return array.mean();
};

Array.prototype.standardDeviation = function() {
    return Math.sqrt(arr.variance(this));
};

Array.prototype.meanAbsoluteDeviation = function() {
    var mean = arr.mean(this);
    return arr.mean(this.map(function(num) {
        return Math.abs(num - mean);
    }));
};

Array.prototype.zScores = function() {
    var mean = arr.mean(this);
    var standardDeviation = arr.standardDeviation(this);
    return this.map(function(num) {
        return (num - mean) / standardDeviation;
    });
};