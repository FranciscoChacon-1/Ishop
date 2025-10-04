// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Obtener el carrito actual

    // Agregar el nuevo producto al carrito
    carrito.push({ nombre, precio, imagen });

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`El producto ${nombre} ha sido agregado al carrito.`);

    // Actualizar la vista del carrito
    actualizarCarrito();
}

// Función para actualizar el carrito en la página
function actualizarCarrito() {
    const carritoDiv = document.getElementById("items-carrito");
    const totalDiv = document.getElementById("total-carrito");

    const carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Obtener el carrito desde localStorage

    if (carrito.length === 0) {
        carritoDiv.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalDiv.innerHTML = "";
    } else {
        let htmlCarrito = "";
        let total = 0;

        carrito.forEach((item, index) => {
            htmlCarrito += `
                <div class="row mb-3">
                    <div class="col-4">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid" style="max-width: 80px; height: auto;">
                    </div>
                    <div class="col-6">
                        <p><strong>${item.nombre}</strong> - $${item.precio}</p>
                    </div>
                    <div class="col-2 text-end">
                        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            total += item.precio;
        });

        htmlCarrito += `<p><strong>Total: $${total}</strong></p>`;
        carritoDiv.innerHTML = htmlCarrito;
        totalDiv.innerHTML = `<p><strong>Total a pagar: $${total}</strong></p>`;
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); // Eliminar el producto en el índice indicado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito(); // Actualizar la vista después de la eliminación
}

// Función para finalizar la compra y enviar el recibo por correo usando EmailJS
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    // Crear el recibo
    let recibo = "Recibo de compra:\n\n";
    let total = 0;
    const items = []; // Array para almacenar los productos

    carrito.forEach((item) => {
        recibo += `${item.nombre} - $${item.precio}\n`;
        total += item.precio;

        // Agregar los productos al array para pasarlos al template
        items.push({
            nombre: item.nombre,
            precio: item.precio
        });
    });

    recibo += `\nTotal a pagar: $${total}`;

    // Solicitar al usuario su correo
 const email = prompt("Por favor, ingresa tu correo electrónico para enviarte el recibo:");

if (!email || !email.includes('@')) {
    alert("Debes proporcionar un correo electrónico válido.");
    return;
}


    // Inicializar EmailJS con tu usuario (User ID)
    emailjs.init('Q6byUhnQCLZcz6LwJ'); // Aquí va tu USER ID que obtuviste en tu cuenta de EmailJS

    // Configuración del correo a enviar
    const templateParams = {
        to_email: email, // Correo del destinatario
        subject: "Recibo de compra", // Asunto del correo
        message: recibo, // Cuerpo del correo
        nombre: email.split('@')[0], // Si quieres enviar el nombre (de acuerdo al email)
        time: new Date().toLocaleString(), // Hora actual de la compra
        items: items, // Los productos comprados
        total: total // Total a pagar
    };

    // Enviar el correo con EmailJS
    emailjs.send('service_33r87jb', 'template_o69en3o', templateParams)
        .then(function(response) {
            alert('Correo enviado exitosamente!');
        }, function(error) {
            alert('Error al enviar el correo: ' + JSON.stringify(error));
        });

    // Vaciar el carrito después de la compra
    localStorage.removeItem('carrito');
    actualizarCarrito(); // Actualizar la vista después de la compra
}

// Llamar a actualizarCarrito cuando cargue la página del carrito
window.onload = function() {
    actualizarCarrito(); // Llama a la función para mostrar los productos cuando cargue la página
};
