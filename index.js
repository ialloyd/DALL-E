const inputElement = document.querySelector('input');
const sendBtn = document.querySelector('span');
const container = document.querySelector('.container');
const errorMessage = document.querySelector('p');

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
    errorMessage.textContent = '';
    container.innerHTML='';
    if (isRequestInProgress || inputElement.value.trim() === '') {
        return;
    }

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