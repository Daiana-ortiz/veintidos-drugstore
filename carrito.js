
    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Turron',
            precio: 30,
            imagen: 'images/turron.jpg',
            categoria: "golosina"
        },
        {
            id: 2,
            nombre: 'Cofler Block',
            precio: 200,
            imagen: 'images/block.jpg',
            categoria: "chocolate"
        },
        {
            id: 3,
            nombre: 'Rollo Mogul',
            precio: 45,
            imagen: 'images/mogul.jpg',
            categoria: "golosina"
        },
        {
            id: 4,
            nombre: 'Pipas gigantes',
            precio: 80,
            imagen: 'images/pipas.jpg',
            categoria: "snacks"
        },
        {
            id: 5,
            nombre: 'Alfajor Aguila',
            precio: 120,
            imagen: 'images/aguila.jpg',
            categoria: "chocolate"
        },
        {
            id: 6,
            nombre: 'Paraguitas',
            precio: 65,
            imagen: 'images/paraguitas.jpg',
            categoria: "chocolate"
        },
        {
            id: 7,
            nombre: 'Huevo Kinder',
            precio: 220,
            imagen: 'images/huevo.jpg',
            categoria: "chocolate"
        },
        {
            id: 8,
            nombre: 'Kinder Bueno',
            precio: 250,
            imagen: 'images/kinder.jpg',
            categoria: "chocolate"
        }

    ];

    let carrito = [];
    let total = 0;
    const DOMitems = document.querySelector('#wrapper');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMIconoCarrito = document.querySelector('#cart')
    const hiddenCart = document.querySelector('#showCart')
    const miLocalStorage = window.localStorage;


    // Funciones

    DOMIconoCarrito.addEventListener('click', () =>{
        hiddenCart.classList.toggle('carrito');
    });
    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {

            //Estructura 
            const miNodo = document.createElement('div');
            miNodo.classList.add('product-box-container')
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('product-box');
            
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            
            // Titulo
            const miNodoTitle = document.createElement('h3');
            miNodoTitle.classList.add('box-title');
            miNodoTitle.textContent = info.nombre;
            // Precio
            const miNodoPrecio = document.createElement('div');
            miNodoPrecio.classList.add('price');
            miNodoPrecio.textContent = info.precio + '$';
            // Boton 
            
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn');
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.textContent = 'Añadir al carrito';
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            miNodoBoton.addEventListener('click', () =>{
                hiddenCart.classList.add('carrito');
            });

            // Insertamos
            DOMitems.appendChild(miNodo);
            miNodo.appendChild(miNodoCardBody);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
        });
    }

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Calculo el total
        calcularTotal();
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }



    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('item');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}$`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn-delete');
            miBoton.textContent = 'Eliminar';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /**
    * Calcula el precio total teniendo en cuenta los productos repetidos
    */
    function calcularTotal() {
        // Limpiamos precio anterior
        total = 0;
        // Recorremos el array del carrito
        carrito.forEach((item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            total = total + miItem[0].precio;
        });
        // Renderizamos el precio en el HTML
        DOMtotal.textContent = total.toFixed(2);
    }

    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        calcularTotal();
        // Borra LocalStorage
        localStorage.clear();

    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);



// funcion para filtrar el listado de productos

function filterProducts(e) {
    const productos = document.querySelectorAll(".wrapper div"); // selecciona todos los div de productos
    let filter = baseDeDatos.categoria; // graba el valor en el event target's data-filter attribute
    baseDeDatos.forEach(producto => {
      producto === filter
      ? productos.classList.remove('.showCart') // if yes, make sure .hidden is not applied
      : productos.classList.add('showCart'); // if no, apply .hidden
    });
  };

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    calcularTotal();
    renderizarCarrito();
