let params = new URL(document.location).searchParams
let search = ""
let loopInt = ""
let hq = document.querySelector(".hqposts").checked
let loop = 0
let marge = 0
let page = 0
let loading = false
let tick = Date.now()
let id = [0, 0, 0]

let savedata = {
  "copyright": [],
  "artist": [],
  "character": [],
  "meta": [],
  "favourites": []
}

let data = JSON.parse(localStorage.getItem("ALT34"))
if (data != null){
    savedata = data
}

if (params.get("id") != null){
    search = "id:" + params.get("id")
}

async function pornTime(page, tags){
    document.title = "Alt 34: Post " + tags.slice(3)
    fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}`).then(async (rule34) => {
        let pornZone = document.querySelector(".porn")
        pornZone.innerHTML = ""

        hq = document.querySelector(".hqposts").checked

        let newRule34 = ""
        try {
            newRule34 = await rule34.json()
            console.log(newRule34)
            if (newRule34.length == 0){
                loop = 0
            }
        } catch {
            pornZone.innerHTML = "<p style='width: 100vw'><h1 style='width: max-content; margin: auto'>Nobody here but us chickens!</h1></p>"

            clearInterval(loopInt)
            return
        }

        let temp = document.createElement("img")
            
        if (newRule34[0].file_url.endsWith(".mp4")){
            temp = document.createElement("video")
            temp.style.maxWidth = "720px"
            temp.style.maxHeight = "720px"
            temp.controls = true
            temp.loop = true
        }
        
        temp.className = "r34lq" + id[0]

        if (hq || newRule34[0].file_url.endsWith(".mp4")){
            temp.src = newRule34[0].file_url
        } else {
            temp.src = newRule34[0].sample_url
        }
        
        pornZone.appendChild(temp)

        if (newRule34[0].parent_id != 0){
            document.querySelector(".parent").innerHTML = "<p>Parent:</p>"
            document.querySelector(".parent").innerHTML += `<a href="./index.html?id=${newRule34[0].parent_id}">${newRule34[0].parent_id}</a><br>`
        }

        document.querySelector(".cotags").innerHTML = ""
        document.querySelector(".atags").innerHTML = ""
        document.querySelector(".chtags").innerHTML = ""
        document.querySelector(".mtags").innerHTML = ""
        document.querySelector(".ftags").innerHTML = ""
        document.querySelector(".tags").innerHTML = ""

        let tagsList = newRule34[0].tags.split(" ")
        let toRemove = []

        for (let x = 0; x < tagsList.length; x++){
            if (savedata.copyright.includes(tagsList[x])){
                document.querySelector(".cotags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
                + `<button onclick="removeTagFrom('${tagsList[x]}', 'copyright')">-</button><br>`
                toRemove.push(x)
            }
        }

        for (let x = 0; x < tagsList.length; x++){
            if (savedata.artist.includes(tagsList[x])){
                document.querySelector(".atags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
                + `<button onclick="removeTagFrom('${tagsList[x]}', 'artist')">-</button><br>`
                toRemove.push(x)
            }
        }

        for (let x = 0; x < tagsList.length; x++){
            if (savedata.character.includes(tagsList[x])){
                document.querySelector(".chtags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
                + `<button onclick="removeTagFrom('${tagsList[x]}', 'character')">-</button><br>`
                toRemove.push(x)
            }
        }

        for (let x = 0; x < tagsList.length; x++){
            if (savedata.meta.includes(tagsList[x])){
                document.querySelector(".mtags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
                + `<button onclick="removeTagFrom('${tagsList[x]}', 'meta')">-</button><br>`
                toRemove.push(x)
            }
        }

        for (let x = 0; x < tagsList.length; x++){
            if (savedata.favourites.includes(tagsList[x])){
                document.querySelector(".ftags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
                + `<button onclick="removeTagFrom('${tagsList[x]}', 'favourites')">-</button><br>`
                toRemove.push(x)
            }
        }

        toRemove.sort((a, b) => a - b)
        console.log(toRemove)
        for (let x = 0; x < toRemove.length; x++){
            console.log(tagsList[toRemove[x]-(x)])
            tagsList.splice(toRemove[x]-(x), 1)
        }

        for (let x = 0; x < tagsList.length; x++){
            document.querySelector(".tags").innerHTML += `<a style="margin: 4px" href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a>`
            + `<button onclick="addTagTo('${tagsList[x]}', 'copyright')">+Co</button>`
            + `<button onclick="addTagTo('${tagsList[x]}', 'artist')">+A</button>`
            + `<button onclick="addTagTo('${tagsList[x]}', 'character')">+Ch</button>`
            + `<button onclick="addTagTo('${tagsList[x]}', 'meta')">+M</button>`
            + `<button onclick="addTagTo('${tagsList[x]}', 'favourites')">+F</button><br>`
        }
    })
}

function addTagTo(tag, list){
    if (!savedata[list].includes(tag)){
        savedata[list].push(tag)
        
        localStorage.setItem('ALT34', JSON.stringify(savedata))
    }
}

function removeTagFrom(tag, list){
    if (savedata[list].includes(tag)){
        savedata[list].splice(savedata[list].indexOf(tag), 1)
        
        localStorage.setItem('ALT34', JSON.stringify(savedata))
    }
}

pornTime(0, search)