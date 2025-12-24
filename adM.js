handHoldData = {
    "v": {
        left: 5,
        right: 5,
        down: 10,
        wall: 10,
    },
    ">": {
        left: 2,
        right: 10,
        down: 5,
        wall: 10,
    },
    "<": {
        left: 10,
        right: 2,
        down: 5,
        wall: 10,
    },
    "o": {
        left: 5,
        right: 5,
        down: 5,
        wall: 1,
    },
    "n": {
        left: 3,
        right: 3,
        down: 1,
        wall: 5,
    },
    "-": {
        left: 2,
        right: 2,
        down: 10,
        wall: 1,
    },
    "(": {
        left: 5,
        right: 2,
        down: 4,
        wall: 3,
    },
    ")": {
        left: 2,
        right: 5,
        down: 4,
        wall: 3,
    },
    " ": {
        left: 1,
        right: 1,
        down: 1,
        wall: 0,
    },
}
looseLimb = ""
limbPositions = {
    leftHand: [4, 3],
    rightHand: [4, 6],
    leftFoot: [0, 3],
    rightFoot: [0, 6],
}
startingPositions = {
    leftHand: [4, 3],
    rightHand: [4, 6],
    leftFoot: [0, 3],
    rightFoot: [0, 6],
}

wall = [
    "vvvvvvvvvv".split(""),
    "vvvvvvvvvv".split(""),
    "vvvvvvvvvv".split(""),
    "vvvvvvvvvv".split(""),
    "----------".split(""),
    "          ".split(""),
    "    v  )  ".split(""),
    "          ".split(""),
    "   -  -   ".split(""),
    "    <     ".split(""),
    "          ".split(""),
    "     >    ".split(""),
    "  o       ".split(""),
    "   v  v   ".split(""),
    "  (       ".split(""),
    "  (       ".split(""),
    "  (  -    ".split(""),
    "   -  -   ".split(""),
]

function generateTable(data){
    let output = ""
    for (row in data){
        output += "<tr>"
        let i = 0
        while (i < data[row].length){
            output += `<th id="${data.length - 1 - row},${i}" onclick="onClick(${data.length - 1 - row}, ${i})" class="climb">` + data[row][i] + "</th>"
            i++
        }
        output += "</tr>"
    }

    return output
}

function colourTable(data){
    let i = 0
    for (limb in data){
        document.getElementById(`${data[limb][0]},${data[limb][1]}`).style.backgroundColor = ["#55CC99", "#5599CC", "#CCCC55", "#CC9955"][i]
        i++
    }
}

function newLevel(){
    for (i in limbPositions){
        limbPositions[i] = startingPositions[i]
    }
    looseLimb = ""
    document.getElementById("grid").innerHTML = generateTable(wall)
    colourTable(limbPositions)
    checkGrip()
}

setTimeout(newLevel, 100)

function onClick(row, column){
    let aliasLimbPositions = []
    for (array in Object.values(limbPositions)){
        aliasLimbPositions.push(`${Object.values(limbPositions)[array][0]}, ${Object.values(limbPositions)[array][1]}`)
    }
    if(looseLimb == ""){
        if (!aliasLimbPositions.includes(`${row}, ${column}`)){
            return
        }
        let currentLimb = Object.keys(limbPositions)[aliasLimbPositions.indexOf(`${row}, ${column}`)]
        looseLimb = currentLimb
        limbPositions[currentLimb] = "none"
        document.getElementById(`${row},${column}`).style.backgroundColor = "#333366"

        checkGrip()
        return
    }

    if (aliasLimbPositions.includes(`${row}, ${column}`)){
        return
    }
    if (distance(centerOfMass(limbPositions), [row, column]) > 5){
        document.getElementById("errorMessage").innerHTML = "You can't reach that far."
        return
    }
    if (looseLimb.includes("Foot") && distance(centerOfMass([limbPositions["leftFoot"], limbPositions["rightFoot"]]), [row, column]) > 4){
        document.getElementById("errorMessage").innerHTML = "You can't reach that far."
        return
    }
    limbPositions[looseLimb] = [row, column]
    looseLimb = ""
    colourTable(limbPositions)

    checkGrip()
}

function checkGrip(){
    playerGrip = calculateGrip()
    if (playerGrip["left"] < 1){
        document.getElementById("errorMessage").innerHTML = "You didn't have enough support to your left, and you fell off!"
        newLevel()
    }
    if (playerGrip["right"] < 1){
        document.getElementById("errorMessage").innerHTML = "You didn't have enough support to your right, and you fell off!"
        newLevel()
    }
    if (playerGrip["down"] < 1){
        document.getElementById("errorMessage").innerHTML = "You didn't have enough support pushing you upwards, and you fell off!"
        newLevel()
    }
    if (playerGrip["wall"] < 1){
        document.getElementById("errorMessage").innerHTML = "You didn't have enough support pulling you towards the wall, and you fell off!"
        newLevel()
    }

    document.getElementById("grip").innerHTML = `Support:<br>Left: ${format(playerGrip["left"])}. Right: ${format(playerGrip["right"])}. Upwards: ${format(playerGrip["down"])}. Wall: ${format(playerGrip["wall"])}. `
}
function format(num){
    return Math.floor(num * 100) / 100
}


function centerOfMass(limbs = limbPositions){
    let limbCount = 0
    let row = 0
    let column = 0
    for (limb in limbs){
        if (limbs[limb] != "none"){
            limbCount += 1
            row += limbs[limb][0]
            column += limbs[limb][1]
        }
    }
    row /= limbCount
    column /= limbCount
    return [row, column]
}
function distance(source, target){
    let distY = target[0] - source[0]
    let distX = target[1] - source[1]
    return (distY ** 2 + distX ** 2) ** 0.5
}
function angle(source, target){
    let distY = target[0] - source[0]
    let distX = target[1] - source[1]
    let angle = Math.atan(Math.abs(distX) / Math.abs(distY)) * (180 / Math.PI)
    if (distX > 0){
        if (distY > 0){
            return angle
        }
        else {
            return 180 - angle
        }
    }
    else {
        if (distY > 0){
            return 360 - angle
        }
        else {
            return 180 + angle
        }
    }
}

function calculateGrip(){
    let grip = {
        left: 0,
        right: 0,
        down: 0,
        wall: 0,
    }

    let limbs = ["leftHand", "rightHand", "leftFoot", "rightFoot"]
    let limb = ""
    for (limb in limbs){
        if (limbPositions[limbs[limb]] != "none"){
            let pos = limbPositions[limbs[limb]]
            let thisGrip = {
                left: 0,
                right: 0,
                down: 0,
                wall: 0,
            }
            let distanceGripScaling = (((distance(centerOfMass(), pos) - 2.5) ** 2) + 2) ** -1
            thisGrip["left"] = handHoldData[wall[wall.length - 1 - pos[0]][pos[1]]]["left"] * distanceGripScaling
            thisGrip["right"] = handHoldData[wall[wall.length - 1 - pos[0]][pos[1]]]["right"] * distanceGripScaling
            thisGrip["down"] = handHoldData[wall[wall.length - 1 - pos[0]][pos[1]]]["down"] * distanceGripScaling
            thisGrip["wall"] = handHoldData[wall[wall.length - 1 - pos[0]][pos[1]]]["wall"] * distanceGripScaling


            if(limbs[limb].includes("Hand")){
                thisGrip["left"] *= cosine(angle(centerOfMass(), pos) - 300) + 1
                thisGrip["right"] *= cosine(angle(centerOfMass(), pos) - 60) + 1
                thisGrip["down"] *= cosine(angle(centerOfMass(), pos)) + 1
                thisGrip["wall"] *= 2
            }
            else{
                thisGrip["left"] *= cosine(angle(centerOfMass(), pos) - 225) + 1
                thisGrip["right"] *= cosine(angle(centerOfMass(), pos) - 135) + 1
                thisGrip["down"] *= cosine(angle(centerOfMass(), pos) - 180) + 1
                thisGrip["down"] *= 2
                thisGrip["wall"] /= 2
            }

            grip["left"] += thisGrip["left"]
            grip["right"] += thisGrip["right"]
            grip["down"] += thisGrip["down"]
            grip["wall"] += thisGrip["wall"]
        }
    }

    grip["left"] /= 3
    grip["right"] /= 3
    grip["down"] /= 15
    grip["wall"] /= 2
    return grip
}
/*
Grip
+= handhold's values
    / (distance to Centre of Mass - 2.5) ** 2 + 5       if distance > 5, stretch was too far
    * cos(angle from up + ideal angle) + 1, for each type
    left: ideal 300
    right: ideal 60
    down: ideal 180 if foot, 0 if hand
    wall: don't apply effect

    if limb is foot, double down grip
    if limb is hand, double wall grip
*/

function cosine(theta){
    return Math.cos(theta / (180 / Math.PI))
}

playerGrip = calculateGrip()