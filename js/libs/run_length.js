function Run_length(){

}
Run_length.prototype.encode = function(input) {
    var encoding = [];
    var prev, count, i;
    var uint = new Uint8Array(input.length);
    var j =0;
    for (count = 1, prev = input[0], i = 1; i < input.length; i++) {
        if (input[i] != prev) {
    //         uint[j]=String(count).length;
    //         j++;
    //         for(k in String(count)){
    //             uint[j]=k;
    //             j++;
    //         }
    //         uint[j]=String(prev).length;
    //         j++;
    //         for(k in String(prev)){
    //             uint[j]=k;
    //             j++;
    //         }
    //         count = 1;
    //         prev = input[i];
    //     }
    //     else 
    //         count ++;
    // }            
    // uint[j]=String(count).length;
    // j++;
    // for(k in String(count)){
    //     uint[j]=k;
    //     j++;
    // }
    // uint[j]=String(prev).length;
    // j++;
    // for(k in String(prev)){
    //     uint[j]=k;
    //     j++;
    // }

        encoding.push([count, prev]);
        count = 1;
        prev = input[i];
    }
    else 
        count ++;
    }
    encoding.push([count, prev]);
    var encodeString = "";
    for(let i=0;i<encoding.length;i++){
        for(let j=0;j<encoding[i].length;j++){
            encodeString+=String(encoding[i][j])
        }
    }
    var uint = new Uint8Array(encodeString.length);
    for(let j=0;j<encodeString.length;j++){
        uint[j]=encodeString.charCodeAt(j);
    }
    return uint;
}
Run_length.prototype.decode = function(input) {
    var decoding = [];
    var prev, count, i;
    for(let i=0;i<input.length;i++){
        let valueArray = input[i];
        for(let j=0;j<valueArray[0];j++){
            decoding.push(valueArray[1]);
        }
    }
    return decoding;
}

var run = new Run_length();