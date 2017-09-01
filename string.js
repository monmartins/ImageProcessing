function String(string) {
    if(string.length<8){
        keep = string
        string = new Array(8 - string.length).join( "0" );
        string = string + keep
    }
    this.value = string
}
String.prototype.replaceAt=function(index, replacement) {
    this.value =  this.value.substr(0, this.value.length - index-1) + replacement+ this.value.substr(this.value.length - index-1 + replacement.length);
}
String.prototype.bitSlicingLayer=function(index) {
    var keepValue = this.value[index]
    var first = new Array(this.value.length - index).join( "0" );
    var last = new Array( index + 1).join( "0" );
    this.value = first + keepValue + last
}