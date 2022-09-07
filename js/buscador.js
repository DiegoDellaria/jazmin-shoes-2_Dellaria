let listaProductosTotal = []
let productosRepetidos = []

listaProductosLMV.forEach((producto) => {
    let encontrado = productosRepetidos.find(prod => prod.nombre == producto.nombre)

    if(!encontrado){
        listaProductosTotal.push(producto)
        productosRepetidos.push(producto)
    }
})

listaProductosLN.forEach((producto) => {
    let encontrado = productosRepetidos.find(prod => prod.nombre == producto.nombre)

    if(!encontrado){
        listaProductosTotal.push(producto)
        productosRepetidos.push(producto)
    }
})

listaProductosOI.forEach((producto) => {
    let encontrado = productosRepetidos.find(prod => prod.nombre == producto.nombre)

    if(!encontrado){
        listaProductosTotal.push(producto)
        productosRepetidos.push(producto)
    }
})

listaProductosPV.forEach((producto) => {
    let encontrado = productosRepetidos.find(prod => prod.nombre == producto.nombre)

    if(!encontrado){
        listaProductosTotal.push(producto)
        productosRepetidos.push(producto)
    }
})

let cssHeaderYFooter = document.getElementById("cssHeaderYFooter")
let cssIndex = document.getElementById("cssIndex")
let cssCategorias = document.getElementById("cssCategorias")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")
let titulo = document.getElementById("titulo")
let subtitulo = document.getElementById("subtitulo")
let gridGaleria = document.getElementById("gridGaleria")

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

let busqueda = localStorage.getItem("busqueda")

if(!busqueda){
    localStorage.setItem("busqueda", "")
    busqueda = localStorage.getItem("busqueda")
}

let busqCortada = busqueda
if(busqueda.slice(-1) == "s" && busqueda != "s"){
    busqCortada = busqueda.slice(0, -1)
}

let filtrado = listaProductosTotal.filter(producto => producto.nombre.toLowerCase().includes(busqCortada.toLowerCase()))

if(filtrado.length > 0){
    titulo.setAttribute("style", "auto")
    titulo.innerText = `Resultados para '${busqueda}':`

    generarPagina(filtrado)
}
else{
    subtitulo.setAttribute("style", "auto")
    subtitulo.innerText = `No se encontraron resultados para '${busqueda}'
                            Tal vez te interesen los siguientes productos:`

    let prodsAleatorios = []
    let i = 0

    while(i < 4){
        let num = Math.floor(Math.random() * listaProductosTotal.length)

        if(!prodsAleatorios.includes(listaProductosTotal[num])){
            prodsAleatorios.push(listaProductosTotal[num])
            i++
        }
    }
    generarPagina(prodsAleatorios)
}

function enviarABuscador(){
    localStorage.setItem("busqueda", buscadorInput.value)
    window.location.href = "../pages/buscador.html"
}

function actualizarModoNocturno(){
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        cssHeaderYFooter.setAttribute("href", "../styles/header_y_footer_estilos_modo_nocturno.css")
        cssIndex.setAttribute("href", "../styles/index_estilos_modo_nocturno.css")
        cssCategorias.setAttribute("href", "../styles/categorias_estilos_modo_nocturno.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){
            modNocTxtBlanco[i].setAttribute("class", clasesElementosHeader[i] + " text-white")
        }

        botonModoNocturno.innerText = "Desactivar modo nocturno"
    }
    else{
        cssHeaderYFooter.setAttribute("href", "../styles/header_y_footer_estilos.css")
        cssIndex.setAttribute("href", "../styles/index_estilos.css")
        cssCategorias.setAttribute("href", "../styles/categorias_estilos.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){
            modNocTxtBlanco[i].setAttribute("class", clasesElementosHeader[i])
        }

        botonModoNocturno.innerText = "Activar modo nocturno"
    }
}

function generarPagina(lista){
    lista.forEach((producto) => {
        let itemGaleria = document.createElement("div")
        itemGaleria.setAttribute("class", "card")
        itemGaleria.innerHTML = `<div class="figure">
                                    <img class="Sirv image-main" src="../img/${producto.imagen}"  alt="${producto.nombre}">
                                    <img class="Sirv image-hover" src="../img/${producto.imagen_r}"  alt="${producto.nombre}">
                                </div>
                                <div class="card-body">
                                    <p class="card-text p1">${producto.nombre}</p>
                                    <p class="card-text p2">$${producto.precio}</p>
                                </div>`


        let divDatos = document.createElement("div")
        let btn = document.createElement("button")

        fetch("../js/datos.json")
        .then((res) => res.json())
        .then((json) => mostrarDatos(json, producto, divDatos))
        .catch((error) => console.log(error))

        if (producto.stock > 0) {
            let carritoStorage = JSON.parse(localStorage.getItem("carrito"))
            let objCarrito = ""

            if(carritoStorage){
                objCarrito = carritoStorage.find(prod => prod.nombre == producto.nombre)
            }

            if (objCarrito) {
                btn.innerText = "Este producto está en tu carrito! Clickeá para verlo"
                btn.addEventListener("click", () => {
                    window.location.href = "../pages/tu_carrito.html"
                })
            }
            else {
                btn.innerText = "Agregar al carrito"

                let funcionAgregar = true

                btn.addEventListener("click", () => {
                    if (funcionAgregar) {
                        let carritoStorage = JSON.parse(localStorage.getItem("carrito"))

                        if (!carritoStorage) {
                            localStorage.setItem("carrito", JSON.stringify([]))
                            carritoStorage = JSON.parse(localStorage.getItem("carrito"))
                        }
                        carritoStorage.push(producto)
                        localStorage.setItem("carrito", JSON.stringify(carritoStorage))

                        Toastify({
                            text: `Agregaste '${producto.nombre}' a tu carrito,
                                        Clickeá acá para verlo.`,
                            duration: 3000,
                            destination: "../pages/tu_carrito.html",
                            newWindow: true,
                            close: true,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();

                        btn.innerText = "Este producto está en tu carrito! Clickeá para verlo"

                        funcionAgregar = false
                    }
                    else {
                        window.location.href = "../pages/tu_carrito.html"
                    }
                })
            }
        }
        else {
            btn.disabled = true
            btn.innerText = "Actualmente no tenemos stock de este producto."
        }

        itemGaleria.appendChild(divDatos)
        itemGaleria.appendChild(btn)
        gridGaleria.appendChild(itemGaleria)
    })
}

function mostrarDatos(json, producto, divDatos){
    let prod = json.find(prod => prod.nombre == producto.nombre)
    
    divDatos.innerHTML = `<p>Material: ${prod.material}</p>
                          <p>Color: ${prod.color}</p>`
}