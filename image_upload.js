const dropArea = document.querySelector('.place-holder'),
    imgPreview = document.querySelector('#preview-img'),
    dropAreaText = document.querySelector('.upload-section-header'),
    uploadBtn = document.querySelector('#upload-btn'),
    inputBtn = document.querySelector('#chooseFile-btn'),
    previewImg = document.querySelector('#preview-img'),
    submitBtn = document.querySelector('#submit-btn');

let file;

//input btn hidden; alias btn setup
uploadBtn.addEventListener('click', () => {
    if (inputBtn)
        inputBtn.click();
})

//When img is received, display in the preview
inputBtn.addEventListener('change', () => {
    file = inputBtn.files[0];
    console.log(file)
    displayImage();
    dropArea.classList.add('active')
    submitBtn.style.display = 'block';
})

//When img is drag over the preview box, react to the event
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('active');
    dropAreaText.textContent = "Release to upload";
})

//When img has left the preview box, react to the event
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
    dropAreaText.textContent = "Drag & Drop to Upload File";
})

//When img is drop on the preview box, display in the preview
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();

    //Always select the 1st file, if user selects mutiple
    file = e.dataTransfer.files[0];
    displayImage();
    console.log(file);
})

function displayImage() {
    //Retrieve file type
    let fileType = file.type;

    //Define what file types are valid
    let validTypes = ["image/jpg", "image/jpeg", "image/png"];

    //Check if the file type is within the defined valid file types
    if (validTypes.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            console.log(fileURL);
            imgPreview.src = fileURL;
        }
        fileReader.readAsDataURL(file);

    } else {
        alert('Invalid File Type');
        dropArea.classList.remove('active');
    }
}