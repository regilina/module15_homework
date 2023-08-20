const wsUrl = 'wss://echo-ws-service.herokuapp.com'

const output = document.getElementById('output')
const btnSend = document.querySelector('.j-btn-send')
const input = document.getElementById('message-input')
const locationButton = document.querySelector('.j-btn-location')

let websocket

function writeToScreen (message) {
  const pre = document.createElement('p')
  pre.style.wordWrap = 'break-word'
  pre.innerHTML = message
  output.appendChild(pre)
}

function openWebsocket () {
  websocket = new WebSocket(wsUrl)
  websocket.onopen = function (evt) {
    writeToScreen('CONNECTED')
  }
  websocket.onclose = function (evt) {
    writeToScreen('DISCONNECTED')
  }
  websocket.onmessage = function (evt) {
    writeToScreen(
      '<span style="color: blue;">RESPONSE: ' + evt.data + '</span>')
  }
  websocket.onerror = function (evt) {
    writeToScreen(
      '<span style="color: red;">ERROR:</span> ' + evt.data
    )
  }
}

function closeWebsocket () {
  websocket.close()
  websocket = null
}

function getLocation () {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const locationURL = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
      writeToScreen(`<a href="${locationURL}" target="_blank">Моя геолокация</a>`)
    })
  } else {
    alert('Геолокация недоступна.')
  }
}

window.addEventListener('beforeunload', () => {
  if (websocket) {
    closeWebsocket()
  }
})

btnSend.addEventListener('click', () => {
  const message = input.value
  writeToScreen('SENT: ' + message)
  websocket.send(message)
})

locationButton.addEventListener('click', () => {
  getLocation()
})

openWebsocket()
