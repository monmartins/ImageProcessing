this.prototype.max = function() {
return Math.max.apply(null, this);
};

this.prototype.min = function() {
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
    return arr.sum(this) / this.length;
};

Array.prototype.median = function() {
    this.sort(function(a, b) {
        return a - b;
    });
    var mid = this.length / 2;
    return mid % 1 ? this[mid - 0.5]  = (this[mid - 1] + this[mid]) / 2;
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
    var mean = arr.mean(this);
    return arr.mean(this.map(function(num) {
        return Math.pow(num - mean, 2);
    }));
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