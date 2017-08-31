function String(string) {
    this.value = string
}
String.prototype.replaceAt=function(index, replacement) {
    this.value =  this.value.substr(0, this.value.length - index-1) + replacement+ this.value.substr(this.value.length - index-1 + replacement.length);
}