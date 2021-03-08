
const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']
const whiteKeys= document.querySelectorAll('.key.white')
const blackKeys=document.querySelectorAll('.key.black')
const songLink = document.querySelector('.song-link')
const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')


let recordingStartTime
let songNotes = current && current.notes

const keys= document.querySelectorAll('.key');
keys.forEach(key=>{
    key.addEventListener('click',()=>playNote(key))

})


const keyMap = [...keys].reduce((map, key) => {
  map[key.dataset.note] = key
  return map
}, {})
if (recordButton){recordButton.addEventListener('click', toggleRecording)}
if(saveButton){saveButton.addEventListener('click', saveSong)}

playButton.addEventListener('click', playSong)

document.addEventListener('keydown',e=>{
    if(e.repeat) return
    const key= e.key
    const whitekeyindex= WHITE_KEYS.indexOf(key)
    const blackkeyindex = BLACK_KEYS.indexOf(key)
    if(whitekeyindex>-1) playNote(whiteKeys[whitekeyindex])
    if(blackkeyindex>-1) playNote(blackKeys[blackkeyindex])
})



function toggleRecording(){
    recordButton.classList.toggle('active')
    if(isRecording()){
        startRecording()
    }else{
        stopRecording()
    }
}

function isRecording(){
    return recordButton!= null&& recordButton.classList.contains('active')
}

function startRecording(){
    recordingStartTime= Date.now()
    songNotes=[]
    playButton.classList.remove('show')
    saveButton.classList.remove('show')

}

function stopRecording(){
    playSong()
    playButton.classList.add('show')
    saveButton.classList.add('show')
}

function playSong() {
    if (songNotes.length === 0) return
    songNotes.forEach(note => {
      setTimeout(() => {
        playNote(keyMap[note.key])
      }, note.startTime)
    })
  }
  
function playNote(key) {
    if (isRecording()) recordNote(key.dataset.note)
    const noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.play()
    key.classList.add('active')
    noteAudio.addEventListener('ended', () => {
      key.classList.remove('active')
    })
  }

function recordNote(note) {
    songNotes.push({
      key: note,
      startTime: Date.now() - recordingStartTime
    })
  }

function saveSong() {
    axios.post('/songs', { songNotes: songNotes }).then(res => {
      songLink.classList.add('show')
      songLink.href = `/songs/${res.data._id}`
    })
}
  