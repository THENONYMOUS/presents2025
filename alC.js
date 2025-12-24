levels = [
    ["SOK", "OFE", "AIN"],
    ["EMEHPORLED", "SENORDDBAI", "TNEWONERLA", "ENCEJOSYLL", "VERCBCIXCE", "TCBTUSLETG", "JEOLRASESR", "BOGPHCXNYA", "PHOITIATMM", "ARGRCAIDAR"],
]
wordLists = [
    ["SOFIA", "NEKO"],
    ["PHONEME", "WORDORDER", "LEXICON", "SYLLABLE", "DIALECT", "SUBJECT", "GRAMMAR", "SYNTAX", "PHRASE", "DIACRITIC", "LOGOGRAPH", "SENTENCE", "OBJECT", "VERB"],
]
themes = [
    "Pets",
    "Linguistics",
    "Well done!"
]
level = 0
fieldData = "SSSSSSSSS"
// Selectable = +
// Non-selectable = X
// Selected = S
// Used = U
currentWord = ""

function newLevel(){
    document.getElementById("grid").innerHTML = generateTable(levels[level])
    document.getElementById("theme").innerHTML = "Theme: " + themes[level]
    initialiseFieldData()
    document.getElementById("word").innerHTML = currentWord || "-"
}

setTimeout(newLevel, 100)

function initialiseFieldData(){
    fieldData = "+".repeat(levels[level][0].length * levels[level].length)
}

function generateTable(data){
    let output = ""
    for (row in data){
        output += "<tr>"
        let i = 0
        while (i < data[row].length){
            output += `<th id="${row},${i}" onclick="onClick(${row}, ${i})">` + data[row].charAt(i) + "</th>"
            i++
        }
        output += "</tr>"
    }

    return output
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function updateCellColours(){
    data = levels[level]
    for (row in data){
        let i = 0
        while (i < data[row].length){
            let fieldPosition = row * levels[level][0].length + i
            switch (fieldData.charAt(fieldPosition)){
                case "+":
                    document.getElementById(String(row) + "," + String(i)).style.backgroundColor = '#55CC55'
                    break
                case "X":
                    document.getElementById(String(row) + "," + String(i)).style.backgroundColor = '#444477'
                    break
                case "S":
                    document.getElementById(String(row) + "," + String(i)).style.backgroundColor = '#5555FF'
                    break
                case "U":
                    document.getElementById(String(row) + "," + String(i)).style.backgroundColor = '#777777'
                    break
            }
            i++
        }
    }
}

function onClick(row, column){
    let columnCount = levels[level][0].length
    let fieldPosition = row * columnCount + column
    if (fieldData.charAt(fieldPosition) != "+"){
        return
    }

    fieldData = fieldData.replaceAt(fieldPosition, "S")
    currentWord += levels[level][row].charAt(column)
    console.log(currentWord)
    
    document.getElementById("word").innerHTML = currentWord || "-"

    if (wordLists[level].includes(currentWord)){
        fieldData = fieldData.replaceAll("S", "U")
        fieldData = fieldData.replaceAll("X", "+")
        currentWord = ""
        if (!fieldData.includes("+")){
            level += 1
            newLevel()
        }
    }
    else {
        fieldData = fieldData.replaceAll("+", "X")
        if (fieldData.charAt(fieldPosition - columnCount) == "X"){
            fieldData = fieldData.replaceAt(fieldPosition - columnCount, "+")
        }
        if (fieldData.charAt(fieldPosition + columnCount) == "X"){
            fieldData = fieldData.replaceAt(fieldPosition + columnCount, "+")
        }
        if (fieldData.charAt(fieldPosition - 1) == "X" && column > 0){
            fieldData = fieldData.replaceAt(fieldPosition - 1, "+")
        }
        if (fieldData.charAt(fieldPosition + 1) == "X" && column < columnCount - 1){
            fieldData = fieldData.replaceAt(fieldPosition + 1, "+")
        }
    }
    updateCellColours()
}

function cancel(){
    fieldData = fieldData.replaceAll("S", "+")
    fieldData = fieldData.replaceAll("X", "+")
    currentWord = ""
    document.getElementById("word").innerHTML = currentWord || "-"
    updateCellColours()
}