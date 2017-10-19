function processingcolors() {}

processingcolors.prototype.getPreview = function(){
    return this._preview;
}

processingcolors.prototype.set = function(preview){
    this._preview = preview;
}
processingcolors.prototype.brightness = function(bright){
    
}


var proccol = new processingcolors();