let g_id_tipo_gestion = null;

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

function listarTipoGestion() {
    fetch("http://144.126.136.43/api/tipo_gestion/")
        .then(response => response.json())
        .then(json => {
            const tbody = document.querySelector("#tbl_tipo_gestion tbody");
            tbody.innerHTML = "";
            json.forEach(element => {
                tbody.innerHTML += `
                    <tr>
                        <td>${element.id_tipo_gestion}</td>
                        <td>${element.nombre_tipo_gestion}</td>
                        <td>${element.fecha_registro}</td>
                        <td>
                            <a href='actualizar.html?id=${element.id_tipo_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
                            <a href='eliminar.html?id=${element.id_tipo_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
                        </td>
                    </tr>`;
            });
            $('#tbl_tipo_gestion').DataTable();
        })
        .catch(() => mostrarMensaje("Error al listar tipos de gestión.", "danger"));
}

function agregarTipoGestion() {
    const nombre_tipo_gestion = document.getElementById("txt_nombre_tipo_gestion").value.trim();
    const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!nombre_tipo_gestion) {
        mostrarMensaje("El nombre es obligatorio.", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        nombre_tipo_gestion,
        fecha_registro
    });

    fetch("http://144.126.136.43/api/tipo_gestion/", {
        method: 'POST',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(() => {
            mostrarMensaje("Tipo de gestión agregado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al agregar tipo de gestión.", "danger"));
}

function obtenerIdActualizacionTipoGestion() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_tipo_gestion = parametros.get("id");
    fetch(`http://144.126.136.43/api/tipo_gestion/${g_id_tipo_gestion}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("txt_id_tipo_gestion").value = data.id_tipo_gestion;
            document.getElementById("txt_nombre_tipo").value = data.nombre_tipo;
        });
}

function actualizarTipoGestion() {
    const id_tipo_gestion = document.getElementById("txt_id_tipo_gestion").value.trim();
    if (!id_tipo_gestion) {
        mostrarMensaje("ID de tipo de gestión es obligatorio.", "warning");
        return;
    }
    const nombre_tipo = document.getElementById("txt_nombre_tipo").value.trim();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_tipo_gestion, nombre_tipo
    });

    fetch(`http://144.126.136.43/api/tipo_gestion/${g_id_tipo_gestion}`, {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(() => {
            mostrarMensaje("Tipo de gestión actualizado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al actualizar tipo de gestión.", "danger"));
}

function obtenerIdEliminacionTipoGestion() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_tipo_gestion = parametros.get("id");
    document.getElementById("lbl_eliminar_tipo_gestion").innerText = "ID Tipo de Gestión: " + g_id_tipo_gestion;
}

function eliminarTipoGestion() {
    fetch(`http://144.126.136.43/api/tipo_gestion/${g_id_tipo_gestion}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                mostrarMensaje("Tipo de gestión eliminado correctamente.", "success");
                setTimeout(() => window.location.href = "listar.html", 1500);
            } else {
                mostrarMensaje("Error al eliminar tipo de gestión.", "danger");
            }
        })
        .catch(() => mostrarMensaje("Error al eliminar tipo de gestión.", "danger"));
}