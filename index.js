const inputElement = document.querySelector('input');
const sendBtn = document.querySelector('span');
const container = document.querySelector('.container');
const errorMessage = document.querySelector('p');
const typewriter = document.getElementById('typewriter')

const url = 'https://api.daku.tech/v1/images/generations';
const authToken = 'sk-O1s9Pic+In58XCheT3BlbkFJO1s9Pic+In58XChe';
let isRequestInProgress = false;


sendBtn.addEventListener('click', preProcessor);
inputElement.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        preProcessor();
    }
});

function preProcessor() {

    if (isRequestInProgress || inputElement.value.trim() === '') {
        return;
    }
    errorMessage.textContent = '';
    container.innerHTML = '';
    typewriter.style.display = 'none';

    const requestBody = {
        "model": "dall-e",
        "n": 4,
        "prompt": `${inputElement.value}`,
        "size": "1024x1024"
    }

    inputElement.value = '';
    isRequestInProgress = true;

    getData(requestBody);
}

async function getData(requestBody) {
    try {
        document.getElementById("spinner").style.display = "";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            document.getElementById("spinner").style.display = "none";
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        document.getElementById("spinner").style.display = "none";

        postProcessor(jsonData);


    }
    catch (error) {
        errorMessage.textContent = error;
        isRequestInProgress = false;
    }
}

function postProcessor(jsonData) {

    jsonData.data.forEach(element => {

        const image = document.createElement('img');
        image.src = element.url;

        container.appendChild(image);
    });

    isRequestInProgress = false;
}


let i = 0;
const txt = ['Welcome to DALL-E!', 'Create Images from Text!', 'Extend Your Creativity!'];
const speed = 100;
const waitAfter = 2000;
const eraseSpeed = 50;
let currentText = 0;

function typeWriter() {
    if (i < txt[currentText].length) {
        typewriter.innerHTML += txt[currentText].charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(eraseWriter, waitAfter);
    }
}

function eraseWriter() {
    if (i >= 0) {
        typewriter.innerHTML = txt[currentText].substring(0, i);
        i--;
        setTimeout(eraseWriter, eraseSpeed);
    } else {
        currentText++;
        if (currentText >= txt.length)
            currentText = 0;
        typeWriter();
    }
}

window.addEventListener('load', typeWriter);