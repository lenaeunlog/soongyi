let bgm

export function initAudio() {
  if (!bgm) {
    bgm = new Audio()
    bgm.loop = true
    bgm.volume = 0.6
  }
}

export function playBgm(url) {
  if (!bgm) return
  bgm.src = url
  bgm.play().catch(()=>{})
}

export function stopBgm() {
  if (!bgm) return
  bgm.pause()
}
