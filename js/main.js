 function previewFile(photo){
    var widthDiv = document.getElementById('mid').offsetWidth;
    var heightDiv = document.getElementById('mid').offsetHeight;
    var preview = document.querySelector('img'); //selects the query named img
    image    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview =document.createElement('img');
        preview.src = reader.result;
        preview.onload = function () {
            if(preview.width>widthDiv){
                console.log("if")
                canvas.width = widthDiv;
                canvas.height = (preview.height * widthDiv) / preview.width;
                console.log(canvas.width)
                console.log(canvas.height)
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,canvas.width, canvas.height );
            }else if(preview.height > heightDiv){
                console.log("else if")
                canvas.width = (preview.width * heightDiv) / preview.height;
                canvas.height= heightDiv;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,canvas.width, canvas.height );
            }else{
                console.log("else")
                canvas.width = preview.width;
                canvas.height= preview.height;
                ctxt = canvas.getContext('2d');
                ctxt.drawImage(preview, 0, 0,preview.width, preview.height );    
            }
            preview.width = canvas.width;
            preview.height = canvas.height;
            console.log(canvas.width)
            console.log(canvas.height)
            photo.set(preview);
 
        }
    }

    if (image) {
        reader.readAsDataURL(image); //reads the data as a URL
    } else {
        preview.src = "";
    }
}
