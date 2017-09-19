function StringBit(string) {
    if(string.length<8){
        str = "";
        for (var i = string.length; i < 8; i++) {
            str = str + "0";
        }
        string = str + string;
    }
    this.value = string
}
StringBit.prototype.replaceAt=function(index, replacement) {
    this.value =  this.value.substr(0, this.value.length - index-1) + replacement+ this.value.substr(this.value.length - index-1 + replacement.length);
}
StringBit.prototype.bitSlicingLayer=function(index) {
    if (this.value.charAt(index) === "1") {
        this.value = "11111111";
    } else {
        this.value = "00000000";
    }
}