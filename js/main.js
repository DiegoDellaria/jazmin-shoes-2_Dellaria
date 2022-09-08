let cssHeaderYFooter = document.getElementById("cssHeaderYFooter") // todas las llamadas a elementos del html
let cssIndex = document.getElementById("cssIndex")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")

let clasesElementosHeader = [] // creamos una lista con las clases de los elementos de Bootstrap, para poder poner el texto en blanco en el modo nocturno

for(elemento of modNocTxtBlanco){
    clasesElementosHeader.push(elemento.getAttribute("class"))
}

actualizarModoNocturno()

buscadorInput.addEventListener("keydown", (e) => { // caja de búsqueda
    if(e.key == "Enter" && buscadorInput.value != ""){
        enviarABuscador()
    }
})

buscadorBoton.addEventListener("click", () => { // botón de búsqueda
    if(buscadorInput.value != ""){
        enviarABuscador()
    }
})

botonModoNocturno.addEventListener("click", () => { // botón modo nocturno
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        localStorage.setItem("modoNocturno", "false")
    }
    else{
        localStorage.setItem("modoNocturno", "true")
    }

    actualizarModoNocturno()
})

function actualizarModoNocturno(){ // cambia los css, clases de Bootstrap y texto del botón según corresponda
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        cssHeaderYFooter.setAttribute("href", "./styles/header_y_footer_estilos_modo_nocturno.css") // se cambian los href de todos los css de la pág a las versiones nocturnas
        cssIndex.setAttribute("href", "./styles/index_estilos_modo_nocturno.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){ // se cambian los elementos de Bootstrap: se le agrega la clase text-white a cada elemento
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
    window.location.href = "pages/buscador.html"
}