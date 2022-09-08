let listaProductosTotal = []
let productosRepetidos = []
                                            // se genera un array de todos los productos de todas las categorías, sin repeticiones
listaProductosLMV.forEach((producto) => {
    listaProductosTotal.push(producto)
    productosRepetidos.push(producto)
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

let cssHeaderYFooter = document.getElementById("cssHeaderYFooter") // todas las llamadas a elementos del html
let cssIndex = document.getElementById("cssIndex")
let cssCategorias = document.getElementById("cssCategorias")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")
let titulo = document.getElementById("titulo")
let subtitulo = document.getElementById("subtitulo")
let gridGaleria = document.getElementById("gridGaleria")

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

let busqueda = localStorage.getItem("busqueda")

if(!busqueda){ // se toma la búsqueda de localStorage, si no existe se la crea con un string vacío
    localStorage.setItem("busqueda", "")
    busqueda = localStorage.getItem("busqueda")
}

let busqCortada = busqueda // si la búsqueda termina en s, se le saca esa letra, para transformar las búsquedas del plural al singular, a menos que la búsqueda sea precisamente "s"
if(busqueda.slice(-1) == "s" && busqueda != "s"){
    busqCortada = busqueda.slice(0, -1) // la página trabaja con el string cortado pero al usuario se le muestra exactamente lo que buscó
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

    let prodsAleatorios = [] // si no se encuentran resultados para la búsqueda, se muestran 4 resultados aleatorios del total de productos
    let i = 0

    while(i < 4){
        let num = Math.floor(Math.random() * listaProductosTotal.length)

        if(!prodsAleatorios.includes(listaProductosTotal[num])){ // nos aseguramos que no haya repetidos entre los 4 productos
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

function generarPagina(lista){
    lista.forEach((producto) => {
        let itemGaleria = document.createElement("div")
        itemGaleria.setAttribute("class", "card")  // se crea una card para cada producto
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

                btn.addEventListener("click", () => {  // si el producto no está en el carrito, el botón tiene la función de agregarlo
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

function mostrarDatos(json, producto, divDatos){
    let prod = json.find(prod => prod.nombre == producto.nombre)
    
    divDatos.innerHTML = `<p>Material: ${prod.material}</p>
                          <p>Color: ${prod.color}</p>`
}