const queryWrapper = document.querySelector('.query-form'),
    textBubbleWrapper = document.querySelector('#default-options'),
    defaultBubbles = document.querySelectorAll('.default-bubble'),
    tagInput = document.querySelector('#tag'),
    defaultBubbleWrapper = document.querySelector('.default-bubble-list'),
    imgGrp = document.querySelectorAll('.img-grp'),
    enlargedImg = document.querySelector('.enlarged-img'),
    querySubmitBtn = document.querySelector('#query-submit-btn'),
    carousel = document.querySelector('.carousel-container');

let textBubbleList = [];
let returnedImg = [];
let defaultBubbleList = ['smile', 'male', 'glasses', 'woman', 'happy', 'dog', 'tree'];
let queryURL = 'https://gc6qq4wfde.execute-api.ap-southeast-2.amazonaws.com/prod/queryreko';

//Update the text bubble wrapper for the latest render
function updateTextBubbleWrapper() {
    clearAllTextBubbles();
    textBubbleList.forEach(e => {
        createTextBubble(e);
    })
};

//Create a text bubble and attach the necessary event listener
function createTextBubble(e) {
    const textBubble = document.createElement('div');
    textBubble.classList.add('text-bubble');
    textBubble.textContent = e;
    textBubbleWrapper.appendChild(textBubble);
    textBubble.addEventListener('click', () => {
        removeBubble();
        updateTextBubbleWrapper();
    })
};

//Reset the bubble wrapper to empty for another round of display
function clearAllTextBubbles() {
    textBubbleWrapper.innerHTML = '';
};

//check if exists
function checkIfTextBubbleExists(e) {
    let flag = true;
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]/;
    if (!format.test(e) && e && isNaN(e)) {
        !textBubbleList.includes(e) ? flag = false : console.log('item exists')
    }
    return (flag);
    // return textBubbleList.includes(e);
};

//append
function appendTextBubble(e) {
    !checkIfTextBubbleExists(e) ? textBubbleList.push(e) && updateTextBubbleWrapper() : console.log('The element already exists')
};

//delete
function removeBubble(bubble) {
    const index = textBubbleList.indexOf(bubble);
    checkIfTextBubbleExists ? textBubbleList.splice(index, 1) : console.log('The element does not exist');
};

//Render default text bubbles  and attach onClick listner
//Tooltip
defaultBubbleList.forEach(e => {
    const textBubble = document.createElement('div');
    textBubble.classList.add('text-bubble', 'default-bubble');
    textBubble.textContent = e;
    defaultBubbleWrapper.appendChild(textBubble);

    textBubble.addEventListener('click', () => {
        let el = textBubble.textContent;
        appendTextBubble(el);
    })
})

function clearTextInput() {
    tagInput.value = "";
};

tagInput.addEventListener('keyup', (e) => {
    // console.log(tagInput.value);
    if (tagInput.value.includes(" ") || e.keyCode == 13) {
        appendTextBubble(tagInput.value.trim());
        clearTextInput();
    }
});

//Click to view in full screen
function imgGRPEnlargedListener(element) {
    element.addEventListener('click', () => {
        enlargedImg.style.display = 'block';
        let imgURL = element.getAttribute('src');
        enlargedImg.style.backgroundImage = `url(${imgURL})`;
    })
}

//Clicked the enlarged img to close the full screen view
enlargedImg.addEventListener('click', () => {
    enlargedImg.style.display = 'none';
})

function renderReturnedImage(uri) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('img-wrapper');

    const img = document.createElement('img');
    img.classList.add('img-grp')
    img.src = uri;

    wrapper.appendChild(img);
    carousel.appendChild(wrapper);

    imgGRPEnlargedListener(img); //click to view in full screen
}

function clearAllReturnedImages() {
    while (carousel.firstChild) {
        carousel.removeChild(carousel.lastChild);
    }
}

//Fetch with POST request
async function submitTextbubbles() {
    clearAllReturnedImages();
    displayLoading();
    const response = await fetch(queryURL, {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tags: textBubbleList
        })
    });
    return response
}

//Submit the request when pressing Submit btn
querySubmitBtn.addEventListener('click', async () => {
    clearAllTextBubbles();
    if (textBubbleList.length > 0) {
        const res = await submitTextbubbles().catch(err => alert(err));
        let data = await res.json();
        data ? hideLoading() : console.log('Status: OK');
        textBubbleList = [];
        // console.log(data)
        returnedImg = [...data];
        console.log(returnedImg)
        if (returnedImg.length < 1) {
            alert('No relevant image found')
        }
        carousel.style.visibility = 'visible';
        returnedImg.forEach(img => {
            renderReturnedImage(img);
        });
        textBubbleList = [];
    } else {
        alert('Type or select keywords to search')
    }
})