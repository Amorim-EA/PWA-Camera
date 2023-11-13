//registrando a service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
      console.log('Service worker registrada! ', reg);
    } catch (err) {
      console.log(' Service worker registro falhou: ', err);
    }
  });
}

// configurando as constraintes do video stream
let camMode = 'user';
var constraints = { video: { facingMode: camMode }, audio: false };

// capturando os elementos em tela
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  cameraSwitcher = document.querySelector("#camera--switcher");


//Estabelecendo o acesso a camera e inicializando a visualização 
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      let track = stream.getTracks()[0];
      console.log(track); 
      cameraView.srcObject = stream;
  })
  .catch(function (error) {
    console.error("Ocorreu um Erro.", error); 
  });
}

function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

// Função para tirar foto
cameraTrigger.onclick= function() {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight; 
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/png");
  cameraOutput.classList.add("taken");
};

//Função para trocar de camera frontal/traseira
cameraSwitcher.onclick = function() {
  stopMediaTracks(cameraView.srcObject);
  camMode = camMode === 'user' ? 'environment' : 'user';
  constraints = { video: { facingMode: camMode }, audio: false };
  cameraStart();
}

// carrega imagem de camera quando a janela carregar 
window.addEventListener("load", cameraStart, false);