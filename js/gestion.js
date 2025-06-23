const BASE_GESTION_URL = "http://144.126.136.43/api/gestion/"; // Solo una vez, aquí

function mostrarMensaje(texto, tipo = "success") {
  let mensajeDiv = document.getElementById("mensaje");
  if (!mensajeDiv) {
    mensajeDiv = document.createElement("div");
    mensajeDiv.id = "mensaje";
    document.body.prepend(mensajeDiv);
  }
  mensajeDiv.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  setTimeout(() => mensajeDiv && (mensajeDiv.innerHTML = ""), 3000);
}

function listarGestiones() {
  fetch(BASE_GESTION_URL)
    .then(res => res.json())
    .then(gestiones => {
      const tbody = document.querySelector("#tbl_gestion tbody");
      tbody.innerHTML = "";
      gestiones.forEach(g => {
        tbody.innerHTML += `
          <tr>
            <td>${g.id_gestion}</td>
            <td>${g.id_usuario}</td>
            <td>${g.id_cliente}</td>
            <td>${g.id_tipo_gestion}</td>
            <td>${g.id_resultado}</td>
            <td>${g.comentarios}</td>
            <td>${g.fecha_registro}</td>
            <td>
              <a href="actualizar.html?id=${g.id_gestion}" class="btn btn-warning btn-sm">Actualizar</a>
              <a href="eliminar.html?id=${g.id_gestion}" class="btn btn-danger btn-sm">Eliminar</a>
            </td>
          </tr>`;
      });
      $('#tbl_gestion').DataTable();
    })
    .catch(err => {
      console.error(err);
      mostrarMensaje("Error al cargar gestiones.", "danger");
    });
}

function cargarListasDesplegables() {
  return Promise.all([
    cargarListaClientes(),
    cargarListaUsuarios(),
    cargarListaTipoGestion(),
    cargarListaResultado()
  ]);
}

function cargarListaClientes() {
  return fetch("http://144.126.136.43/api/cliente/")
    .then(r => r.json())
    .then(json => {
      const sel = document.getElementById("sel_cliente");
      sel.innerHTML = '<option value="">Seleccione un cliente</option>';
      json.forEach(e =>
        sel.innerHTML += `<option value="${e.id_cliente}">${e.id_cliente}-${e.dv} ${e.apellidos} ${e.nombres}</option>`
      );
    });
}

function cargarListaUsuarios() {
  return fetch("http://144.126.136.43/api/usuario/")
    .then(r => r.json())
    .then(json => {
      const sel = document.getElementById("sel_usuarios");
      sel.innerHTML = '<option value="">Seleccione un usuario</option>';
      json.forEach(e =>
        sel.innerHTML += `<option value="${e.id_usuario}">${e.id_usuario}-${e.dv} ${e.apellidos} ${e.nombres}</option>`
      );
    });
}

function cargarListaTipoGestion() {
  return fetch("http://144.126.136.43/api/tipo_gestion/")
    .then(r => r.json())
    .then(json => {
      const sel = document.getElementById("sel_tipo_gestion");
      sel.innerHTML = '<option value="">Seleccione tipo gestión</option>';
      json.forEach(e =>
        sel.innerHTML += `<option value="${e.id_tipo_gestion}">${e.nombre_tipo_gestion}</option>`
      );
    });
}

function cargarListaResultado() {
  return fetch("http://144.126.136.43/api/resultado/")
    .then(r => r.json())
    .then(json => {
      const sel = document.getElementById("sel_resultado");
      sel.innerHTML = '<option value="">Seleccione resultado</option>';
      json.forEach(e =>
        sel.innerHTML += `<option value="${e.id_resultado}">${e.nombre_resultado}</option>`
      );
    });
}

function agregarGestion() {
  const u = document.getElementById("sel_usuarios").value;
  const c = document.getElementById("sel_cliente").value;
  const t = document.getElementById("sel_tipo_gestion").value;
  const r = document.getElementById("sel_resultado").value;
  const m = document.getElementById("txt_comentarios").value.trim();

  if (!u || !c || !t || !r || !m) {
    mostrarMensaje("Todos los campos son obligatorios.", "danger");
    return;
  }

  // Incluimos fecha_registro en formato ISO-MySQL
  const fecha = new Date().toISOString().slice(0,19).replace("T", " ");

  const body = {
    id_usuario:      u,
    id_cliente:      c,
    id_tipo_gestion: t,
    id_resultado:    r,
    comentarios:     m,
    fecha_registro:  fecha
  };

  console.log("POST /api/gestion/ body:", body);

  fetch(BASE_GESTION_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body)
  })
  .then(async res => {
    const text = await res.text();
    if (!res.ok) {
      console.error("400 Error body:", text);
      mostrarMensaje(`Error al agregar: ${text}`, "danger");
      throw new Error(text);
    }
    return JSON.parse(text);
  })
  .then(data => {
    mostrarMensaje("✅ Gestión agregada correctamente.", "success");
    setTimeout(() => location.href = "listar.html", 1500);
  })
  .catch(_ => { /* ya mostramos el mensaje */ });
}

function obtenerIdEliminacionGestion() {
  const id = new URLSearchParams(window.location.search).get("id");
  document.getElementById("lbl_eliminar_gestion").innerText = `ID: ${id}`;
  window.g_id_gestion = id;
}

function eliminarGestion() {
  fetch(`${BASE_GESTION_URL}${window.g_id_gestion}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("No se eliminó");
      mostrarMensaje("Eliminado 👍", "success");
      setTimeout(() => (window.location.href = "listar.html"), 1000);
    })
    .catch(() => mostrarMensaje("Falló eliminación", "danger"));
}

function obtenerIdActualizacionGestion() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;
  Promise.all([
    cargarListaClientes(),
    cargarListaUsuarios(),
    cargarListaTipoGestion(),
    cargarListaResultado()
  ]).then(() => {
    fetch(`${BASE_GESTION_URL}${id}`)
      .then(r => r.json())
      .then(g => {
        document.getElementById("sel_usuarios").value = g.id_usuario;
        document.getElementById("sel_cliente").value = g.id_cliente;
        document.getElementById("sel_tipo_gestion").value = g.id_tipo_gestion;
        document.getElementById("sel_resultado").value = g.id_resultado;
        document.getElementById("txt_comentarios").value = g.comentarios;
      })
      .catch(() => mostrarMensaje("No se cargó gestión", "danger"));
  });
}

function actualizarGestion() {
    const id = new URLSearchParams(window.location.search).get("id");
    const id_usuario = document.getElementById("sel_usuarios").value;
    const id_cliente = document.getElementById("sel_cliente").value;
    const id_tipo_gestion = document.getElementById("sel_tipo_gestion").value;
    const id_resultado = document.getElementById("sel_resultado").value;
    const comentarios = document.getElementById("txt_comentarios").value.trim();

    if (!id_usuario || !id_cliente || !id_tipo_gestion || !id_resultado || !comentarios) {
        mostrarMensaje("Todos los campos son obligatorios.", "danger");
        return;
    }

    fetch(`${BASE_GESTION_URL}${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_usuario,
            id_cliente,
            id_tipo_gestion,
            id_resultado,
            comentarios
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Falló actualización");
        mostrarMensaje("Actualizado", "success");
        setTimeout(() => (window.location.href = "listar.html"), 1500);
    })
    .catch(() => mostrarMensaje("Error al actualizar gestión.", "danger"));
}
