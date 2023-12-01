let display = document.getElementById('displayP');
let inputValue = '';

function appendValue(value) {
    inputValue += value;
    updateDisplay();
}

function handleKeyPress(key) {
    if (/\d/.test(key) || ['+', '-', '*', '/'].includes(key)) {
        appendValue(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '.') {
        appendValue(key);
    } else if (key === 'Escape') {
        clearDisplay();
    }
}

document.addEventListener('keydown', function (event) {
    handleKeyPress(event.key);
});

function updateDisplay() {
    display.textContent = inputValue;
}

function clearDisplay() {
    inputValue = '';
    updateDisplay();
}

function backspace() {
    inputValue = inputValue.slice(0, -1);
    updateDisplay();
}

function percentage() {
    inputValue = String(Number(inputValue) / 100);
    updateDisplay();
}

function toggleSign() {
    inputValue = String(Number(inputValue) * -1);
    updateDisplay();
}

function calculate() {
    try {
        inputValue = String(evaluateExpression(inputValue));
    } catch (error) {
        inputValue = 'Error';
    }
    updateDisplay();
}

function evaluateExpression(expression) {
    let operators = [];
    let values = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    function applyOperator(operator) {
        const b = values.pop();
        const a = values.pop();

        switch (operator) {
            case '+':
                values.push(a + b);
                break;
            case '-':
                values.push(a - b);
                break;
            case '*':
                values.push(a * b);
                break;
            case '/':
                values.push(a / b);
                break;
        }
    }

    function greaterPrecedence(op1, op2) {
        return precedence[op1] > precedence[op2];
    }

    function performPendingOperations(newOperator) {
        while (
            operators.length > 0 &&
            greaterPrecedence(operators[operators.length - 1], newOperator)
        ) {
            applyOperator(operators.pop());
        }
    }

    expression.split(/([+\-*/])/).forEach((token) => {
        token = token.trim();
        if (!token) return;

        if (!isNaN(token)) {
            values.push(parseFloat(token));
        } else {
            performPendingOperations(token);
            operators.push(token);
        }
    });

    while (operators.length > 0) {
        applyOperator(operators.pop());
    }

    return values[0];
}
