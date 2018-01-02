class baseComplexArray {
    constructor(other, arrayType = Float32Array) {
        if (other instanceof baseComplexArray) {
            // Copy constuctor.
            this.ArrayType = other.ArrayType;
            this.real = new this.ArrayType(other.real);
            this.imag = new this.ArrayType(other.imag);
        } else {
            this.ArrayType = arrayType;
            // other can be either an array or a number.
            this.real = new this.ArrayType(other);
            this.imag = new this.ArrayType(this.real.length);
        }

        this.length = this.real.length;
    }

    toString() {
        const components = [];

        this.forEach((value, i) => {
            components.push(
                `(${value.real.toFixed(2)}, ${value.imag.toFixed(2)})`
            );
        });

        return `[${components.join(', ')}]`;
    }

    forEach(iterator) {
        const n = this.length;
        // For gc efficiency, re-use a single object in the iterator.
        const value = Object.seal(Object.defineProperties({}, {
            real: { writable: true }, imag: { writable: true },
        }));

        for (let i = 0; i < n; i++) {
            value.real = this.real[i];
            value.imag = this.imag[i];
            iterator(value, i, n);
        }
    }

    // In-place mapper.
    map(mapper) {
        this.forEach((value, i, n) => {
            mapper(value, i, n);
            this.real[i] = value.real;
            this.imag[i] = value.imag;
        });

        return this;
    }

    conjugate() {
        return new baseComplexArray(this).map((value) => {
            value.imag *= -1;
        });
    }

    magnitude() {
        const mags = new this.ArrayType(this.length);

        this.forEach((value, i) => {
            mags[i] = Math.sqrt(value.real * value.real + value.imag * value.imag);
        })

        return mags;
    }
}


//-------   FFT   ----------------------------------//

const PI = Math.PI;
const SQRT1_2 = Math.SQRT1_2;

function FFT(input) {
    return ensureComplexArray(input).FFT();
};

function InvFFT(input) {
    return ensureComplexArray(input).InvFFT();
};

function frequencyMap(input, filterer) {
    return ensureComplexArray(input).frequencyMap(filterer);
};

class ComplexArray extends baseComplexArray {
    FFT() {
        return fft(this, false);
    }

    InvFFT() {
        return fft(this, true);
    }

    // Applies a frequency-space filter to input, and returns the real-space
    // filtered input.
    // filterer accepts freq, i, n and modifies freq.real and freq.imag.
    frequencyMap(filterer) {
        return this.FFT().map(filterer).InvFFT();
    }
}

function ensureComplexArray(input) {
    return input instanceof ComplexArray && input || new ComplexArray(input);
}

function fft(input, inverse) {
    const n = input.length;

    if (n & (n - 1)) {
        return FFT_Recursive(input, inverse);
    } else {
        return FFT_2_Iterative(input, inverse);
    }
}

function FFT_Recursive(input, inverse) {
    const n = input.length;

    if (n === 1) {
        return input;
    }

    const output = new ComplexArray(n, input.ArrayType);

    // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
    // recursive transforms optimally.
    const p = LowestOddFactor(n);
    const m = n / p;
    const normalisation = 1 / Math.sqrt(p);
    let recursive_result = new ComplexArray(m, input.ArrayType);

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for (let j = 0; j < p; j++) {
        for (let i = 0; i < m; i++) {
            recursive_result.real[i] = input.real[i * p + j];
            recursive_result.imag[i] = input.imag[i * p + j];
        }
        // Don't go deeper unless necessary to save allocs.
        if (m > 1) {
            recursive_result = fft(recursive_result, inverse);
        }

        const del_f_r = Math.cos(2 * PI * j / n);
        const del_f_i = (inverse ? -1 : 1) * Math.sin(2 * PI * j / n);
        let f_r = 1;
        let f_i = 0;

        for (let i = 0; i < n; i++) {
            const _real = recursive_result.real[i % m];
            const _imag = recursive_result.imag[i % m];

            output.real[i] += f_r * _real - f_i * _imag;
            output.imag[i] += f_r * _imag + f_i * _real;

            [f_r, f_i] = [
                f_r * del_f_r - f_i * del_f_i,
                f_i = f_r * del_f_i + f_i * del_f_r,
            ];
        }
    }

    // Copy back to input to match FFT_2_Iterative in-placeness
    // TODO: faster way of making this in-place?
    for (let i = 0; i < n; i++) {
        input.real[i] = normalisation * output.real[i];
        input.imag[i] = normalisation * output.imag[i];
    }

    return input;
}

function FFT_2_Iterative(input, inverse) {
    const n = input.length;

    const output = BitReverseComplexArray(input);
    const output_r = output.real;
    const output_i = output.imag;
    // Loops go like O(n log n):
    //   width ~ log n; i,j ~ n
    let width = 1;
    while (width < n) {
        const del_f_r = Math.cos(PI / width);
        const del_f_i = (inverse ? -1 : 1) * Math.sin(PI / width);
        for (let i = 0; i < n / (2 * width); i++) {
            let f_r = 1;
            let f_i = 0;
            for (let j = 0; j < width; j++) {
                const l_index = 2 * i * width + j;
                const r_index = l_index + width;

                const left_r = output_r[l_index];
                const left_i = output_i[l_index];
                const right_r = f_r * output_r[r_index] - f_i * output_i[r_index];
                const right_i = f_i * output_r[r_index] + f_r * output_i[r_index];

                output_r[l_index] = SQRT1_2 * (left_r + right_r);
                output_i[l_index] = SQRT1_2 * (left_i + right_i);
                output_r[r_index] = SQRT1_2 * (left_r - right_r);
                output_i[r_index] = SQRT1_2 * (left_i - right_i);

                [f_r, f_i] = [
                    f_r * del_f_r - f_i * del_f_i,
                    f_r * del_f_i + f_i * del_f_r,
                ];
            }
        }
        width <<= 1;
    }

    return output;
}

function BitReverseIndex(index, n) {
    let bitreversed_index = 0;

    while (n > 1) {
        bitreversed_index <<= 1;
        bitreversed_index += index & 1;
        index >>= 1;
        n >>= 1;
    }
    return bitreversed_index;
}

function BitReverseComplexArray(array) {
    const n = array.length;
    const flips = new Set();

    for (let i = 0; i < n; i++) {
        const r_i = BitReverseIndex(i, n);

        if (flips.has(i)) continue;

        [array.real[i], array.real[r_i]] = [array.real[r_i], array.real[i]];
        [array.imag[i], array.imag[r_i]] = [array.imag[r_i], array.imag[i]];

        flips.add(r_i);
    }

    return array;
}

function LowestOddFactor(n) {
    const sqrt_n = Math.sqrt(n);
    let factor = 3;

    while (factor <= sqrt_n) {
        if (n % factor === 0) return factor;
        factor += 2;
    }
    return n;
}






var FFTImageDataRGBA = function (data, nx, ny, ) {
    const rgb = splitRGB(data);

    return mergeRGB(
        FFT2D(new ComplexArray(rgb[0], Float32Array), nx, ny),
        FFT2D(new ComplexArray(rgb[1], Float32Array), nx, ny),
        FFT2D(new ComplexArray(rgb[2], Float32Array), nx, ny)
    );
};

var IFFTImageDataRGBA = function (real, imag, nx, ny, inverse) {
    const rgb = splitRGBComplex(real, imag);
    
    return mergeRGB(
        FFT2D(rgb[0], nx, ny, true),
        FFT2D(rgb[1], nx, ny, true),
        FFT2D(rgb[2], nx, ny, true)
    );
}

var FFTSimple = function(data, nx, ny, inverse) {
    return FFT2D(new ComplexArray(data), nx, ny, inverse)
}



function splitRGBComplex(real, imag) {
    const n = real.length / 4;
    const r = new Uint8ClampedArray(n);
    const g = new Uint8ClampedArray(n);
    const b = new Uint8ClampedArray(n);

    for (let i = 0; i < n; i++) {
        r[i] = real[4 * i];
        g[i] = real[4 * i + 1];
        b[i] = real[4 * i + 2];
    }

    let cr = new ComplexArray(r, Float32Array)
    let cg = new ComplexArray(g, Float32Array)
    let cb = new ComplexArray(b, Float32Array)

    for (let i = 0; i < n; i++) {
        r[i].imag = imag[4 * i];
        g[i].imag = imag[4 * i + 1];
        b[i].imag = imag[4 * i + 2];
    }

    return [cr, cg, cb];
}


function splitRGB(data) {
    const n = data.length / 4;
    const r = new Uint8ClampedArray(n);
    const g = new Uint8ClampedArray(n);
    const b = new Uint8ClampedArray(n);

    for (let i = 0; i < n; i++) {
        r[i] = data[4 * i];
        g[i] = data[4 * i + 1];
        b[i] = data[4 * i + 2];
    }

    return [r, g, b];
}

function mergeRGB(r, g, b) {
    const n = r.length;
    const output = new ComplexArray(n * 4);

    for (let i = 0; i < n; i++) {
        output.real[4 * i] = r.real[i];
        output.imag[4 * i] = r.imag[i];
        output.real[4 * i + 1] = g.real[i];
        output.imag[4 * i + 1] = g.imag[i];
        output.real[4 * i + 2] = b.real[i];
        output.imag[4 * i + 2] = b.imag[i];
    }

    return output;
}

function FFT2D(input, nx, ny, inverse) {
    const transform = inverse ? 'InvFFT' : 'FFT';
    const output = new ComplexArray(input.length, input.ArrayType);
    const row = new ComplexArray(nx, input.ArrayType);
    const col = new ComplexArray(ny, input.ArrayType);

    for (let j = 0; j < ny; j++) {
        row.map((v, i) => {
            v.real = input.real[i + j * nx];
            v.imag = input.imag[i + j * nx];
        });
        row[transform]().forEach((v, i) => {
            output.real[i + j * nx] = v.real;
            output.imag[i + j * nx] = v.imag;
        });
    }

    for (let i = 0; i < nx; i++) {
        col.map((v, j) => {
            v.real = output.real[i + j * nx];
            v.imag = output.imag[i + j * nx];
        });
        col[transform]().forEach((v, j) => {
            output.real[i + j * nx] = v.real;
            output.imag[i + j * nx] = v.imag;
        });
    }

    return output;
}

function shift(input, nx, ny) {
    let output = []

    for(let x=0; x<nx/2; x++){
        for(let y=0; y<ny/2; y++){
            let pos = ((x * ny) + y) * 4;
            let shift = (((x + parseInt(nx/2)) * ny) + (y + parseInt(ny/2))) * 4
            output[pos] = input[shift]
            output[pos+1] = input[shift+1]
            output[pos+2] = input[shift+2]
        }
    }
    for(let x=0; x<parseInt(nx/2); x++){
        for(let y=parseInt(ny/2); y<ny; y++){
            let pos = ((x * ny) + y) * 4;
            let shift = (((x + parseInt(nx/2)) * ny) + (y - parseInt(ny/2))) * 4
            output[pos] = input[shift]
            output[pos+1] = input[shift+1]
            output[pos+2] = input[shift+2]
        }
    }
    for(let x=parseInt(nx/2); x<nx; x++){
        for(let y=0; y<parseInt(ny/2); y++){
            let pos = ((x * ny) + y) * 4;
            let shift = (((x - parseInt(nx/2)) * ny) + (y + parseInt(ny/2))) * 4
            output[pos] = input[shift]
            output[pos+1] = input[shift+1]
            output[pos+2] = input[shift+2]
        }
    }
    for(let x=parseInt(nx/2); x<nx; x++){
        for(let y=parseInt(ny/2); y<ny; y++){
            let pos = ((x * ny) + y) * 4;
            let shift = (((x - parseInt(nx/2)) * ny) + (y - parseInt(ny/2))) * 4
            output[pos] = input[shift]
            output[pos+1] = input[shift+1]
            output[pos+2] = input[shift+2]
        }
    }

    return output
}





function fourier() { }

fourier.prototype.getPreview = function () {
    return this._preview;
}

fourier.prototype.set = function (preview) {
    this._preview = preview;
}

fourier.prototype.transformFFT = function () {
    preview = wave.getPreview();
    ctxt = canvas.getContext('2d');
    ctxt.drawImage(wave.getPreview(), 0, 0, preview.width, preview.height);
    var imgData = ctxt.getImageData(0, 0, preview.width, preview.height);

    let comp = []
    for(let i=0; i<imgData.data.length/4; i++) {
        comp[i] = imgData.data[i*4]
    }

    let data = FFTSimple(comp, preview.width, preview.height)//FFTImageDataRGBA(imgData.data, preview.width, preview.height)
    let mag = data.magnitude()
    let shifted = shift(mag, preview.height, preview.width)
    //DO SOMETHING
    //let disshifted = shift(shifted, preview.height, preview.width)
    let inverse = FFTSimple(data, preview.width, preview.height, true)

    for(let i=0; i<imgData.data.length; i+=4) {
        imgData.data[i] = mag[i/4]
        imgData.data[i+1] = mag[i/4]
        imgData.data[i+2] = mag[i/4]
    }

    canvasEdit.setImageData(imgData,preview.width,preview.height);
    ctxt.putImageData(imgData, 0, 0)
}

var fourier = new fourier();