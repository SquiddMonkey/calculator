const answerBox = document.querySelector(".answer-box");
const buttons = document.querySelectorAll(".buttons button");
const pressedKeys = {};

let input;
let decimalAvailable = true;
input = answerBox.textContent;

buttons.forEach(button => {
    let char = convertButtonTextToKey(button.textContent);

    button.addEventListener("click", () => handleInput(char));
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    pressedKeys[key] = true;

    console.log("Key: " + key); // delete

    handleInput(key);
})

document.addEventListener("keyup", (event) => {
    delete pressedKeys[event.key];
});

function metaPressed() {
    return pressedKeys.Meta === true;
}

function convertButtonTextToKey(buttonText) {
    if (buttonText === "DEL")
        return "Backspace";
    else if (buttonText === "AC")
        return "Meta + Backspace";
    else
        return buttonText;
}

function handleInput(char) {
    if (isValidInput(char)) {
        appendInput(char);
        scrollFullyLeft(answerBox);
    }
}

function isValidInput(char) {
    if (char >= 0 && char < 10 || 
        char === "+" ||
        char === "-" ||
        char === "*" ||
        char === "/" ||
        char === "." ||
        char === "Backspace" ||
        char === "=" ||
        char === "Enter") {
        return true;
    }
    return false;
}

function appendInput(char) {
    if (isDigit(char)) {
        if (input === "0" || input === "Infinity") {
            input = "";
        }
        input += +char;
    }

    if (isOperator(char) && lastCharWasDigit()) {
        decimalAvailable = true;
        input += " " + char + " ";
    }

    if (char === "." && decimalAvailable) {
        decimalAvailable = false;
        input += char;
    }

    if (char === "=" || char === "Enter") {
        input = eval(input).toString();
    }

    if (pressedKeys["Meta"] && char === "Backspace") {
        input = "";
    }
    else if (char === "Backspace") {
        if (lastCharIsOperator()) {
            input = input.slice(0, -3);
        }
        else if(lastCharWasDigit) {
            input = input.slice(0, -1);
        }
    }

    setEmptyInputToZero();
    answerBox.textContent = input;
}

function setEmptyInputToZero() {
    if (input === "") {
        input = "0";
    }
}

function lastCharIsOperator() {
    return isOperator(input.at(-2));
}

function isOperator(char) {
    return char === '+' || char === '-' || char === '*' || char === '/';
}

function isDigit(char) {
    return +char >= 0 && +char < 10 && char !== " ";
}

function lastCharWasDigit() {
    return isDigit(input.at(-1));
}

function scrollFullyLeft(element) {
    element.scrollLeft += element.scrollWidth;
}

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function mul(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
}