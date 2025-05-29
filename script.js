let params = new URL(document.location).searchParams
let search = ""
let loopInt = ""
let speed = document.querySelector(".speedSelect").value
let request = document.querySelector(".requestSpeed").value
let mp4 = {
    "enabled": document.querySelector(".mp4posts").checked,
    "loop": document.querySelector(".loopmp4posts").checked,
    "silent": document.querySelector(".silencemp4posts").checked
}
let loop = 0
let marge = 0
let loading = false
let tick = Date.now()
let id = [0, 0, 0]

if (params.get("tags") != null){
    search = params.get("tags")
    document.querySelector('.searchShit').style.display = 'none'
    document.querySelector('.porn').style.height = "100vh"
    document.querySelector('.pornhq').style.height = "100vh"
    document.title = 'Scroll 34 / ' + search
}

if (document.querySelector(".aiposts").checked){
    search += "+-ai_generated+-ai_assisted+-ai+-ai_upscaled+-ai_generated_background+-ai-created+-ai-generated"
}

loopInt = setInterval(looporn, 100)

if (params.get("speed") != null){
    speed = params.get("speed")
}

if (params.get("req") != null){
    request = params.get("req")
}

if (params.get("mp4") != null){
    mp4 = JSON.parse(params.get("mp4"))
}

async function pornTime(page, tags){
    loading = true
    mp4.enabled = document.querySelector(".mp4posts").checked
    fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=${tags}&pid=${page}`).then(async (rule34) => {
        let pornZone = document.querySelector(".porn")
        let pornZoneHQ = document.querySelector(".pornhq")
        
        let newRule34 = ""
        try {
            newRule34 = await rule34.json()
            if (newRule34.length == 0){
                loop = 0
            }
        } catch {
            document.querySelector('.searchShit').style.display = 'block'
            pornZone.style.height = '25vh'
            pornZone.innerHTML = "<p style='width: 100vw'><h1 style='width: max-content; margin: auto'>Nobody here but us chickens!</h1></p>"
            pornZoneHQ.style.height = '25vh'
            pornZoneHQ.innerHTML = ""

            pornZone.style.left = `0px`
            pornZoneHQ.style.left = `0px`

            clearInterval(loopInt)
            return
        }

        for (let x = 0; x < newRule34.length; x++){
            if (newRule34[x].file_url.endsWith(".mp4") && mp4.enabled){
                continue
            }

            let temp = document.createElement("img")
            
            temp.className = "r34lq" + id[0]
            temp.src = newRule34[x].sample_url

            temp.onclick = ()=>{
                window.open('https://rule34.xxx/index.php?page=post&s=view&id=' + newRule34[x].id, '_blank').focus()
            }

            temp.style.height = "100%"
            pornZone.appendChild(temp)

            let tempHQ = document.createElement("img")
            if (newRule34[x].file_url.endsWith(".mp4")){
                tempHQ = document.createElement("video")
                tempHQ.loop = mp4.loop
                tempHQ.volume = [document.querySelector(".volumeSelect").value, 0][mp4.silent+0] //silencemp4posts
            }
            tempHQ.className = "r34hq" + id[0]
            tempHQ.src = newRule34[x].file_url

            tempHQ.onclick = ()=>{
                window.open('https://rule34.xxx/index.php?page=post&s=view&id=' + newRule34[x].id, '_blank').focus()
            }

            tempHQ.style.height = "100%"
            pornZoneHQ.appendChild(tempHQ)

            id[0]++
        }

        setTimeout(()=>{loading = false}, request)
    })
}

function looporn(){
    let d = (Date.now()-tick)/1000
    tick = Date.now()

    let pornZone = document.querySelector(".porn")
    let pornZoneHQ = document.querySelector(".pornhq")

    // if (id[1] < id[0]-1){
    //     if (document.querySelector(".r34hq" + id[1]).src.endsWith(".mp4")){
    //         if (document.querySelector(".r34hq" + id[1]).getBoundingClientRect().right < 0){
    //             document.querySelector(".r34hq" + id[1]).pause()
    //             id[1]++
    //         }
    //     } else {
    //         id[1]++
    //     }
    // }

    // if (id[2] < id[0]-1){
    //     if (document.querySelector(".r34hq" + id[2]).src.endsWith(".mp4")){
    //         if (document.querySelector(".r34hq" + id[2]).getBoundingClientRect().left < screen.width){
    //             document.querySelector(".r34hq" + id[2]).play()
    //             id[2]++
    //         }
    //     } else {
    //         id[2]++
    //     }
    // }

    document.querySelector(".posts").textContent = id[0]
    document.querySelector(".speedDisp").textContent = document.querySelector(".speedSelect").value
    document.querySelector(".requestDisp").textContent = document.querySelector(".requestSpeed").value
    document.querySelector(".volumeDisp").textContent = Math.round(document.querySelector(".volumeSelect").value*100)
    document.querySelector(".volzone").style.display = ["block", "none"][document.querySelector(".silencemp4posts").checked+0]
    if (pornZone.style.height != '100vh'){
        speed = document.querySelector(".speedSelect").value
    }

    if (pornZone.getBoundingClientRect().right <= screen.width*2){
        if (!loading){
            pornTime(loop*100, search)
            loop++
        }
    }

    if (pornZone.getBoundingClientRect().right <= screen.width+(speed/1000)){
        return
    }

    if (d > 1){
        return
    }

    marge -= speed*d

    if (pornZone.style.height != '100vh'){
        pornZone.style.left = `${marge}px`
        pornZoneHQ.style.left = `${marge}px`
    } else {
        pornZone.style.left = `${marge}px`
        pornZoneHQ.style.left = `${marge}px`
    }
}

function searchPosts(){
    clearInterval(loopInt)
    loading = false
    loop = 0
    marge = 0
    speed = document.querySelector('.speedSelect').value
    tick = Date.now()
    loopInt = setInterval(looporn, 100)
    search = document.querySelector('.search').value
    id = [0,0,0]
    document.title = 'Scroll 34 / ' + document.querySelector('.search').value
    if (document.querySelector('.aiposts').checked){search += '+-ai_generated+-ai_assisted+-ai+-ai_upscaled+-ai_generated_background+-ai-created+-ai-generated'}
    if (document.querySelector('.mp4posts').checked){search += '+-mp4+-sound+-video'}
    document.querySelector('.porn').innerHTML = ''
    document.querySelector('.pornhq').innerHTML = ''
}

function fullscreen(){
    window.open(
        window.location.href
        + '?tags=' + search.replaceAll(' ', '+')
        + '&speed=' + speed
        + '&req=' + request
        + '&mp4=' + JSON.stringify(mp4)
        , '_blank').focus()
}