function restoration(){
}
restoration.prototype.getPreview = function(){
    return this._preview;
}
restoration.prototype.set = function(preview){
    this._preview = preview;
}
restoration.prototype.aritmeticMean= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = intensity * factor;
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
    
}

restoration.prototype.geometricMean= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity *= average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,factor);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
    
}

restoration.prototype.harmonic= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = (n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += 1/(average * matrix[x][y]);
                }
            }
            intensity = factor/intensity;
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
    
}


restoration.prototype.contraharmonic= function(xy,q){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
    
}

restoration.prototype.median= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = intensity/(n*m)
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}
restoration.prototype.maxandmin= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}
restoration.prototype.midpoint= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}
restoration.prototype.alphaTrimmed= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}
restoration.prototype.adaptiveLocal= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}
restoration.prototype.adaptiveMedian= function(xy){
    n = parseInt(xy.split(',')[0].split('(')[1])
    m = parseInt(xy.split(',')[1].split(')')[0])
    factor = 1/(n*m)
    var matrix = [];
    for(var i=0; i<n; i++) {
        matrix[i] = [];
        for(var j=0; j<m; j++) {
            matrix[i][j] = 1;
        }
    }
    nn = Math.round(Math.sqrt(n));
    nm = Math.round(Math.sqrt(m));
    preview = rest.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(conv.getPreview(), 0 , 0,preview.width, preview.height );
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);


    var auxData = new Array(imgData.data.length);
    for(var i=nn; i<preview.height-nn; i++) {
        for(var j=nm; j<preview.width-nm; j++) {
            var intensity = 0;
            for(var x=0; x<n; x++) {
                for(var y=0; y<m; y++) {
                    var relativePos = (((i+x-nn) * preview.width) + (j+y-nm)) * 4;
                    var average = parseInt((imgData.data[relativePos] + imgData.data[relativePos+1] + imgData.data[relativePos+2])/3);
                    intensity += average * matrix[x][y];
                }
            }
            intensity = Math.pow(intensity,q+1)/Math.pow(intensity,q);
            var pos = ((i * preview.width) + j) * 4;
            auxData[pos] = intensity;
            auxData[pos+1] = intensity;
            auxData[pos+2] = intensity;
            auxData[pos+3] = imgData.data[pos+3];
        }
    }

    for(var i=1; i<preview.height-1; i++) {
        for(var j=1; j<preview.width-1; j++) {
            var pos = ((i * preview.width) + j) * 4;
            imgData.data[pos] = auxData[pos];
            imgData.data[pos+1] = auxData[pos+1];
            imgData.data[pos+2] = auxData[pos+2];
        }
    }

    ctxt.putImageData(imgData,0,0);
}


var rest = new restoration();