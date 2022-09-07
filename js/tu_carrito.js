let cssHeaderYFooter = document.getElementById("cssHeaderYFooter") // todas las llamadas a elementos del html
let cssIndex = document.getElementById("cssIndex")
let cssCategorias = document.getElementById("cssCategorias")
let buscadorInput = document.getElementById("buscadorInput")
let buscadorBoton = document.getElementById("buscadorBoton")
let botonModoNocturno = document.getElementById("botonModoNocturno")
let modNocTxtBlanco = document.getElementsByClassName("modNocTxtBlanco")
let gridGaleria = document.getElementById("gridGaleria")
let subtitulo = document.getElementById("subtitulo")

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
    enviarABuscador()
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

let carritoStorage = JSON.parse(localStorage.getItem("carrito"))

generarPagina()

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

function generarPagina(){
    let total = 0

    gridGaleria.innerHTML = ""

    if (carritoStorage.length > 0) {
        carritoStorage.forEach((producto) => {
            let itemGaleria = document.createElement("div")
            itemGaleria.setAttribute("class", "card")
            itemGaleria.innerHTML = `<div class="figure">
                                        <img class="Sirv image-main" src="../img/${producto.imagen}"  alt="${producto.nombre}">
                                        <img class="Sirv image-hover" src="../img/${producto.imagen_r}"  alt="${producto.nombre}">
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text p1">${producto.nombre}</p>
                                    </div>`

            let divDatos = document.createElement("div")

            fetch("../js/datos.json")
            .then((res) => res.json())
            .then((json) => mostrarDatos(json, producto, divDatos))
            .catch((error) => console.log(error))

            let cantidad = document.createElement("p") // cantidad de este producto en el carrito
            cantidad.innerText = `Cantidad: ${producto.cantidad}`

            let txtSinStock = document.createElement("p")
            txtSinStock.innerText = "No tenemos más stock de este producto."
            txtSinStock.setAttribute("style", "display: none")

            let btnMenos = document.createElement("button") // botón para restar una unidad de este producto del carrito
            btnMenos.innerText = "-"
            btnMenos.disabled = analizarDesactivarBoton(producto.cantidad)

            btnMenos.addEventListener("click", () => {
                let objCarrito = carritoStorage.find(prod => prod.nombre == producto.nombre) // se busca la ubicación del producto en el array de objetos del carrito, y se elimina una unidad
                let ubicacion = carritoStorage.indexOf(objCarrito)
                carritoStorage[ubicacion].cantidad--

                btnMenos.disabled = analizarDesactivarBoton(carritoStorage[ubicacion].cantidad) // si hay una sola unidad en el carrito, se desabilita el botón

                cantidad.innerText = `Cantidad: ${carritoStorage[ubicacion].cantidad}`
                precioTxt.innerText = `$${producto.precio * carritoStorage[ubicacion].cantidad}` // precio total para este producto

                total -= producto.precio // precio total de todos los productos
                subtitulo.innerText = `Total: $${total}.`

                localStorage.setItem("carrito", JSON.stringify(carritoStorage)) // actualizamos el localStorage

                if (btnMas.disabled == true) { // si el botón para sumar unidades está deshabilitado, se lo habilita
                    txtSinStock.setAttribute("style", "display: none")
                    btnMas.disabled = false
                }
            })

            let btnMas = document.createElement("button") // botón para sumar una unidad de este producto del carrito
            btnMas.innerText = "+"

            btnMas.addEventListener("click", () => {
                if (producto.cantidad < producto.stock) {
                    let objCarrito = carritoStorage.find(prod => prod.nombre == producto.nombre)
                    let ubicacion = carritoStorage.indexOf(objCarrito)
                    carritoStorage[ubicacion].cantidad++

                    btnMenos.disabled = false // si el botón menos está deshabilitado, se lo habilita

                    cantidad.innerText = `Cantidad: ${carritoStorage[ubicacion].cantidad}`
                    precioTxt.innerText = `$${producto.precio * carritoStorage[ubicacion].cantidad}`

                    total += producto.precio
                    subtitulo.innerText = `Total: $${total}.`

                    localStorage.setItem("carrito", JSON.stringify(carritoStorage))
                }
                else {
                    txtSinStock.setAttribute("style", "display: auto") // si no queda más stock, se le avisa al usuario y se habilita el botón
                    btnMas.disabled = true
                }
            })

            let precioTxt = document.createElement("p") // precio total para este producto
            precioTxt.innerText = `$${producto.precio * producto.cantidad}`

            let btnEliminarProd = document.createElement("button") // botón para eliminar el producto entero del carrito
            btnEliminarProd.innerText = "Eliminar del carrito"

            btnEliminarProd.addEventListener("click", () => {
                let objCarrito = carritoStorage.find(prod => prod.nombre == producto.nombre)
                let ubicacion = carritoStorage.indexOf(objCarrito)
                carritoStorage.splice(ubicacion, 1)
                localStorage.setItem("carrito", JSON.stringify(carritoStorage))
                generarPagina()

                let flag = true
                
                Toastify({
                    text: `Eliminaste '${producto.nombre}' de tu carrito,
                            Clickeá acá para deshacer.`,
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){ // función para recuperar el producto del carrito, solo se puede llamar una vez para evitar duplicados
                        if(flag){
                            carritoStorage.splice(ubicacion, 0, objCarrito)
                            localStorage.setItem("carrito", JSON.stringify(carritoStorage))
                            generarPagina()
                            flag = false
                        }
                    }
                  }).showToast();
            })

            itemGaleria.appendChild(divDatos)
            itemGaleria.appendChild(cantidad)
            itemGaleria.appendChild(txtSinStock)
            itemGaleria.appendChild(btnMenos)
            itemGaleria.appendChild(btnMas)
            itemGaleria.appendChild(precioTxt)
            itemGaleria.appendChild(btnEliminarProd)

            gridGaleria.appendChild(itemGaleria)

            total += producto.precio * producto.cantidad
        })

        subtitulo.innerText = `Total: $${total}.`
    }
    else{
        subtitulo.innerText = "¡Tu carrito está vacío!"
    }
}

function analizarDesactivarBoton(cantidad) {
    if (cantidad <= 1) {
        return true
    }
    else {
        return false
    }
}

function mostrarDatos(json, producto, divDatos){
    let prod = json.find(prod => prod.nombre == producto.nombre)
    
    divDatos.innerHTML = `<p>Material: ${prod.material}</p>
                          <p>Color: ${prod.color}</p>`
}