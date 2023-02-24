const dropArea = document.querySelector('.place-holder'),
    imgPreview = document.querySelector('#preview-img'),
    dropAreaText = document.querySelector('.upload-section-header'),
    uploadBtn = document.querySelector('#upload-btn'),
    inputBtn = document.querySelector('#chooseFile-btn'),
    previewImg = document.querySelector('#preview-img'),
    submitBtn = document.querySelector('#submit-btn'),
    resultImg = document.querySelector('#result-img'),
    spinners = document.querySelectorAll('.spinner'),
    resultHolder = document.querySelector('#analysed-results');

let file;
let fileURL;
let fileName;
let validTypes = ["image/jpg", "image/jpeg", "image/png", "image/JPEG", "image/HEIF"];
let analyseURL = 'https://gc6qq4wfde.execute-api.ap-southeast-2.amazonaws.com/prod';
let cache = {}; //Store the analysis response

//input btn hidden; alias btn setup
uploadBtn.addEventListener('click', () => {
    if (inputBtn)
        inputBtn.click();
})

//When img is received, display in the preview
inputBtn.addEventListener('change', () => {
    if (inputBtn.files[0].size > 5097152) {
        alert("Error: File size limite exceeded 7MB")
        inputBtn.value = "";
    } else if (!validateFileType(inputBtn.files[0].type)) {
        alert("Error: Invalid File Type")
        inputBtn.value = "";
    } else {
        file = inputBtn.files[0];
        fileName = inputBtn.files[0].name;
        // console.log(file)
        displayImage();
        dropArea.classList.add('active')
        submitBtn.style.display = 'block';
    }
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
    if (inputBtn.files[0].size > 7097152) {
        alert("Error: File size limite exceeded 5MB")
        dropArea.classList.remove('active');
        inputBtn.value = "";
    } else if (!validateFileType(inputBtn.files[0].type)) {
        alert("Error: Invalid File Type")
        dropArea.classList.remove('active');
        inputBtn.value = "";
    } else {
        //Always select the 1st file, if user selects mutiple
        file = e.dataTransfer.files[0];
        fileName = inputBtn.files[0].name;
        displayImage();
        submitBtn.style.display = 'block';
    }
})

//Fetch AWS Rekognition API
async function submitFile() {

    displayLoading();

    if (fileName in cache) {
        console.log('fetch from cache')
        let res = cache[fileName].clone()
        return res
    } else {
        console.log('fetch from API')
        const response = await fetch(analyseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: fileName,
                file: fileURL.substring(fileURL.indexOf(',') + 1)
            })
        });
        cache[fileName] = response;
        return response;
    }
}

submitBtn.addEventListener('click', async () => {
    resultImg.src = fileURL;
    let data = await submitFile().catch(() => alert('Error: The file appears to be corrupted'));
    //https://stackoverflow.com/questions/53511974/javascript-fetch-failed-to-execute-json-on-response-body-stream-is-locked
    data = await data.clone().json().catch((err) => alert(err)); // .json() method been called once before it is stored in cache, so it will crash without .clone()
    console.log(data);

    const resultSection = document.querySelector('.result-container');
    resultSection.style.display = 'block';
    resultSection.scrollIntoView();

    if (data) {
        hideLoading()
        clearAllResultBubbles();
        data.Labels.forEach(el => {
            createResultBubble(el);
        });
    }
});

function displayImage() {
    let fileReader = new FileReader();
    fileReader.onload = () => {
        fileURL = fileReader.result;
        imgPreview.src = fileURL;
    }
    fileReader.readAsDataURL(file);
}

function displayLoading() {
    spinners.forEach(spinner => {
        spinner.classList.add('display');
    })
}

function hideLoading() {
    spinners.forEach(spinner => {
        spinner.classList.remove('display');
    })
}

function validateFileType(fileType) {
    return validTypes.includes(fileType);
}

function clearAllResultBubbles() {
    resultHolder.innerHTML = '';
};

function createResultBubble(e) {
    const textBubble = document.createElement('div');
    textBubble.classList.add('result-bubble');
    textBubble.textContent = e.Name;
    resultHolder.appendChild(textBubble);
};