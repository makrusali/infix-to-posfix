class Stack {
    constructor() {
        this.data = [];
        this.top = -1;
    }

    count() {
        return this.top + 1;
    }

    isEmpty() {
        return this.top == -1;
    }

    pop() {
        if (!this.isEmpty()) {
            return this.data[this.top--];
        }

        console.log('stack is empty')
    }

    push(data) {
        this.data[++this.top] = data;
    }

    look() {
        if (!this.isEmpty()) {
            return this.data[this.top];
        }
    }

    getData() {
        return this.data.slice(0, this.top + 1);
    }

    display() {
        let result = [];
        for (let i = 0; i <= this.top; i++) {
            result[i] = this.data[i];
        }
        console.log(result);
    }
}

function isNumber(c) {
    return c >= '0' && c <= '9';
}

function isOperand(c) {
    return !isNaN(parseFloat(c));
}

function isOperator(c) {
    return c === '^' || c === '*' || c === '/' || c === '+' || c === '-';
}

function isOpenBracket(c) {
    return c == '(';
}

function isCloseBracket(c) {
    return c == ')';
}

function operatorLevel(c) {
    switch (c) {
        case '-':
        case '+':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        default:
            return 0;
    }
}

function eatWhiteSpace(str) {
    let buffer = '';
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (c !== ' ') {
            buffer += c;
        }
    }
    return buffer;
}

function countSymbol(str) {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (isCloseBracket(c) || isOpenBracket(c) || isOperator(c)) {
            ++length;
        }
    }
    return length;
}

function split(str) {
    let output = [];
    let indexOutput = 0;
    let state = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str[i];

        switch (state) {
            case 0:
                if (isNumber(c)) {
                    state = 1;
                    output[indexOutput] = c;
                    break;
                }
                output[indexOutput] = c;
                indexOutput++;
                break;
            case 1:
                if (!isNumber(c)) {
                    state = 0;
                    indexOutput++;
                    output[indexOutput] = c;
                    indexOutput++;
                    break;
                }
                output[indexOutput] += c;
                break;
            default:
                break;
        }
    }

    return output;
}

function checkRowIsEmpty(rowIndex, columnLength, table) {
    for (let i = 0; i < columnLength; i++) {
        if (table[rowIndex][i] != ' ') {
            return false;
        }
    }
    return true;
}



function appendTableView(root, data, rowLength, columnLength) {
    let tableHtml = '';

    const countNotEmptyRow = () => {
        let count = 0;
        for (let row = 0; row < rowLength; row++) {
            // ignore empty data row
            if (!checkRowIsEmpty(row, columnLength, data)) {
                count++;
            }
        }
        return count;
    }

    tableHtml = `<table><tbody>`;
    let spanned = false;
    for (let row = 0; row < rowLength; row++) {
        // ignore empty data row
        if (!checkRowIsEmpty(row, columnLength, data)) {
            tableHtml += `<tr>`;
            if (row == 0) {
                tableHtml += `<td><div class="td_item td__label">Infix</div></td>`;
            } else if (row == rowLength - 1) {
                tableHtml += `<td><div class="td_item td__label">Posfix</div></td>`;
            } else {
                if (spanned == false) {
                    tableHtml += `<td rowspan="${countNotEmptyRow() - 2}"><div class="td_item td__label">Stack</div></td>`;
                    spanned = true;
                }
            }
            for (let col = 0; col < columnLength; col++) {
                tableHtml += `<td><div class="td_item">${data[row][col]}</div></td>`
            }
            tableHtml += `</tr>`;
        }
    }
    tableHtml += `</tbody></table>`;

    root.innerHTML = tableHtml;
}

function infix2Posfix(infix) {
    let output = '';
    const stack = new Stack();

    let posPostfixToken = 0;
    let postfixToken = [];

    const pushPostfixToken = (token) => {
        postfixToken[posPostfixToken++] = token;
    }

    // makan area kosong (spasi)
    infix = eatWhiteSpace(infix);

    // scan input infix dan pecah menjadi kumpulan array operator dan operand
    let arrInfixSplited = split(infix);
    let splitedLength = arrInfixSplited.length;

    // define row and column length of table
    // row -> count symbol
    // column -> length of splitedInput
    const rowLength = countSymbol(infix)
    let columnLength = splitedLength;

    // init row array [...]
    let arrTable = new Array(rowLength);
    // init column array [n][...]
    for (let i = 1; i < rowLength; i++) {
        arrTable[i] = new Array(...' '.repeat(columnLength));
    }

    // top of array -> arrInfixSplited
    arrTable[0] = arrInfixSplited;

    // if no ';' (semi colon) in end position of input
    // add ';'
    if (arrInfixSplited[splitedLength - 1] !== ';') {
        arrInfixSplited[splitedLength] = ';';
        ++splitedLength;
    }

    // scanning 
    for (let i = 0; i < splitedLength; i++) {
        const token = arrInfixSplited[i];

        // jika operand maka jebloskan langsung ke output
        if (isOperand(token)) {
            // jebloskan
            output += token;
            // masukkan ke dalam tabel
            arrTable[rowLength - 1][i] = token;

            // push postfix token
            pushPostfixToken(token);

        } else if (isOperator(token)) {
            // jika operator lihat level operator dari top stack dan operator saat ini (current)
            let levelInStack = operatorLevel(stack.look());
            const level = operatorLevel(token);

            // bandingkan
            if (level <= levelInStack) {
                // jika level operator saat ini lebih kecil atau sama '<=' dengan level operator pada top of stack
                // pop operator di stack dan keluarkan (output)
                // push operator baru ke stack  

                // let data = stack.pop();
                // output += data;
                // arrTable[rowLength - 1][i] = data;

                let count = 0;
                /* edited */
                while (level <= levelInStack) {
                    let data = stack.pop();
                    output += data;
                    arrTable[rowLength - 1][i] += data;

                    // push postfix token
                    pushPostfixToken(data);

                    count++;
                    levelInStack = operatorLevel(stack.look());
                }
                /* end edited */

                // push new operator
                stack.push(token);
            } else {
                // jika level operator saat ini lebih '>' dengan level operator pada top of stack
                // push operator baru
                stack.push(token);
            }
        } else if (isOpenBracket(token)) {
            // jika operator kurung buka
            // push
            stack.push(token);
        } else if (isCloseBracket(token)) {
            // jika kurung tutup ')'
            // push dulu ke dalam stack
            stack.push(token);

            // ambil data saat ini di dalam stack dan masukkan pada array tabel
            // untuk tampilan tabel
            let data = stack.getData();
            for (let j = 0; j < data.length; j++) {
                arrTable[(rowLength - 2) - j][i] = data[j];
            }

            // keluarkan ')' dari stack
            stack.pop();

            // pop 1 item pada stack
            let curr = stack.pop();

            let count = 0;
            // cek apakah bukan kurung buka ')'
            while (!isOpenBracket(curr)) {
                // jika ya !
                // maka keluarkan data tersebut
                output += curr;
                // just for view tabel
                arrTable[rowLength - 1][i + count] = curr;

                // push postfix token
                pushPostfixToken(curr);

                ++count;
                // pop 
                curr = stack.pop();
            }
        } else if (token === ';') {
            // jika titik koma ';'
            const count = stack.count();
            // keluarkan semua elemen sisa di stack
            for (let j = 0; j < count; j++) {
                let data = stack.pop();
                // tambahkan ukuran kolom
                columnLength++;
                output += data;

                // push postfix token
                pushPostfixToken(data);

                // if result is more than columnLength
                // reinit array with added column length
                for (let k = 0; k < rowLength; k++) {
                    arrTable[k][i + j] = ' ';
                }
                // just for view
                arrTable[rowLength - 1][i + j] = data;
            }
        } else {
            output += ' [' + token + ' is invalid] ';
        }

        // ambil data dari stack
        let data = stack.getData();

        for (let j = 0; j < data.length; j++) {
            arrTable[(rowLength - 2) - j][i] = data[j];
        }
    }

    // append view table
    appendTableView(root, arrTable, rowLength, columnLength);

    return postfixToken;
}

function eval(posfixToken) {
    const tokenLength = posfixToken.length;
    const stack = new Stack();

    function doExpression(a, b, exprs) {
        switch (exprs) {
            case '^':
                return Math.pow(a, b);
            case '*':
                return a * b;
            case '/':
                return a / b;
            case '+':
                return a + b;
            case '-':
                return a - b;
        }
    }

    for (let i = 0; i < tokenLength; i++) {
        const token = posfixToken[i];

        if (isOperand(token)) {
            stack.push(parseFloat(token));
        } else if (isOperator(token)) {
            const operandB = parseFloat(stack.pop());
            const operandA = parseFloat(stack.pop());

            const result = doExpression(operandA, operandB, token);
            console.info(operandA, token, operandB, '=', result);

            stack.push(result);
        }
    }

    stack.display();

    return stack.pop();
}

function splitTwoOperator(operator) {
    if (isOperator(operator)) {
        if (operator.length > 1) {
            return [operator[0], operator[1]];
        }
    }
}

const btnKonversiEl = document.getElementById('btn-konversi');
const inputInfixEl = document.getElementById('infix');
const root = document.getElementById('root');

root.innerHTML = ``;

btnKonversiEl.addEventListener('click', (e) => {
    e.preventDefault();

    root.innerHTML = '';

    const infix = inputInfixEl.value;
    const posfixToken = infix2Posfix(infix);


    root.innerHTML += `
    <div>${posfixToken}</div>
    `;

    console.log('token : ', posfixToken);

    console.log(eval(posfixToken));
});


