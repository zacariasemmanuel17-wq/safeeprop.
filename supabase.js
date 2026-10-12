
const SUPABASE_URL = "PEGA_AQUI_TU_PROJECT_URL";
const SUPABASE_KEY = "PEGA_AQUI_TU_PUBLISHABLE_KEY";

const cliente = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const formulario = document.getElementById("form-propiedad");
const mensaje = document.getElementById("mensaje-formulario");
const lista = document.getElementById("lista-propiedades");

// Enviar una propiedad a la base de datos.
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const boton = formulario.querySelector('button[type="submit"]');
  boton.disabled = true;
  mensaje.textContent = "Guardando publicación...";

  const propiedad = {
    titulo: formulario.titulo.value.trim(),
    tipo: formulario.tipo.value,
    precio: Number(formulario.precio.value),
    ubicacion: formulario.ubicacion.value.trim(),
    superficie: Number(formulario.superficie.value),
    descripcion: formulario.descripcion.value.trim()
  };

  try {
    const { error } = await cliente
      .from("propiedades")
      .insert(propiedad);

    if (error) throw error;

    formulario.reset();
    mensaje.textContent =
      "Propiedad guardada. Está pendiente de revisión.";

    await cargarPropiedades();
  } catch (error) {
    console.error(error);
    mensaje.textContent =
      "No se pudo guardar. Revisa la conexión y los permisos.";
  } finally {
    boton.disabled = false;
  }
});

// Consultar las propiedades aprobadas.
async function cargarPropiedades() {
  lista.textContent = "Cargando propiedades...";

  const { data, error } = await cliente
    .from("propiedades")
    .select("id, titulo, tipo, precio, ubicacion, superficie, descripcion, created_at")
    .eq("estado", "publicada")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    lista.textContent = "No se pudieron cargar las propiedades.";
    return;
  }

  lista.replaceChildren();

  if (!data.length) {
    lista.textContent = "Todavía no hay propiedades publicadas.";
    return;
  }

  for (const propiedad of data) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-propiedad";

    const titulo = document.createElement("h3");
    titulo.textContent = propiedad.titulo;

    const detalles = document.createElement("p");
    detalles.textContent =
      `${propiedad.tipo} · ${propiedad.superficie} m²`;

    const precio = document.createElement("p");
    precio.textContent = Number(propiedad.precio).toLocaleString(
      "es-MX",
      { style: "currency", currency: "MXN" }
    );

    const ubicacion = document.createElement("p");
    ubicacion.textContent = propiedad.ubicacion;

    const descripcion = document.createElement("p");
    descripcion.textContent = propiedad.descripcion;

    tarjeta.append(titulo, detalles, precio, ubicacion, descripcion);
    lista.appendChild(tarjeta);
  }
}

cargarPropiedades();