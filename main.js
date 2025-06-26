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

    if ((char === "=" || char === "Enter") && !lastCharIsOperator()) {
        input = removeSpaces(input);
        evaluateAll();
        // input = eval(input);
        input = roundToDecimalPlace(input, 8);
        input = input.toString();
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

    deselectActiveElement();
    setEmptyInputToZero();
    answerBox.textContent = input;
}

function evaluateAll() {
    input = replacePercents(input);
    input = negativeToTilde(input);
    input = evaluateLeftToRight(/[*/]/, input);
    input = evaluateLeftToRight(/[+-]/, input);
    input = tildeToNegative(input);
}

function evaluateLeftToRight(operatorList, string) {
    // Find the first index that matches an operator from the list
    let operatorIndex = string.search(operatorList);
    let a, b;

    // Keep evaluating while there are still operators in the string
    while (operatorIndex !== -1) {
        let operator = string.at(operatorIndex);
        a = getNumBeforeOperator(operatorIndex, string);
        b = getNumAfterOperator(operatorIndex, string);
        let answer;

        switch (operator) {
            case '*':
                answer = mul(a, b);
                break;
            case '/':
                answer = div(a, b);
                break;
            case '+':
                answer = add(a, b);
                break;
            case '-':
                answer = sub(a, b);
                break;
        }

        // If answer negative, replace - sign with with ~
        answer = negativeToTilde(answer);

        // Replace expression with evaluated answer
        let expression = a.toString() + operator + b.toString();
        expression = negativeToTilde(expression);
        string = string.replace(expression, answer);

        operatorIndex = string.search(operatorList);
    }

    return string;
}

function negativeToTilde(num) {
    if (num < 0) {
        num *= -1;
        num = "~" + num;
    }
    else if (num.toString().at(0) === '-') {
        num = num.slice(1);
        num = "~" + num;
    }
    return num;
}

function tildeToNegative(num) {
    if (num.at(0) === '~') {
        num = num.slice(1);
        num *= -1;
    }
    return num;
}

function getNumBeforeOperator(index, string) {
    let i = index - 1;
    let number = "";

    while (string.at(i) && i >= 0 && string.at(i).match(/[0-9.~]/)) {
        number = string.at(i) + number;
        i--;
    }
    
    number = tildeToNegative(number);

    return +number;
}

function getNumAfterOperator(index, string) {
    let i = index + 1;
    let number = "";

    while (string.at(i) && i >= 0 && string.at(i).match(/[0-9.~]/)) {
        number = number + string.at(i);
        i++;
    }

    number = tildeToNegative(number);
    
    return +number;
}

function removeSpaces(text) {
    return text.replaceAll(' ', "");
}

function deselectActiveElement() {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
}

function roundToDecimalPlace(number, decimalPlaces) {
    return Math.round(number * (10 ** decimalPlaces)) / (10 ** decimalPlaces);
}

function replacePercents(input) {
    return input.replace(/%/g, "/100");
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