 function previewFile(){
    var preview = document.querySelector('img'); //selects the query named img
    image    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview =document.createElement('img');
        preview.src = reader.result;
        photo.set(reader.result)
        preview.onload = function () {
            canvas.width = preview.width;
            canvas.height=preview.height;
            ctxt = canvas.getContext('2d');
            ctxt.drawImage(preview, 0, 0, preview.width, preview.height);
            var data = ctxt.getImageData(0, 0, preview.width, preview.height).data;
            var red = data[0],
            green = data[1],
            blue = data[2];
 
        }
    }

    if (image) {
        reader.readAsDataURL(image); //reads the data as a URL
    } else {
        preview.src = "";
    }
}
