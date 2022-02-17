import { baseDeDatos } from './productos.js'

console.log(baseDeDatos[5])
console.log(baseDeDatos[4])
console.log(baseDeDatos[7])
console.log(window.localStorage)
console.log(window.localStorage.carrito[2])

const carrito = document.getElementById("carrito")
carrito.innerHTML = baseDeDatos[5]
