fillingOptions('inputNumberOfCriterion', 3, 5);
fillingOptions('inputNumberOfAlternatives', 3, 5);
let tableOfAlternatives = [];
let classifyTable = [];
let characterise = [];

let numberOfCriterion;
let numberOfAlternatives;
let scaleName;

function fillingOptions(tagId, min, max, gap = -100) {
    for (let i = min; i <= max; i++) {
        if (i !== gap) {
            let optionTag = document.createElement('option');
            optionTag.setAttribute('value', i.toString());
            optionTag.innerHTML = i.toString();
            document.getElementById(tagId).append(optionTag);
        }
    }
    document.getElementById(tagId).selectedIndex = 0;
}
function fillingTableOptions(tagId, scaleName) {
    for (let i = 1; i <= 9; i++) {
        if (scaleName === 'base' && i % 2 === 0) {
            continue;
        }

        if  (i !== 1){
            let optionTag = document.createElement('option');
            optionTag.setAttribute('value', i.toString());
            optionTag.innerHTML = i.toString();
            document.getElementById(tagId).append(optionTag);
            optionTag = document.createElement('option');
            let val = 1/i;
            optionTag.setAttribute('value', val.toFixed(2).toString());
            optionTag.innerHTML = '1/' + i.toString();
            document.getElementById(tagId).append(optionTag);
        }
        else {
            let optionTag = document.createElement('option');
            optionTag.setAttribute('value', i.toString());
            optionTag.innerHTML = i.toString();
            document.getElementById(tagId).append(optionTag);
        }

    }
    document.getElementById(tagId).selectedIndex = 0;
}
function getSelectedIndex(tagId) {
    return document.getElementById(tagId).selectedIndex;
}
function getValue(tagId) {
    let selectedOptionIndex = getSelectedIndex(tagId);
    return document.getElementById(tagId).options[selectedOptionIndex].value;
}

function first() {
    document.getElementById('first').innerHTML = '';
    numberOfCriterion = parseInt(getValue('inputNumberOfCriterion'));
    numberOfAlternatives = parseInt(getValue('inputNumberOfAlternatives'))
    scaleName = getValue('inputScale');

    const table = document.createElement("table");
    table.id = 'firstTable';
    table.className = "table table-hover";
    const div = document.getElementById('first');
    const p = document.createElement('p');
    p.innerHTML = 'Заполните матрицу сравнений для критериев';
    document.getElementById('first').append(p);
    document.getElementById('first').append(table);
    let thead = document.createElement("thead");
    table.append(thead);
    let tR = document.createElement("tr");
    thead.append(tR);

    for (let i = 0; i <= numberOfCriterion; i++) {
        let th = document.createElement("th");
        th.scope = "col";
        if (i === 0) {
            th.innerHTML = 'Критерии';
        } else {
            th.innerHTML = "C" + (i);
        }
        tR.append(th);
    }

    let tbody = document.createElement("tbody");
    table.append(tbody);

    for (let i = 0; i < numberOfCriterion; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        let th = document.createElement("th");
        th.innerHTML = 'C' + (i + 1);
        tr.append(th);
        for (let j = 0; j < numberOfCriterion; j++) {
            let td = document.createElement("td");
            if( i === j ) {
                td.innerHTML = '1';
                tr.append(td);
            }
            else {
                let select = document.createElement('select');
                select.className = 'form-select w-auto';
                select.id = 'comparisonCriterion' + i + j;
                td.append(select);
                tr.append(td);
                fillingTableOptions(select.id, scaleName);
                select.addEventListener('blur', function () {
                    if (getValue(select.id) > 1) {
                        document.getElementById('comparisonCriterion' + j + i).selectedIndex = getSelectedIndex(select.id) + 1;
                    }
                    if (getValue(select.id) === 1) {
                        document.getElementById('comparisonCriterion' + j + i).selectedIndex = 0;
                    }
                    if (getValue(select.id) < 1) {
                        document.getElementById('comparisonCriterion' + j + i).selectedIndex = getSelectedIndex(select.id) - 1;
                    }
                })
            }
        }
    }

    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.type = 'button';
    btn.innerHTML = 'Далее';
    btn.onclick = second;
    div.append(btn);
}

function second() {
    document.getElementById('second').innerHTML = '';

    const table = document.createElement("table");
    table.id = 'resultFirstTable';
    table.className = "table table-hover";
    const p = document.createElement('p');
    p.innerHTML = 'Результат сравнений для критериев';
    document.getElementById('second').append(p);
    document.getElementById('second').append(table);
    let thead = document.createElement("thead");
    table.append(thead);
    let tR = document.createElement("tr");
    thead.append(tR);

    let th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = 'Критерии';
    tR.append(th1);
    let th2 = document.createElement("th");
    th2.scope = "col";
    th2.innerHTML = 'Собственный вектор Wi';
    tR.append(th2);
    let th3 = document.createElement("th");
    th3.scope = "col";
    th3.innerHTML = 'Вес критерия wi';
    tR.append(th3);

    let tbody = document.createElement("tbody");
    table.append(tbody);

    let eigenvector = [];
    let sumEigenvector = 0;
    for (let i = 0; i < numberOfCriterion; i++) {
        eigenvector[i] = 1;
        for (let j = 0; j < numberOfCriterion; j++) {
            if (i === j) {
                continue;
            } else {
                eigenvector[i] *= parseFloat(getValue('comparisonCriterion' + i + j));
            }
        }
        eigenvector[i] = Math.pow(eigenvector[i], 1 / numberOfCriterion);
        sumEigenvector += eigenvector[i];
    }
    let criterionWeight = [];
    for (let i = 0; i < numberOfCriterion; i++) {
        criterionWeight[i] = eigenvector[i] / sumEigenvector;
    }

    for (let i = 0; i < numberOfCriterion; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        let th = document.createElement("th");
        th.innerHTML = 'C' + (i + 1);
        tr.append(th);
        let td1 = document.createElement("td");
        td1.innerHTML = eigenvector[i].toString();
        tr.append(td1);
        let td2 = document.createElement("td");
        td2.innerHTML = criterionWeight[i].toString();
        tr.append(td2);
    }

    for (let k = 0; k < numberOfAlternatives; k++) {
        const div = document.createElement('div');
        div.id = 'alternatives'+k;
        div.className = 'my-4 py-3';
        document.getElementById('second').append(div);
        const table = document.createElement("table");
        table.id = 'tableAlternatives'+k;
        table.className = "table table-hover";
        const p = document.createElement('p');
        p.innerHTML = 'Заполните матрицу сравнений для альтернатив по критерию C'+(k+1);
        div.append(p);
        div.append(table);
        let thead = document.createElement("thead");
        table.append(thead);
        let tR = document.createElement("tr");
        thead.append(tR);
        for (let i = 0; i <= numberOfAlternatives; i++) {
            let th = document.createElement("th");
            th.scope = "col";
            if (i === 0) {
                th.innerHTML = 'Альтернативы';
            } else {
                th.innerHTML = "A" + (i);
            }
            tR.append(th);
        }

        let tbody = document.createElement("tbody");
        table.append(tbody);

        for (let i = 0; i < numberOfAlternatives; i++) {
            let tr = document.createElement("tr");
            tbody.append(tr);
            let th = document.createElement("th");
            th.innerHTML = 'A' + (i + 1);
            tr.append(th);
            for (let j = 0; j < numberOfAlternatives; j++) {
                let td = document.createElement("td");
                if( i === j ) {
                    td.innerHTML = '1';
                    tr.append(td);
                }
                else {
                    let select = document.createElement('select');
                    select.className = 'form-select w-auto';
                    select.id = 'comparisonAlternatives' + k + '_' + i + j;
                    td.append(select);
                    tr.append(td);
                    fillingTableOptions(select.id, scaleName);
                    select.addEventListener('blur', function () {
                        if (getValue(select.id) > 1) {
                            document.getElementById('comparisonAlternatives' + k + '_' + j + i).selectedIndex = getSelectedIndex(select.id) + 1;
                        }
                        if (getValue(select.id) === 1) {
                            document.getElementById('comparisonAlternatives' + k + '_' + j + i).selectedIndex = 0;
                        }
                        if (getValue(select.id) < 1) {
                            document.getElementById('comparisonAlternatives' + k + '_' + j + i).selectedIndex = getSelectedIndex(select.id) - 1;
                        }
                    })
                }
            }
        }
        let btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.type = 'button';
        btn.innerHTML = 'Сформировать результат';
        btn.onclick = () => resultComparisonAlternatives(k);
        div.append(btn);
    }

    let btn1 = document.createElement('button');
    btn1.className = 'btn btn-primary';
    btn1.type = 'button';
    btn1.innerHTML = 'Далее';
    btn1.onclick = third;
    document.getElementById('second').append(btn1);
}

function resultComparisonAlternatives(numTable) {

    //document.getElementById('alternatives'+numTable).innerHTML = '';
    const table = document.createElement("table");
    table.id = 'resultAlternativesTable'+numTable;
    table.className = "table table-hover";
    const p = document.createElement('p');
    p.innerHTML = 'Результат сравнений для альтернатив по критерию C'+(numTable+1);
    document.getElementById('alternatives'+numTable).append(p);
    document.getElementById('alternatives'+numTable).append(table);
    let thead = document.createElement("thead");
    table.append(thead);
    let tR = document.createElement("tr");
    thead.append(tR);

    let th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = 'Альтернатива';
    tR.append(th1);
    let th2 = document.createElement("th");
    th2.scope = "col";
    th2.innerHTML = 'Собственный вектор Vi';
    tR.append(th2);
    let th3 = document.createElement("th");
    th3.scope = "col";
    th3.innerHTML = 'Вес альтернативы vi';
    tR.append(th3);

    let tbody = document.createElement("tbody");
    table.append(tbody);

    let eigenvector = [];
    let sumEigenvector = 0;
    for (let i = 0; i < numberOfCriterion; i++) {
        eigenvector[i] = 1;
        for (let j = 0; j < numberOfCriterion; j++) {
            if (i === j) {
                continue;
            } else {
                eigenvector[i] *= parseFloat(getValue('comparisonAlternatives' + numTable + '_' + i + j));
            }
        }
        eigenvector[i] = Math.pow(eigenvector[i], 1 / numberOfAlternatives);
        sumEigenvector += eigenvector[i];
    }
    let criterionWeight = [];
    for (let i = 0; i < numberOfAlternatives; i++) {
        criterionWeight[i] = eigenvector[i] / sumEigenvector;
    }

    for (let i = 0; i < numberOfAlternatives; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        let th = document.createElement("th");
        th.innerHTML = 'A' + (i + 1);
        tr.append(th);
        let td1 = document.createElement("td");
        td1.innerHTML = eigenvector[i].toString();
        tr.append(td1);
        let td2 = document.createElement("td");
        td2.innerHTML = criterionWeight[i].toString();
        tr.append(td2);
    }
}


function third() {
    for (let j = 1; j <= numberOfAlternatives; j++) {
        let p = document.createElement('p');
        p.innerHTML = 'A' + j + ' = ';
        let count = 0;
        for (let i = 1; i <= numberOfCriterion; i++) {
            count += parseFloat(document.getElementById('resultFirstTable').getElementsByTagName('tr')[i].getElementsByTagName('td')[1].innerHTML) * parseFloat(document.getElementById('resultAlternativesTable' + (i-1)).getElementsByTagName('tr')[j].getElementsByTagName('td')[1].innerHTML);
        }
        p.innerHTML += count;
        document.getElementById('third').append(p);
    }
}