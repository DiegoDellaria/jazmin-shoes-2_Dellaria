let cssHeaderYFooter = document.getElementById("cssHeaderYFooter") // todas las llamadas a elementos del html
let cssIndex = document.getElementById("cssIndex")
let cssCategorias = document.getElementById("cssCategorias")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")
let gridGaleria = document.getElementById("gridGaleria")
let textoDelFiltro = document.getElementById("textoDelFiltro")
let min = document.getElementById("min")
let max = document.getElementById("max")
let botonFiltrar = document.getElementById("botonFiltrar")
let botonRecargar = document.getElementById("botonRecargar")
let dropdown = document.getElementById("dropdown")

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

actualizarGaleria(listaProductosLMV)

min.addEventListener("keydown", (e) => { // caja precio mínimo
    if (e.key == "Enter") {
        filtrarPrecios()
    }
})

max.addEventListener("keydown", (e) => { // caja precio máximo
    if (e.key == "Enter") {
        filtrarPrecios()
    }
})

botonFiltrar.addEventListener("click", () => { // botón filtrar
    filtrarPrecios()
})

botonRecargar.addEventListener("click", () => { // botón recargar
    min.value = ""
    max.value = ""

    actualizarGaleria(listaProductosLMV)

    textoDelFiltro.setAttribute("style", "display: none")
    textoDelFiltro.innerText = ""
})

listaMenAMay = [...listaProductosLMV] // ---dropdown
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

function actualizarModoNocturno(){ // cambia los css, clases de Bootstrap y texto del botón según corresponda
    let modoNocturno = localStorage.getItem("modoNocturno")

    if(modoNocturno == "true"){
        cssHeaderYFooter.setAttribute("href", "../styles/header_y_footer_estilos_modo_nocturno.css") // se cambian los href de todos los css de la pág a las versiones nocturnas
        cssIndex.setAttribute("href", "../styles/index_estilos_modo_nocturno.css")
        cssCategorias.setAttribute("href", "../styles/categorias_estilos_modo_nocturno.css")

        for(let i=0; i<modNocTxtBlanco.length; i++){ // se cambian los elementos de Bootstrap: se le agrega la clase text-white a cada elemento
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
        itemGaleria.setAttribute("class", "card") // se crea una card para cada producto
        itemGaleria.innerHTML = `<div class="figure">
                                    <img class="Sirv image-main" src="../img/${producto.imagen}"  alt="${producto.nombre}">
                                    <img class="Sirv image-hover" src="../img/${producto.imagen_r}"  alt="${producto.nombre}">
                                </div>
                                <div class="card-body">
                                    <p class="card-text p1">${producto.nombre}</p>
                                    <p class="card-text p2">$${producto.precio}</p>
                                </div>`


        let divDatos = document.createElement("div")
        divDatos.setAttribute("class", "fuenteDefault")
        
        let btn = document.createElement("button")
        btn.setAttribute("class", "fuenteBold")

        fetch("../js/datos.json") // agregamos datos adicionales de un json
        .then((res) => res.json())
        .then((json) => mostrarDatos(json, producto, divDatos))
        .catch((error) => console.log(error))

        if (producto.stock > 0) {
            let carritoStorage = JSON.parse(localStorage.getItem("carrito")) // se busca si el carrito ya existe en localStorage
            let objCarrito = ""

            if(carritoStorage){ // si existe el carrito, buscamos si está el producto dentro
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

                btn.addEventListener("click", () => { // si el producto no está en el carrito, el botón tiene la función de agregarlo
                    if (funcionAgregar) {
                        let carritoStorage = JSON.parse(localStorage.getItem("carrito")) 

                        if (!carritoStorage) { // si no existe el carrito en localStorage, se lo crea
                            localStorage.setItem("carrito", JSON.stringify([]))
                            carritoStorage = JSON.parse(localStorage.getItem("carrito"))
                        }
                        carritoStorage.push(producto) // se agrega el producto al carrito
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

                        funcionAgregar = false // la función del botón pasa a ser la de redireccionar a la pág del carrito
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
    if (isNaN(min.value) || isNaN(max.value) || (min.value > max.value && max.value != "")) {
        min.value = ""
        max.value = ""
        alert("Número/s inválido/s")
    }
    else if ((min.value == "" && max.value == "")) { // se recarga la página
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