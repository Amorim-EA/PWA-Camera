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

//importando indexedDB
import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('fotos', {
                            keyPath: 'titulo'
                        });
                        store.createIndex('id', 'id');
                        console.log("Banco criado!");
                }
            }
        });
        console.log("Banco aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
  criarDB();
});

async function guardarFoto(urlToPhoto) {
  const tx = await db.transaction('fotos', 'readwrite');
  const store = tx.objectStore('fotos');
  try {
      await store.add({ 
          url: urlToPhoto
      });
      await tx.done;
      console.log('Foto adicionado com sucesso!');
  } catch (error) {
      console.error('Erro ao adicionar:', error);
      tx.abort();
  }
}


// configurando as constraintes do video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// capturando os elementos em tela
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");

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

// Função para tirar foto
cameraTrigger.onclick= function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight; 
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/png");
  cameraOutput.classList.add("taken");
};

// carrega imagem de camera quando a janela carregar 
window.addEventListener("load", cameraStart, false);