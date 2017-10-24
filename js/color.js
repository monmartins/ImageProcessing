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

	/*let r = R/255;
	let g = G/255;
	let b = B/255;

	let H = 0;
	let S = 0;
	let I = (r+g+b)/3;
	
	let w = (0.5*((r-g)+(r-b))) / Math.pow((Math.pow(r-g, 2) + (r-b)*(g-b)),1/2)
	if (w > 1){
		w = 1;
	}
	if (w < -1){
		w = -1;
	}
	H = Math.acos(w);
	if (b > g){
		H = 2*3.1415 - H;
	} 
	S = 1 - (3 * Math.min(r, g, b) / (r + g + b + 0.00001)) ;	

	return [H, S, I];*/
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
	/*let R = 0;
	let G = 0;
	let B = 0;

	if (S > 1)
		S = 1;
	if (I > 1)
		I = 1;
	if (S == 0) {
		R = I;
		G = I;
		B = I;
	} else {
		if ((H >= 0) && (H < 2*Math.PI/3)) {
			B = (1 - S) / 3;
			R = (1 + S * Math.cos(H) / Math.cos(Math.PI/3 - H))/3;
			G = 1 - R - B;
		} else if ((H >= 2*Math.PI/3) && (H < 4*Math.PI/3)) {
			H = H - 2 * Math.PI / 3;
			R = (1 - S) / 3;
			G = (1 + S * Math.cos(H) / Math.cos(Math.PI/3 - H))/3;
			B = 1 - R - G;
		} else if ((H >= 4*Math.PI/3) && (H < 2*Math.PI)) {
			H = H - 4 * Math.PI / 3;
			G = (1 - S) / 3;
			B = (1 + S * Math.cos(H) / Math.cos(Math.PI/3 - H))/3;
			R = 1 - B - G;
		}

		if (R < 0) R = 0; if (G < 0) G = 0;	if (B < 0) B = 0;

		R = 3*I*R; G = 3*I*G; B = 3*I*B;

		if (R > 1) R = 1; if (G > 1) G = 1;	if (B > 1) B = 1;
	}

	return [R*255, G*255, B*255];*/

}

var col = new color();