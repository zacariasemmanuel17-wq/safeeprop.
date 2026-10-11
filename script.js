let usuarioActual = null;
let imagenTemporalBase64 = null;

const imagenPorDefecto = "https://via.placeholder.com/400x250?text=Sin+Fotografía";

let propiedades = [
    {
        id: 1,
        titulo: "Casa Habitación en Zona Residencial",
        tipo: "Casa",
        estado: "Jalisco",
        precio: 2500000,
        documento: "Escritura Pública RPP",
        vendedor: "Carlos Mendoza",
        contacto: "3398765432",
        desc: "Cuenta con libertad de gravamen y pagos de predial/agua al corriente.",
        imagen: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        titulo: "Parcela Ejidal con Uso Agrícola",
        tipo: "Terreno Ejidal",
        estado: "Guanajuato",
        precio: 850000,
        documento: "Certificado Parcelario RAN",
        vendedor: "Ejido San José - Roberto G.",
        contacto: "4771234567",
        desc: "Certificado parcelario registrado en el RAN. Notificación de Derecho del Tanto en proceso.",
        imagen: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80"
    }
];

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    if (tabId === 'catalogoTab') {
        renderizarPropiedades(propiedades);
    }
}

function mostrarVistaPrevia(event) {
    const file = event.target.files[0];
    const vistaPrevia = document.getElementById('vistaPrevia');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagenTemporalBase64 = e.target.result;
            vistaPrevia.src = imagenTemporalBase64;
            vistaPrevia.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagenTemporalBase64 = null;
        vistaPrevia.style.display = 'none';
    }
}

function registrarUsuario(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    const rfc = document.getElementById('regRFC').value.toUpperCase();
    const tel = document.getElementById('regTel').value;
    const tipo = document.getElementById('regTipo').value;

    usuarioActual = { nombre, rfc, tel, tipo };

    document.getElementById('userInfoNav').innerText = `Usuario: ${nombre} (${tipo}) | RFC: ${rfc}`;
    alert(`¡Registro exitoso! Bienvenido ${nombre}. Ahora puedes publicar o buscar propiedades de forma segura.`);
    switchTab('catalogoTab');
}

function publicarInmueble(e) {
    e.preventDefault();

    if (!usuarioActual) {
        alert("Debes registrarte primero en la pestaña 'Registro / Login' antes de publicar.");
        switchTab('registroTab');
        return;
    }

    const nuevaPropiedad = {
        id: Date.now(),
        titulo: document.getElementById('pubTitulo').value,
        tipo: document.getElementById('pubTipo').value,
        estado: document.getElementById('pubEstado').value,
        precio: parseFloat(document.getElementById('pubPrecio').value),
        documento: document.getElementById('pubDocumento').value,
        vendedor: usuarioActual.nombre,
        contacto: usuarioActual.tel,
        desc: document.getElementById('pubDesc').value,
        imagen: imagenTemporalBase64 || imagenPorDefecto
    };

    propiedades.unshift(nuevaPropiedad);
    alert("Propiedad publicada exitosamente con fotografía y validación inicial.");

    document.getElementById('formPublicar').reset();
    document.getElementById('vistaPrevia').style.display = 'none';
    imagenTemporalBase64 = null;

    switchTab('catalogoTab');
}

function aplicarFiltros() {
    const estadoSeleccionado = document.getElementById('filtroEstado').value;
    const precioMaximo = parseFloat(document.getElementById('filtroPrecio').value);

    const filtradas = propiedades.filter(prop => {
        const coincideEstado = (estadoSeleccionado === "TODOS" || prop.estado === estadoSeleccionado);
        const coincidePrecio = (isNaN(precioMaximo) || prop.precio <= precioMaximo);
        return coincideEstado && coincidePrecio;
    });

    renderizarPropiedades(filtradas);
}

function renderizarPropiedades(lista) {
    const contenedor = document.getElementById('listaPropiedades');
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron propiedades con los filtros seleccionados.</p>";
        return;
    }

    const formatoMXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    lista.forEach(prop => {
        const isEjido = prop.tipo === "Terreno Ejidal";
        const badgeTipo = isEjido
            ? `<span class="badge-ejido">Ejidal (RAN)</span>`
            : `<span class="badge-verified">Urbano (RPP)</span>`;

        const cardHTML = `
            <div class="property-card">
                <div class="property-img-container">
                    <img src="${prop.imagen}" alt="${prop.titulo}" class="property-img">
                </div>
                <div class="property-header">
                    <small><b>${prop.estado}</b></small>
                    ${badgeTipo}
                </div>
                <div class="property-body">
                    <h3>${prop.titulo}</h3>
                    <div class="property-price">${formatoMXN.format(prop.precio)}</div>
                    <p><strong>Tipo:</strong> ${prop.tipo}</p>
                    <p><strong>Respaldo:</strong> ${prop.documento}</p>
                    <p><small>${prop.desc}</small></p>

                    <div class="contact-box">
                        <strong>Vendedor Seguro:</strong> ${prop.vendedor}<br>
                        <strong>Contacto / Tel:</strong> <a href="https://wa.me/52${prop.contacto}" target="_blank">${prop.contacto}</a>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

renderizarPropiedades(propiedades);