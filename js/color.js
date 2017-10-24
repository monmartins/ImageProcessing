function color() {}

color.prototype.getPreview = function(){
    return this._preview;
}

color.prototype.set = function(preview){
    this._preview = preview;
}

color.prototype.RGBtoCMY = function(R, G, B){
	let C = 255 - R;
	let M = 255 - G;
	let Y = 255 - B;
	return [C, M, Y];
}

color.prototype.CMYtoRGB = function(C, M, Y){
	let R = 255 - C;
	let G = 255 - M;
	let B = 255 - Y;
	return [R, G, B];
}

color.prototype.RGBtoHSI = function(R, G, B){
	let r = R/255
	let g = G/255
	let b = B/255
	let max = Math.max(r,g,b)
	if(max==0)
		max = 0.0001
	let min = Math.min(r,g,b)
	let H = 0
	let S = 0
	let I = max

	if((max==r)&&(g>=b))
		H = 60*(g-b)/(max-min)
	if((max==r)&&(g<b))
		H = 60*(g-b)/(max-min) + 360
	if(max==g)
		H = 60*(b-r)/(max-min) + 120
	if(max==b)
		H = 60*(r-g)/(max-min) + 240

	S = (max-min)/max

	return [H, S, I]
}

color.prototype.HSItoRGB = function(H, S, I){
	let R = 0;
	let G = 0;
	let B = 0;
	if(S==0){
		R = I
		G = I
		B = I
	}else{
		let Hi = Math.floor(H/60)%6
		let f = (H/60)-Hi
		let p = I*(1-S)
		let q = I*(1-(f*S))
		let t = I*(1-((1-f)*S))
		if(Hi==0){
			R = I
			G = t
			B = p
		}
		if(Hi==1){
			R = q
			G = I
			B = p
		}
		if(Hi==2){
			R = p
			G = I
			B = t
		}
		if(Hi==3){
			R = p
			G = q
			B = I
		}
		if(Hi==4){
			R = t
			G = p
			B = I
		}
		if(Hi==5){
			R = I
			G = p
			B = q
		}
	}
	return [R*255, G*255, B*255]
}

var col = new color();