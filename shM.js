environment = [
]
sideLength = 16
allowedConnections = {
    "F": "FDGMWSBC".split(""),
    "D": "FDSW".split(""),
    "G": "FGWB".split(""),
    "M": "FMSB".split(""),
    "W": "FDGWSB+".split(""),
    "S": "FDMWSP".split(""),
    "C": "FT+".split(""),
    "P": "S".split(""),
    "T": "BC".split(""),
    "B": "FGWMTB".split(""),
    "+": "WC".split("")
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function generateTable(data){
    let output = ""
    for (row in data){
        output += "<tr>"
        let i = 0
        while (i < data[row].length){
            output += `<th id="${row},${i}" class="world">` + idToName(data[row][i]) + "</th>"
            i++
        }
        output += "</tr>"
    }

    return output
}

function idToName(id){
    switch(id){
        case "F":
            return "Forest"
        case "D":
            return "Dense Forest"
        case "G":
            return "Grass"
        case "M":
            return "Rock"
        case "W":
            return "Water"
        case "S":
            return "Rock Face"
        case "C":
            return "Castle"
        case "P":
            return "Peak"
        case "T":
            return "Tower"
        case "B":
            return "Meadow"
        case "+":
            return "Mill"
        case "?":
            return "???"
    }
}

function colourTable(data){
    for (row in data){
        let i = 0
        while (i < data[row].length){
            switch (data[row][i]){
                case "F":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#228822"
                    break
                case "D":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#006600"
                    break
                case "G":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#55CC55"
                    break
                case "M":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#AAAAAA"
                    break
                case "W":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#5555CC"
                    break
                case "S":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#888888"
                    break
                case "C":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#886600"
                    break
                case "T":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#666666"
                    break
                case "P":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#CCCCDD"
                    break
                case "B":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#AAAAFF"
                    break
                case "+":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#555588"
                    break
                case "?":
                    document.getElementById(`${row},${i}`).style.backgroundColor = "#557799"
                    break
            }
            i++
        }
    }
}

function onLoad(){
    environment = []
    while (environment.length < sideLength){
        environment.push([])
        while (environment[environment.length - 1].length < sideLength){
            environment[environment.length - 1].push(Object.keys(allowedConnections).toString().replaceAll(",", ""))
        }
    }
    finished = false
    while (!finished){
        tick()
    }
    document.getElementById("grid").innerHTML = generateTable(environment)
    colourTable(environment)
}
function tick(){
    if (finished){
        return
    }
    finished = singleCollapse()
}

function singleCollapse(){
    // Find collapse point
    let lowestEntropy = Infinity
    let pos = []
    for (row in environment){
        for (column in environment[row]){
            if (environment[row][column].length <= lowestEntropy && environment[row][column].length > 1){
                if (environment[row][column].length < lowestEntropy){
                    pos = []
                }
                lowestEntropy = environment[row][column].length
                pos.push([Number(row), Number(column)])
            }
        }
    }
    if (lowestEntropy == Infinity){
        return true
    }
    pos = pos[Math.floor(Math.random() * pos.length)]

    // Get Neighbours
    let neighbours = []
    if (pos[0] > 0){
        neighbours.push([pos[0] - 1, pos[1]])
    }
    if (pos[0] < sideLength - 1){
        neighbours.push([pos[0] + 1, pos[1]])
    }
    if (pos[1] > 0){
        neighbours.push([pos[0], pos[1] - 1])
    }
    if (pos[1] < sideLength - 1){
        neighbours.push([pos[0], pos[1] + 1])
    }

    // Collapse
    let options = environment[pos[0]][pos[1]]
    let proposal = options.charAt(Math.floor(Math.random() * options.length))
    let allNeighbours = ""
    for (cell in neighbours){
        allNeighbours += environment[neighbours[cell][0]][neighbours[cell][1]].repeat(60 / (environment[neighbours[cell][0]][neighbours[cell][1]].length))
    }
    while (!(allNeighbours.charAt(Math.floor(Math.random() * allNeighbours.length)) == proposal) && Math.random() > 0.005){
        proposal = options.charAt(Math.floor(Math.random() * options.length))
    }
    environment[pos[0]][pos[1]] = proposal

    updateNeighbours(pos)

    return false
}

function updateNeighbours(pos){
    let stack = [pos]
    let i = 0

    while (i < stack.length){
        pos = stack[i]
        // Get Neighbours
        let neighbours = []
        if (pos[0] > 0){
            neighbours.push([pos[0] - 1, pos[1]])
        }
        if (pos[0] < sideLength - 1){
            neighbours.push([pos[0] + 1, pos[1]])
        }
        if (pos[1] > 0){
            neighbours.push([pos[0], pos[1] - 1])
        }
        if (pos[1] < sideLength - 1){
            neighbours.push([pos[0], pos[1] + 1])
        }
        
        // Update Neighbours
        let currentCell = environment[pos[0]][pos[1]].split("")
        let neighbourOptions = ""
        for (char in currentCell) {
            neighbourOptions += allowedConnections[currentCell[char]]
            console.log(currentCell[char])
        }
        
        for (cell in neighbours){
            let i = 0
            while (i < environment[neighbours[cell][0]][neighbours[cell][1]].length){
                if (!(neighbourOptions.includes(environment[neighbours[cell][0]][neighbours[cell][1]].charAt(i)))){
                    environment[neighbours[cell][0]][neighbours[cell][1]] = environment[neighbours[cell][0]][neighbours[cell][1]].replaceAt(i, ".")
                    if(!stack.includes(neighbours[cell])){
                        stack.push(neighbours[cell])
                    }
                }
                i++
            }
            environment[neighbours[cell][0]][neighbours[cell][1]] = environment[neighbours[cell][0]][neighbours[cell][1]].replaceAll(".", "")
        }

        i++
    }
}