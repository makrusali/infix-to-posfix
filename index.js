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
                if (!isNumber(c) && c !== '.') {
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
                tableHtml += `<td><div class="td_item td__label">${data[row][col]}</div></td>`
            }
            tableHtml += `</tr>`;
        }
    }
    tableHtml += `</tbody></table>`;

    root.innerHTML = tableHtml;
}

function infix2Posfix(infix) {
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
            // push postfix token
            pushPostfixToken(token);

            // masukkan ke dalam tabel
            arrTable[rowLength - 1][i] = token;
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

                    // push postfix token
                    pushPostfixToken(data);

                    // add to table
                    arrTable[rowLength - 1][i] += ' ' + data;
                    count++;

                    // chek level again
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
                // jika ya ! push ke output
                // push postfix token
                pushPostfixToken(curr);

                // just for view tabel
                arrTable[rowLength - 1][i + count] = curr;

                ++count;

                // pop next 
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
            // invalid token
            pushPostfixToken('[ invalid token : ' + token + ' ]')
        }

        // ambil data dari stack
        let data = stack.getData();

        // show :  move stack data to table 
        for (let j = 0; j < data.length; j++) {
            arrTable[(rowLength - 2) - j][i] = data[j];
        }
    }

    // append view table
    appendTableView(stackTableEl, arrTable, rowLength, columnLength);

    return postfixToken;
}


function eval(posfixToken) {

    const tokenLength = posfixToken.length;
    const stack = new Stack();

    let arrTablePos = 0;
    let arrTable = new Array(tokenLength);

    const pushState = (state) => {
        arrTable[arrTablePos++] = state;
    }

    const createState = (currStack, information) => {
        return {
            currStack: currStack,
            information: information
        }
    }

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

            pushState(createState(stack.getData(), `PUSH(${token})`));
        } else if (isOperator(token)) {

            const operandB = parseFloat(stack.pop());
            const operandA = parseFloat(stack.pop());

            const result = doExpression(operandA, operandB, token);

            pushState(createState(stack.getData(), `POP(${operandB}), POP(${operandA})<br>${operandA} ${token} ${operandB} = ${result}`));
            
            stack.push(result);
            pushState(createState(stack.getData(), `PUSH(${result})`))
        }
    }


    drawTableState(evalTableConteinerEl, arrTable);
    return stack.pop();
}

function drawTableState(root, tableState) {
    let html = '';

    const minRow = () => {
        let sizes = tableState.map((e) => {
            return e.currStack.length;
        });

        return Math.max(...sizes)
    }

    const createStateTable = (stackArr, information) => {
        return `<div class="table_card">
            <table>
                ${`<td class="td_item"></td>`.repeat(minRow() - stackArr.length + 1)}
                ${stackArr.reverse().map((e) => { return `<td class="td_item">${e}</td>` }).join('')}
            </table >
        <div>
            <p class="information_label">${information}</p>
        </div>
        </div > `
    }

    tableState.forEach((e) => {
        html += createStateTable(e.currStack, e.information);
    });

    root.innerHTML = html;
}

const btnConvertEl = document.getElementById('btn-konversi');
const inputInfixEl = document.getElementById('infix');
const stackTableEl = document.getElementById('stack-table-container');
const resultLabelEl = document.getElementById('result-label');
const evalTableConteinerEl = document.getElementById('eval-table-container');
const resultEvalEl = document.getElementById('result-eval-label');

btnConvertEl.addEventListener('click', (e) => {
    e.preventDefault();

    const infix = inputInfixEl.value;
    const posfixToken = infix2Posfix(infix);
    const resultEval = eval(posfixToken);

    resultLabelEl.innerHTML = 'Hasil Postfix : ' + posfixToken.join(' ');
    resultEvalEl.innerHTML = 'Hasil Evaluasi : ' + resultEval;
});

