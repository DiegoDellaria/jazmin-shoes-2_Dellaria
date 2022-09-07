let cssHeaderYFooter = document.getElementById("cssHeaderYFooter")
let cssIndex = document.getElementById("cssIndex")
let cssCategorias = document.getElementById("cssCategorias")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")
let gridGaleria = document.getElementById("gridGaleria")
let inputBuscar = document.getElementById("inputBuscar")
let textoDelFiltro = document.getElementById("textoDelFiltro")
let min = document.getElementById("min")
let max = document.getElementById("max")
let botonFiltrar = document.getElementById("botonFiltrar")
let botonRecargar = document.getElementById("botonRecargar")
let dropdown = document.getElementById("dropdown")

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

actualizarGaleria(listaProductosLMV)

inputBuscar.addEventListener("keyup", () => {
    filtrado = listaProductosLMV.filter(producto => producto.nombre.toLowerCase().includes(inputBuscar.value.toLowerCase()))
    actualizarGaleria(filtrado)

    min.value = ""
    max.value = ""

    if (inputBuscar.value == "") {
        textoDelFiltro.setAttribute("style", "display: none")
        textoDelFiltro.innerText = ""
    }
    else {
        if (filtrado.length > 0) {
            textoDelFiltro.innerText = `Productos que incluyen "${inputBuscar.value}":`
        }
        else {
            textoDelFiltro.innerText = `No tenemos productos que incluyan "${inputBuscar.value}".`
        }

        textoDelFiltro.setAttribute("style", "display: auto")
    }
})

min.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        filtrarPrecios()
    }
})

max.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        filtrarPrecios()
    }
})

botonFiltrar.addEventListener("click", () => {
    filtrarPrecios()
})

botonRecargar.addEventListener("click", () => {
    inputBuscar.value = ""
    min.value = ""
    max.value = ""

    actualizarGaleria(listaProductosLMV)

    textoDelFiltro.setAttribute("style", "display: none")
    textoDelFiltro.innerText = ""
})

listaMenAMay = [...listaProductosLMV]
listaMenAMay.sort((prodA, prodB) => prodA.precio - prodB.precio)

listaMayAMen = [...listaProductosLMV]
listaMayAMen.sort((prodA, prodB) => prodB.precio - prodA.precio)

lista_AZ = [...listaProductosLMV]
lista_AZ.sort((prodA, prodB) => {
    if (prodA.nombre > prodB.nombre) {
        return 1
    }
    else { return -1 }
})

lista_ZA = [...listaProductosLMV]
lista_ZA.sort((prodA, prodB) => {
    if (prodA.nombre < prodB.nombre) {
        return 1
    }
    else { return -1 }
})

dropdown.addEventListener("change", () => {
    ordenarGaleria(dropdown.value)
})

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

function enviarABuscador(){
    localStorage.setItem("busqueda", buscadorInput.value)
    window.location.href = "../pages/buscador.html"
}

function actualizarGaleria(lista) {
    gridGaleria.innerHTML = ""

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

function filtrarPrecios() {
    inputBuscar.value = ""

    if (isNaN(min.value) || isNaN(max.value) || (min.value > max.value && max.value != "")) {
        min.value = ""
        max.value = ""
        alert("Número/s inválido/s")
    }
    else if ((min.value == "" && max.value == "")) {
        actualizarGaleria(listaProductosLMV)
        textoDelFiltro.setAttribute("style", "display: none")
        textoDelFiltro.innerText = ""
    }
    else if (max.value == "") {
        let filtrado = listaProductosLMV.filter(producto => producto.precio >= min.value)
        actualizarGaleria(filtrado)

        filtrado.length > 0 ? textoDelFiltro.innerText = `Productos desde \$${min.value}:` : textoDelFiltro.innerText = `No tenemos productos de más de \$${min.value}.`
        textoDelFiltro.setAttribute("style", "display: auto")
    }
    else if (min.value == "") {
        let filtrado = listaProductosLMV.filter(producto => producto.precio <= max.value)
        actualizarGaleria(filtrado)

        filtrado.length > 0 ? textoDelFiltro.innerText = `Productos de hasta \$${max.value}:` : textoDelFiltro.innerText = `No tenemos productos de menos de \$${max.value}.`
        textoDelFiltro.setAttribute("style", "display: auto")
    }
    else {
        let filtrado = listaProductosLMV.filter(producto => producto.precio >= min.value && producto.precio <= max.value)
        actualizarGaleria(filtrado)

        filtrado.length > 0 ? textoDelFiltro.innerText = `Productos de entre \$${min.value} y \$${max.value}:` : textoDelFiltro.innerText = `No tenemos productos de entre \$${min.value} y \$${max.value}.`
        textoDelFiltro.setAttribute("style", "display: auto")
    }
}

function ordenarGaleria(valor) {
    let listaOrdenada = []
    switch (valor) {
        case "lmv":
            actualizarGaleria(listaProductosLMV)
            break
        case "menAMay":
            actualizarGaleria(listaMenAMay)
            break
        case "mayAMen":
            actualizarGaleria(listaMayAMen)
            break
        case "a-z":
            actualizarGaleria(lista_AZ)
            break
        case "z-a":
            actualizarGaleria(lista_ZA)
    }
}

function mostrarDatos(json, producto, divDatos){
    let prod = json.find(prod => prod.nombre == producto.nombre)
    
    divDatos.innerHTML = `<p>Material: ${prod.material}</p>
                          <p>Color: ${prod.color}</p>`
}