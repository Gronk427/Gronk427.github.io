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

if (params.get("id") != null){
    search = "id:" + params.get("id")
}

async function pornTime(page, tags){
    document.title = "Alt 34: " + tags.slice(3)
    fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}`).then(async (rule34) => {
        let pornZone = document.querySelector(".porn")
        pornZone.innerHTML = ""

        hq = document.querySelector(".hqposts").checked

        let newRule34 = ""
        try {
            newRule34 = await rule34.json()
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
        
        console.log(newRule34[0])
        pornZone.appendChild(temp)

        document.querySelector(".tags").innerHTML = ""
        if (newRule34[0].parent_id != 0){
            document.querySelector(".tags").innerHTML += "<p>Parent:</p>"
            document.querySelector(".tags").innerHTML += `<a href="./index.html?id=${newRule34[0].parent_id}">${newRule34[0].parent_id}</a><br>`
        }

        let tagsList = newRule34[0].tags.split(" ")
        document.querySelector(".tags").innerHTML += "<p>Tags:</p>"
        for (let x = 0; x < tagsList.length; x++){
            document.querySelector(".tags").innerHTML += `<a href="../search/index.html?tags=${tagsList[x]}">${tagsList[x].replaceAll("_", " ")}</a><br>`
        }
    })
}

pornTime(0, search)