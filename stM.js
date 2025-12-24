direction = ""

level = 0
levels = [
    "<br>######<br>#@...#<br>#....#<br>#..!.#<br>#....#<br>####x#",
    "<br>#######<br>#@....#<br>#!....#<br>#....!#<br>#.....#<br>#####x#",
    "<br>#########<br>#@......#<br>#.......#<br>#...!...#<br>#..!x!..#<br>#...!...#<br>#.......#<br>#.......#<br>#########",
    "<br>########<br>#@.....#<br>##...#!#<br>#!.....#<br>#......#<br>#......#<br>#....#!#<br>######x#",
    "<br>#######<br>#@....#<br>#.....#<br>#.....#<br>#Well.#<br>#Done!#<br>#####x#",
    "<br>######<br>##...#<br>#@...#<br>#....#<br>#.~!.#<br>##x###",
    "<br>#####<br>#@..#<br>#~#.#<br>x!#.#<br>#...#<br>#.#.#<br>#...#<br>#####",
    "<br>##########<br>#@.......#<br>#....###.#<br>#...!~x#.#<br>#....###.#<br>#........#<br>##########",
    "<br>###<br>#@#<br>###"
]

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function onLoad(){
    const field = document.getElementById("field")
    field.innerHTML = levels[level]
}

setTimeout(onLoad, 100)
setInterval(gameLoop, 100)

function getColumnCount(){
    const field = document.getElementById("field")
    let columnCount = 0
    while (field.innerHTML.charAt(columnCount + 4) != "<"){
        columnCount += 1
    }
    return columnCount
}
function getPosition(index){
    let columnCount = getColumnCount()
    let row = Math.floor(index / (columnCount + 4))
    let column = (index % (columnCount + 4)) - 4
    return [row, column]
}
function getIndex(position){
    row = position[0]
    column = position[1]
    let columnCount = getColumnCount()
    return column + 4 + (row * (columnCount + 4))
}

function gameLoop(){
    const field = document.getElementById("field")

    // ------------------------------------------------------------------------- Player Section
    if (direction == ""){
        return
    }

    let playerPos = getPosition(field.innerHTML.indexOf("@"))
    switch(direction){
        case "up":
            playerPos[0] -= 1
            break
        case "down":
            playerPos[0] += 1
            break
        case "left":
            playerPos[1] -= 1
            break
        case "right":
            playerPos[1] += 1
            break
    }
    direction = ""
    console.log(playerPos)
    console.log(field.innerHTML.charAt(getIndex(playerPos)))
    switch(field.innerHTML.charAt(getIndex(playerPos))){
        case "#":
            playerPos = getPosition(field.innerHTML.indexOf("@"))
            break
        case "!":
            field.innerHTML = levels[level]
            playerPos = getPosition(field.innerHTML.indexOf("@"))
            return
        case "x":
            level += 1
            field.innerHTML = levels[level]
            playerPos = getPosition(field.innerHTML.indexOf("@"))
            return
        case ".":
            field.innerHTML = field.innerHTML.replaceAt(field.innerHTML.indexOf("@"), ".")
            field.innerHTML = field.innerHTML.replaceAt(getIndex(playerPos), "@")
            break
    }

    // ------------------------------------------------------------------------- ! Enemy Section
    let enemies = []
    while (field.innerHTML.includes("!")){
        enemies.push(getPosition(field.innerHTML.indexOf("!")))
        field.innerHTML = field.innerHTML.replaceAt(field.innerHTML.indexOf("!"), ".")
    }
    while (enemies.length > 0){
        let thisEnemy = enemies.shift()
        let startPos = Array.from(thisEnemy)
        if (thisEnemy[0] == playerPos[0]){
            if (playerPos[1] > thisEnemy[1]){
                thisEnemy[1] += 1
            }
            if (playerPos[1] < thisEnemy[1]){
                thisEnemy[1] -= 1
            }
        }
        else if (thisEnemy[1] == playerPos[1]) {
            if (playerPos[0] > thisEnemy[0]){
                thisEnemy[0] += 1
            }
            if (playerPos[0] < thisEnemy[0]){
                thisEnemy[0] -= 1
            }
        }
        if (field.innerHTML.charAt(getIndex(thisEnemy)) == "#" || field.innerHTML.charAt(getIndex(thisEnemy)) == "x"){
            thisEnemy = Array.from(startPos)
        }

        field.innerHTML = field.innerHTML.replaceAt(getIndex(thisEnemy), "!")
        if (playerPos[0] == thisEnemy[0] && playerPos[1] == thisEnemy[1]){
            field.innerHTML = levels[level]
            playerPos = getPosition(field.innerHTML.indexOf("@"))
            return
        }
    }
}
