let arr = []
const States = {
    WElem: null,
    CElem: null,
    Ended: false,
    Frozen: [],

    Set(a, b) {
        [this.WElem, this.CElem] = [a, b]
    }
}

window.onload = ()=>{
    for (const Sort of Sorts){
        document.body.appendChild((()=>{
            const button = document.createElement("button")
            button.innerHTML = Sort.Name
            button.onclick = ()=> StartSort(Sort.Callback)
            button.style.fontSize = `${~~(50/Sorts.length)}vh`
            return button
        })())

        document.body.appendChild(document.createElement("p"))
    }   

    const input = (()=>{
        const input = document.createElement("input")
        ;[input.type, input.min, input.max, input.value] = ["range", 2, 1000, 100]

        input.style.width = "30vw"
        input.style.fontSize = input.style.height = "10vh"

        return input
    })()

    document.body.appendChild(input)

    document.body.appendChild((()=>{
        const div = document.createElement("div")
        div.style.fontSize = "5vh"
        div.innerHTML = `Array Size: ${input.value}`
        div.id = "count"
        return div
    })())

    input.oninput = (e)=> document.getElementById("count").innerHTML = `Array Size: ${e.srcElement.value}`
}

function StartSort(callback) {
    canvas = document.getElementById("canvas")
    ;[canvas.width, canvas.height] = [document.documentElement.clientWidth, document.documentElement.clientHeight]
    context = canvas.getContext('2d')

    const input = document.querySelector("input")
    Init(Math.max(input.min, Math.min(input.max, input.value))+1)
    ;[...document.querySelectorAll("button"), input, document.getElementById("count")].forEach(i => document.body.removeChild(i))

    document.getElementById("back").style.display = "block"
    
    Main()
    setTimeout(()=> callback(arr), 1000)
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function PlayNote(value) {
    const startFreq = 20, endFreq = 20000
    let stepSize = Math.pow(endFreq / startFreq, 1 / arr.length)
    const frequency = startFreq * Math.pow(stepSize, value);

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function Init(len){
    for (let i=1;i<len;i++) 
        arr.push(i)
    arr.sort(() => (Math.random() > .5) ? 1 : -1)
}

async function EndAnim(){
    await Sleep(100)
    States.WElem = null

    for (let i=0;i<arr.length;i++){
        PlayNote(arr[i])
        States.Frozen.push(arr[i])
        States.CElem = arr[i]
        await Sleep(0)
    }
}

function Main(){
    window.requestAnimationFrame(Main)
    context.clearRect(0,0,canvas.width, canvas.height)

    const width = canvas.width/arr.length
    for (let i=0;i<arr.length;i++){
        const height = canvas.height/arr.length*arr[i]
        
        context.fillStyle = States.CElem==arr[i] || States.Frozen.includes(arr[i]) ? "lime" : States.WElem==arr[i] ? "red" : "white"
        context.fillRect(i*width, canvas.height-height, width, height)
    }
}

const Sleep = (interval) => new Promise(resolve=>setTimeout(resolve, interval))