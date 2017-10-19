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
	R = R/255;
	G = G/255;
	B = B/255;

	let H;
	let S;
	let I = (R + G + B) / 3;
	if (R == G && G == B){
		H = 0;
		S = 0;
	} else {
		let w = 0.5*(R+G+B) / Math.pow(((R-G)*(R-G) + (R-B)*(G-B)),0.5);
		if (w > 1)
			w = 1;
		if (w < -1)
			w = -1;
		H = Math.acos(w);
		//H = H * (180 / Math.PI);
		if (B > G)
			H = 2*Math.PI - H;
		let S = 1 - (3 / (R + G + B + 0.00001)) * Math.min(R, G, B);	
	}

	return [H, S, I];
}

color.prototype.HSItoRGB = function(H, S, I){
	let R;
	let G;
	let B;

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

	return [R*255, G*255, B*255];

}

var col = new color();