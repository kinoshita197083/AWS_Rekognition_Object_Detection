const queryWrapper = document.querySelector('.query-form'),
    textBubbleWrapper = document.querySelector('.text-bubble-wrapper'),
    defaultBubbles = document.querySelectorAll('.default-bubble'),
    tagInput = document.querySelector('#tag'),
    defaultBubbleWrapper = document.querySelector('.default-bubble-list');

let textBubbleList = [];
let defaultBubbleList = ['smile', 'male', 'glasses', 'woman', 'happy', 'dog', 'tree'];

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
    return textBubbleList.includes(e);
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

tagInput.addEventListener('keyup', () => {
    // console.log(tagInput.value);
    if (tagInput.value.includes(" ")) {
        appendTextBubble(tagInput.value.trim());
        clearTextInput();
    }
});

