let cssHeaderYFooter = document.getElementById("cssHeaderYFooter")
let cssIndex = document.getElementById("cssIndex")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")

let clasesElementosHeader = []

for(elemento of modNocTxtBlanco){
    clasesElementosHeader.push(elemento.getAttribute("class"))
}

actualizarModoNocturno()

buscadorInput.addEventListener("keydown", (e) => {
    if(e.key == "Enter" && buscadorInput.value != ""){
        enviarABuscador()
    }
})

buscadorBoton.addEventListener("click", () => {
    enviarABuscador()
})

botonModoNocturno.addEventListener("click", () => {
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        localStorage.setItem("modoNocturno", "false")
    }
    else{
        localStorage.setItem("modoNocturno", "true")
    }

    actualizarModoNocturno()
})

function actualizarModoNocturno(){
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        cssHeaderYFooter.setAttribute("href", "./styles/header_y_footer_estilos_modo_nocturno.css")
        cssIndex.setAttribute("href", "./styles/index_estilos_modo_nocturno.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){
            modNocTxtBlanco[i].setAttribute("class", clasesElementosHeader[i] + " text-white")
        }

        botonModoNocturno.innerText = "Desactivar modo nocturno"
    }
    else{
        cssHeaderYFooter.setAttribute("href", "./styles/header_y_footer_estilos.css")
        cssIndex.setAttribute("href", "./styles/index_estilos.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){
            modNocTxtBlanco[i].setAttribute("class", clasesElementosHeader[i])
        }

        botonModoNocturno.innerText = "Activar modo nocturno"
    }
}

function enviarABuscador(){
    localStorage.setItem("busqueda", buscadorInput.value)
    window.location.href = "../pages/buscador.html"
}