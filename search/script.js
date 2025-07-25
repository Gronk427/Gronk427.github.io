let params = new URL(document.location).searchParams
let search = ""
let loopInt = ""
let loop = 0
let marge = 0
let page = 0
let loading = false
let tick = Date.now()
let id = [0, 0, 0]

document.querySelector('.thumbsizeDisp').innerHTML = document.querySelector(".thumbsize").value

if (params.get("tags") != null){
    document.querySelector(".search").value = params.get("tags")
}

async function pornTime(page, tags){
    document.title = "Alt 34: " + tags
    if (document.querySelector(".aiposts").checked){
        tags += "+-ai_generated+-ai_assisted+-ai+-ai_upscaled+-ai_generated_background+-ai-created+-ai-generated"
    }

    console.log(tags)
    fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&pid=${page}`).then(async (rule34) => {
        let pornZone = document.querySelector(".porn")
        pornZone.innerHTML = ""
        
        let newRule34 = ""
        try {
            newRule34 = await rule34.json()
            if (newRule34.length == 0){
                pornZone.innerHTML = "<h1 style='text-allign: center; width: calc(100vw - 240px); padding-top: 128px'>Nobody here but us chickens!</h1>"
            }
        } catch {
            pornZone.innerHTML = "<h1 style='text-allign: center; width: calc(100vw - 240px); padding-top: 128px'>Nobody here but us chickens!</h1>"

            clearInterval(loopInt)
            return
        }

        console.log(newRule34)

        for (let x = 0; x < newRule34.length; x++){
            let container = document.createElement("div")
            let temp = document.createElement("img")
            
            temp.className = "r34lq" + id[0]
            temp.src = newRule34[x].preview_url

            if (newRule34[x].file_url.endsWith(".mp4")){
                temp.style.outline = "2px solid blue"
            }
            
            if (x == 0){
                console.log(newRule34[x])
            }

            temp.onclick = ()=>{
                window.open('../view/index.html?id=' + newRule34[x].id, '_blank').focus()
            }

            temp.style.margin = "auto"
            temp.style.maxWidth = document.querySelector(".thumbsize").value + "px"
            temp.style.maxHeight = document.querySelector(".thumbsize").value + "px"
            container.appendChild(temp)
            
            container.style.width = document.querySelector(".thumbsize").value + "px"
            container.style.height = document.querySelector(".thumbsize").value + "px"
            container.style.margin = "4px"
            container.style.display = "block"

            pornZone.appendChild(container)

            id[0]++
        }
    })
}

function searchPosts(){
    search = document.querySelector(".search").value
    document.querySelector(".pageNo").innerHTML = page+1
    pornTime(page, search)
}

searchPosts()