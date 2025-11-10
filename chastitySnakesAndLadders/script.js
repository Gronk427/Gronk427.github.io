let challengeData = {
    "tutorial": [false, 9e99],
    "lock1": [false, 9e99],
    "vanilla": [false, 9e99],
    "mirrorVanilla": [false, 9e99],
    "overflowVanilla": [false, 9e99],
    "sas": [false, 9e99],
    "shuffleVanilla": [false, 9e99],
    "longVanilla": [false, 9e99],
    "d20": [false, 9e99],
    "master": [false, 9e99],
    "master2": [false, 9e99],
    "luck": [false, 9e99]
}

let challengeSaveData = localStorage.getItem("ChastitySnakesAndLaddersChallenges")
if (challengeSaveData != null){
    challengeSaveData = JSON.parse(challengeSaveData)
    for (let x = 0; x < Object.keys(challengeSaveData).length; x++){
        challengeData[Object.keys(challengeSaveData)[x]] = challengeSaveData[Object.keys(challengeSaveData)[x]]
    }
    console.log(challengeData)
}

let simulation = {
    "latestBatch": [],
    "averageTime": 0,
    "originalPos": 0,
    "simInterval": ""
}

let player = {
    "pos": 0,
    "mirror": false,
    "100rule": "wait",
    "inChallenge": false,
    "start": 9e99,
    "lockCode": undefined,
    "wait": {
        "duration": 6000,
        "start": 0
    },
    "dice": {
        "count": 0,
        "faces": 6,
        "latest": []
    },
    "board": []
}

let playerSaveData = localStorage.getItem("ChastitySnakesAndLaddersGame")
if (playerSaveData != null){
    player = JSON.parse(playerSaveData)

    document.querySelector(".game").style.display = "block"
    renderBoard()
    simulateGame()
    moveCounter(player.pos)

    document.querySelector(".customGame").style.display = "none"
    document.querySelector(".challenges").style.display = "none"

    player.lockCode = document.querySelector(".lockBoxCode").value

    if (player.lockCode != undefined){
        document.querySelector(".lockBoxCode").type = "password"
        document.querySelector(".lockBoxCode").setAttribute("disabled", "")
    }
}

function startChallenge(movers, duration, count, faces, rule100, id){
    player.board = []
    player.pos = 1
    player.wait.duration = duration*1000
    player.wait.start = Date.now()-player.wait.duration+10000
    player.start = Date.now()+10000
    player.dice.count = count
    player.dice.faces = faces
    player["100rule"] = rule100

    for (let x = 0; x < movers; x++){
        let loop = 0
        let seed = Math.ceil(Math.random()*98)+1
        while (player.board[seed] != undefined){
            seed = Math.ceil(Math.random()*98)+1
            loop++
        }

        let seed2 = Math.ceil(Math.random()*98)+1
        while (seed == seed2){
            seed2 = Math.ceil(Math.random()*98)+1
        }

        player.board[seed] = seed2
    }

    document.querySelector(".game").style.display = "block"
    renderBoard()
    simulateGame()
    moveCounter(1)

    player.inChallenge = id
}

function startGame(){
    let movers = parseInt(document.querySelector(".moverCount").value)
    player.board = []
    player.pos = 1
    player.wait.duration = parseInt(document.querySelector(".waitDuration").value)*1000
    player.wait.start = Date.now()-player.wait.duration+10000
    player.dice.count = parseInt(document.querySelector(".diceCount").value)
    player.dice.faces = parseInt(document.querySelector(".diceFaces").value)
    player["100rule"] = document.querySelector(".rule100").value

    for (let x = 0; x < movers; x++){
        let loop = 0
        let seed = Math.ceil(Math.random()*98)+1
        while (player.board[seed] != undefined){
            seed = Math.ceil(Math.random()*98)+1
            loop++
        }

        let seed2 = Math.ceil(Math.random()*98)+1
        while (seed == seed2){
            seed2 = Math.ceil(Math.random()*98)+1
        }

        player.board[seed] = seed2
    }

    document.querySelector(".game").style.display = "block"
    renderBoard()
    simulateGame()
    moveCounter(1)

    player.inChallenge = false
}

function roll(invisible=false){
    if (player.wait.duration-(Date.now()-player.wait.start) > 0 && !invisible || player.pos == 100){return}
    let roll = 0
    let delay = 0

    player.dice.latest = []
    for (let x = 0; x < player.dice.count; x++){
        let newRoll = Math.ceil(Math.random()*player.dice.faces)
        roll += newRoll
        player.dice.latest.push(newRoll)
    }

    if (!invisible){
        if (player.dice.count > 1){
            document.querySelector(".latestRoll").textContent = "Last Roll: " + player.dice.latest.join(" + ") + " = " + player.dice.latest.reduce((acc, curr) => acc + curr, 0)
        } else {
            document.querySelector(".latestRoll").textContent = "Last Roll: " + roll
        }
        document.querySelector(".customGame").style.display = "none"
        document.querySelector(".challenges").style.display = "none"

        player.lockCode = document.querySelector(".lockBoxCode").value

        if (player.lockCode != undefined){
            document.querySelector(".lockBoxCode").type = "password"
            document.querySelector(".lockBoxCode").setAttribute("disabled", "")
        }
    }

    for (let x = 0; x < roll; x++){
        if (player.pos < 100){
            if (!player.mirror){
                player.pos++
            } else {
                player.pos--
            }
        } else {
            if (player["100rule"] == "overflow"){
                player.pos = 1
            } else if (player["100rule"] == "wait"){
                player.pos = 100
                break
            } else if (player["100rule"] == "mirror"){
                player.pos--
                player.mirror = true
            }
        }
        let tempPos = Object.assign(player.pos, 0)
        if(!invisible){setTimeout(()=>{moveCounter(tempPos)}, delay)}
        delay += 250
    }

    if (player.board[String(player.pos)] != undefined){
        player.pos = player.board[String(player.pos)]
        let tempPos = Object.assign(player.pos, 0)
        if(!invisible){setTimeout(()=>{moveCounter(tempPos)}, delay)}
        delay += 250
    }

    if (player.pos == 100 && !invisible){
        setTimeout(winGame, delay)
        player.wait.start = 9e99
    }

    if (!invisible){
        player.wait.start = Date.now()
        localStorage.setItem("ChastitySnakesAndLaddersGame", JSON.stringify(player))
        simulateGame()
    }
    
    player.mirror = false
}

function winGame(){
    if (player.inChallenge != false){
        challengeData[player.inChallenge] = [true, (Date.now()-player.start)/1000]
        localStorage.setItem("ChastitySnakesAndLaddersChallenges", JSON.stringify(challengeData))
    }

    localStorage.removeItem("ChastitySnakesAndLaddersGame")

    document.querySelector(".lockBoxCode").value = player.lockCode
    document.querySelector(".lockBoxCode").type = "text"
    document.querySelector(".lockBoxCode").removeAttribute("disabled")
    
    document.querySelector(".game").style.display = "none"
    document.querySelector(".customGame").style.display = "block"
    document.querySelector(".challenges").style.display = "block"
}

function moveCounter(pos){
    pos--
    document.querySelector(".playerCounter").style.top = ((9-Math.floor(pos/10))*64)+24+"px"
    if (Math.floor(pos/10)%2 == 1){
        document.querySelector(".playerCounter").style.left = ((9-(pos%10))*64)+8+"px"
    } else {
        document.querySelector(".playerCounter").style.left = ((pos%10)*64)+8+"px"
        //console.log(pos)
        //console.log((Math.ceil((pos+0.1)/10)*10)-((pos)%10))
    }
}

function renderBoard(){
    document.querySelector(".board").innerHTML = ""
    for (let x = 99; x >= 0; x--){
        let tile = document.createElement("div")
        tile.style.width = "64px"
        tile.style.height = "64px"
        if (Math.floor((x%20)/10) == 1){
            tile.innerHTML = `<p style="margin: 0px; text-align: left; margin-left: 4px">${x+1}.</p>`

            if (player.board[String(x+1)] != undefined){
                //console.log(x+1)
                tile.innerHTML += `<p style="margin: 0px; text-align: center;">go to ${player.board[String(x+1)]}</p>`
            }

            if (x%2 == 1){
                tile.style.backgroundColor = "lightGray"
            } else {
                tile.style.backgroundColor = "gray"
            }
        } else {
            tile.innerHTML = `<p style="margin: 0px; text-align: left; margin-left: 4px">${(Math.ceil((x+0.1)/10)*10)-(((x)%10))}.</p>`

            if (player.board[String((Math.ceil((x+0.1)/10)*10)-(((x)%10)))] != undefined){
                tile.innerHTML += `<p style="margin: 0px; text-align: center;">go to ${player.board[String((Math.ceil((x+0.1)/10)*10)-(((x)%10)))]}</p>`
            }

            if (x%2 != 1){
                tile.style.backgroundColor = "lightGray"
            } else {
                tile.style.backgroundColor = "gray"
            }
        }

        document.querySelector(".board").appendChild(tile)
    }
}

function simulateGame(){
    simulation.latestBatch = []
    simulation.originalPos = player.pos
    simulation.simInterval = setInterval(()=>{
        if (Math.round((player.wait.duration-(Date.now()-player.wait.start))/1000) <= 0){clearInterval(simulation.simInterval); return}
        let simulationTime = 0
        let simulationTurns = 0
        while (player.pos != 100 && simulationTurns < 1000){
            roll(true)
            simulationTurns ++
            simulationTime += player.wait.duration
        }

        simulation.latestBatch.push(simulationTime)
        player.pos = simulation.originalPos
        simulation.averageTime = simulation.latestBatch.reduce((acc, curr) => acc + curr, 0)/simulation.latestBatch.length
    }, 0)
}

function formatTime(time){
    if (Math.floor(time/3600) < 24){
        let hms = [0, 0, 0]
        hms[0] = "00".slice(String(Math.floor(time/3600)).length) + Math.floor(time/3600)
        time = time%3600
        hms[1] = "00".slice(String(Math.floor(time/60)).length) + Math.floor(time/60)
        time = time%60
        hms[2] = "00".slice(String(Math.floor(time)).length) + Math.floor(time)
        return hms.join(":")
    } else if (Math.floor(time/86400) < 30){
        return Math.floor(time/8640)/10 + " days"
    } else if (Math.floor(time/86400) < 365){
        return Math.floor(time/(8640*30))/10 + " months"
    } else {
        return Math.floor(time/(8640*365))/10 + " years"
    }
}

setInterval(()=>{
    if (Math.round((player.wait.duration-(Date.now()-player.wait.start))/1000) > 0){
        document.querySelector(".rollTimer").textContent = formatTime(Math.round((player.wait.duration-(Date.now()-player.wait.start))/1000)) + " until next roll"
        document.querySelector(".rollTimer").innerHTML += "<br>Est " + formatTime(((player.wait.duration-(Date.now()-player.wait.start))+simulation.averageTime)/1000) + " until freedom"
    } else {
        document.querySelector(".rollTimer").textContent = "ready!"
        document.querySelector(".rollTimer").innerHTML += "<br>Est " + formatTime(simulation.averageTime/1000) + " until freedom"
    }

    document.querySelector(".diceDisp").textContent = "Roll with " + document.querySelector(".diceCount").value + " D" + document.querySelector(".diceFaces").value
    document.querySelector(".waitDurationDisp").textContent = formatTime(parseInt(document.querySelector(".waitDuration").value)) + " between rolls"
    document.querySelector(".moverCountDisp").textContent = document.querySelector(".moverCount").value + " snakes/ladders"
    document.querySelector(".playerCounter").style.backgroundColor = document.querySelector(".counterColour").value
    document.querySelector(".counterColourDisp").textContent = "Counter colour: " + document.querySelector(".counterColour").value.toLocaleUpperCase()

    let challengeKeys = Object.keys(challengeData)
    for (let x = 0; x < challengeKeys.length; x++){
        if (challengeData[challengeKeys[x]][0]){
            document.querySelector("." + challengeKeys[x] + "Completion").textContent = "Completed in " + formatTime(challengeData[challengeKeys[x]][1])
        } else {
            document.querySelector("." + challengeKeys[x] + "Completion").textContent = "Not Completed"
        }
    }
}, 100)