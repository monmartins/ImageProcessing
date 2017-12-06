 function previewFile(photo){
    var widthDiv = document.getElementById("tam").offsetWidth;
    var heightDiv = document.getElementById("tam").offsetHeight;
    var preview = document.querySelector('img'); //selects the query named img
    var previewOri = document.getElementById('imgOri'); //selects the query named img
    image    = document.querySelector('input[type=file]').files[0]; //sames as here
    // imageOri    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();
    var readerOri  = new FileReader();

    reader.onloadend = function () {
        preview =document.createElement('img');
        preview.src = reader.result;
        preview.onload = function () {
            console.log(widthDiv)
            console.log(heightDiv)
            if(preview.width>widthDiv){
                // console.log("if")
                canvas.width = widthDiv;
                canvas.height = (preview.height * widthDiv) / preview.width;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,canvas.width, canvas.height );
                var canvasOri = document.getElementById("canvasOri");
                ctxt = canvasOri.getContext('2d');
                ctxt.drawImage(preview, canvas.width, 0,canvas.width, canvas.height );
            }else if(preview.height > heightDiv){
                // console.log("else if")
                canvas.width = (preview.width * heightDiv) / preview.height;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,canvas.width, canvas.height );
                var canvasOri = document.getElementById("canvasOri");
                ctxt = canvasOri.getContext('2d');
                ctxt.drawImage(preview, canvas.width, 0,canvas.width, canvas.height );
            }else{
                // console.log("else")
                canvas.width = preview.width;
                canvas.height= preview.height;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,canvas.width, canvas.height );
            }
            var canvasOri = document.getElementById("canvasOri");
            var ctx = canvasOri.getContext('2d');
            ctx.drawImage(preview, canvas.width, 0,canvas.width, canvas.height );
            preview.width = canvas.width;
            preview.height = canvas.height;
            photo.set(preview,canvas);
 
        }
    }
    readerOri.onloadend = function () {
        previewOri =document.createElement('img');
        previewOri.src = readerOri.result;
        previewOri.onload = function () {
            var canvasOri = document.getElementById("canvasOri");
            if(previewOri.width>widthDiv){
                // console.log("if")
                canvasOri.width = widthDiv;
                canvasOri.height = (previewOri.height * widthDiv) / previewOri.width;
                ctx = canvasOri.getContext('2d');
                ctx.drawImage(previewOri, 0, 0,canvasOri.width, canvasOri.height );
            }else if(previewOri.height > heightDiv){
                // console.log("else if")
                canvasOri.width = (previewOri.width * heightDiv) / previewOri.height;
                ctx = canvasOri.getContext('2d');
                ctx.drawImage(previewOri, 0, 0,canvas.width, canvas.height );
            }else{
                // console.log("else")
                canvasOri.width = previewOri.width;
                canvasOri.height= previewOri.height;
                var canvasOri = document.getElementById("canvasOri");
                ctx = canvasOri.getContext('2d');
                ctx.drawImage(previewOri, 0, 0,canvasOri.width, canvasOri.height );
            }
 
        }
    }

    if (image) {
        reader.readAsDataURL(image); //reads the data as a URL
        readerOri.readAsDataURL(image); //reads the data as a URL
    } else {
        preview.src = "";
    }
}
