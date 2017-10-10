function color() {}

color.prototype.getPreview = function(){
    return this._preview;
}

color.prototype.set = function(preview){
    this._preview = preview;
}

color.prototype.convertRGBandCMY = function(intensity){
	return 255 - intensity;
}

var col = new color();