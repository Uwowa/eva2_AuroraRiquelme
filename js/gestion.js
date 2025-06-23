let g_id_gestion = null;

// Mostrar mensajes Bootstrap
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
        </div>
    `;
}

// LISTAR
function listarGestiones() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "query": "SELECT g.id_gestion, u.id_usuario as rut_usuario, CONCAT(u.nombres,' ',u.apellidos) as nombre_usuario, c.id_cliente as rut_cliente, CONCAT(c.nombres,' ',c.apellidos) as nombre_cliente, tg.nombre_tipo_gestion, r.nombre_resultado, g.comentarios, g.fecha_registro FROM gestiones g INNER JOIN usuarios u ON g.id_usuario = u.id_usuario INNER JOIN clientes c ON g.id_cliente = c.id_cliente INNER JOIN tipo_gestion tg ON g.id_tipo_gestion = tg.id_tipo_gestion INNER JOIN resultado r ON g.id_resultado = r.id_resultado"
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/dynamic", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            const tbody = document.querySelector("#tbl_gestion tbody");
            tbody.innerHTML = "";
            json.forEach(element => {
                tbody.innerHTML += `
                    <tr>
                        <td>${element.id_gestion}</td>
                        <td>${element.rut_usuario}</td>
                        <td>${element.nombre_usuario}</td>
                        <td>${element.rut_cliente}</td>
                        <td>${element.nombre_cliente}</td>
                        <td>${element.nombre_tipo_gestion}</td>
                        <td>${element.nombre_resultado}</td>
                        <td>${element.comentarios}</td>
                        <td>${element.fecha_registro}</td>
                        <td>
                            <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
                            <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
                        </td>
                    </tr>`;
            });
            $('#tbl_gestion').DataTable();
        })
        .catch((error) => {
            mostrarMensaje("Error al listar gestiones.", "danger");
            console.error(error);
        });
}

// AGREGAR
function agregarGestion() {
    const id_usuario = document.getElementById("txt_id_usuario").value.trim();
    const id_cliente = document.getElementById("txt_id_cliente").value.trim();
    const id_tipo_gestion = document.getElementById("txt_id_tipo_gestion").value.trim();
    const id_resultado = document.getElementById("txt_id_resultado").value.trim();
    const comentarios = document.getElementById("txt_comentarios").value.trim();
    const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!id_usuario || !id_cliente || !id_tipo_gestion || !id_resultado) {
        mostrarMensaje("Todos los campos son obligatorios.", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_usuario,
        id_cliente,
        id_tipo_gestion,
        id_resultado,
        comentarios,
        fecha_registro
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/gestion", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            mostrarMensaje("Gestión agregada correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch((error) => {
            mostrarMensaje("Error al agregar gestión.", "danger");
            console.error(error);
        });
}

// ACTUALIZAR
function obtenerIdActualizacionGestion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    g_id_gestion = parametros.get("id");
    obtenerDatosActualizacionGestion(g_id_gestion);
}

function obtenerDatosActualizacionGestion(id_gestion) {
    fetch(`http://144.126.136.43/api/gestion/${id_gestion}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("txt_id_usuario").value = data.id_usuario;
            document.getElementById("txt_id_cliente").value = data.id_cliente;
            document.getElementById("txt_id_tipo_gestion").value = data.id_tipo_gestion;
            document.getElementById("txt_id_resultado").value = data.id_resultado;
            document.getElementById("txt_comentarios").value = data.comentarios;
        })
        .catch(error => {
            mostrarMensaje("Error al cargar datos de gestión.", "danger");
            console.error(error);
        });
}

function actualizarGestion() {
    const id_usuario = document.getElementById("txt_id_usuario").value.trim();
    const id_cliente = document.getElementById("txt_id_cliente").value.trim();
    const id_tipo_gestion = document.getElementById("txt_id_tipo_gestion").value.trim();
    const id_resultado = document.getElementById("txt_id_resultado").value.trim();
    const comentarios = document.getElementById("txt_comentarios").value.trim();

    if (!id_usuario || !id_cliente || !id_tipo_gestion || !id_resultado) {
        mostrarMensaje("Todos los campos son obligatorios.", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_usuario,
        id_cliente,
        id_tipo_gestion,
        id_resultado,
        comentarios
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://144.126.136.43/api/gestion/${g_id_gestion}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            mostrarMensaje("Gestión actualizada correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(error => {
            mostrarMensaje("Error al actualizar gestión.", "danger");
            console.error(error);
        });
}

// ELIMINAR
function obtenerIdEliminacionGestion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    g_id_gestion = parametros.get("id");
    document.getElementById("lbl_eliminar_gestion").innerText = "ID: " + g_id_gestion;
}

function eliminarGestion() {
    if (!g_id_gestion) {
        mostrarMensaje("No se encontró el ID de la gestión.", "danger");
        return;
    }
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    fetch(`http://144.126.136.43/api/gestion/${g_id_gestion}`, requestOptions)
        .then(response => {
            if (response.ok) {
                mostrarMensaje("Gestión eliminada correctamente.", "success");
                setTimeout(() => window.location.href = "listar.html", 1500);
            } else {
                mostrarMensaje("Error al eliminar gestión.", "danger");
            }
        })
        .catch(error => {
            mostrarMensaje("Error al eliminar gestión.", "danger");
            console.error(error);
        });
}
