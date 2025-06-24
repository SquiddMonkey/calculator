const answerBox = document.querySelector(".answer-box");
const buttons = document.querySelectorAll(".buttons button");
const pressedKeys = {};

let input;
input = answerBox.textContent;

buttons.forEach(button => {
    let char = convertButtonTextToKey(button.textContent);

    button.addEventListener("click", () => handleInput(char));
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    pressedKeys[key] = true;

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
        char === "%" ||
        char === "." ||
        char === "Backspace" ||
        char === "Meta + Backspace" ||
        char === "=" ||
        char === "Enter") {
        return true;
    }
    return false;
}

function appendInput(char) {
    if (isDigit(char) && !lastCharIsPercent()) {
        if (input === "0" || input === "Infinity" || input === "NaN") {
            input = "";
        }
        input += +char;
    }

    if (isOperator(char) && (lastCharIsDigit() || lastCharIsDecimal() || lastCharIsPercent())) {
        input += " " + char + " ";
    }

    if (char === "%" && (lastCharIsDigit() || lastCharIsDecimal())) {
        input += char;
    }

    if (char === "." && !numberContainsDecimal() &&!lastCharIsPercent()) {
        if (lastCharIsOperator()) {
            input += "0";
        }
        input += char;
    }

    if (char === "=" || char === "Enter") {
        evaluateAllPercents();
        input = eval(input).toString();
    }

    if (pressedKeys["Meta"] && char === "Backspace" || char === "Meta + Backspace") {
        input = "";
    }
    else if (char === "Backspace") {
        if (lastCharIsOperator()) {
            input = input.slice(0, -3);
        }
        else if(lastCharIsDigit() || lastCharIsDecimal() || lastCharIsPercent()) {
            input = input.slice(0, -1);
        }
    }

    setEmptyInputToZero();
    answerBox.textContent = input;
}

function evaluateAllPercents() {
    input = input.replace(/%/g, "/100");
}

function numberContainsDecimal() {
    for (let i = 1; i <= input.length; i++) {
        if (input.at(-i) === '.') {
            return true;
        }
        else if (isOperator(input.at(-i))) {
            return false;
        }
    }
    return false;
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

function lastCharIsDigit() {
    return isDigit(input.at(-1));
}

function lastCharIsDecimal() {
    return input.at(-1) === '.';
}

function lastCharIsPercent() {
    return input.at(-1) === '%';
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