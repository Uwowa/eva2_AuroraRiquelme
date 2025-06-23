let g_id_usuario = null;

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

function listarUsuarios() {
    fetch("http://144.126.136.43/api/usuario")
        .then(response => response.json())
        .then(json => {
            const tbody = document.querySelector("#tbl_usuario tbody");
            tbody.innerHTML = "";
            json.forEach(element => {
                tbody.innerHTML += `
                    <tr>
                        <td>${element.id_usuario}</td>
                        <td>${element.dv}</td>
                        <td>${element.nombres}</td>
                        <td>${element.apellidos}</td>
                        <td>${element.email}</td>
                        <td>${element.celular}</td>
                        <td>${element.username}</td>
                        <td>${element.fecha_registro}</td>
                        <td>
                            <a href='actualizar.html?id=${element.id_usuario}' class='btn btn-warning btn-sm'>Actualizar</a>
                            <a href='eliminar.html?id=${element.id_usuario}' class='btn btn-danger btn-sm'>Eliminar</a>
                        </td>
                    </tr>`;
            });
            $('#tbl_usuario').DataTable();
        })
        .catch(() => mostrarMensaje("Error al listar usuarios.", "danger"));
}

function agregarUsuario() {
    const id_usuario = document.getElementById("txt_id_usuario").value.trim();
    const dv = document.getElementById("txt_dv").value.trim();
    const nombres = document.getElementById("txt_nombres").value.trim();
    const apellidos = document.getElementById("txt_apellidos").value.trim();
    const email = document.getElementById("txt_email").value.trim();
    const celular = document.getElementById("txt_celular").value.trim();
    const username = document.getElementById("txt_username").value.trim();
    const password = document.getElementById("txt_password").value.trim();
    const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!nombres || !apellidos || !email || !username || !password) {
        mostrarMensaje("Todos los campos obligatorios.", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_usuario, dv, nombres, apellidos, email, celular, username, password, fecha_registro
    });

    fetch("http://144.126.136.43/api/usuario", {
        method: 'POST',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(result => {
            mostrarMensaje("Usuario agregado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al agregar usuario.", "danger"));
}

function obtenerIdActualizacionUsuario() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_usuario = parametros.get("id");
    fetch(`http://144.126.136.43/api/usuario/${g_id_usuario}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("txt_id_usuario").value = data.id_usuario;
            document.getElementById("txt_dv").value = data.dv;
            document.getElementById("txt_nombres").value = data.nombres;
            document.getElementById("txt_apellidos").value = data.apellidos;
            document.getElementById("txt_email").value = data.email;
            document.getElementById("txt_celular").value = data.celular;
            document.getElementById("txt_username").value = data.username;
            // No mostrar password por seguridad
        });
}

function actualizarUsuario() {
    const id_usuario = document.getElementById("txt_id_usuario").value.trim();
    if (!id_usuario) {
        mostrarMensaje("ID de usuario es obligatorio.", "warning");
        return;
    }
    const dv = document.getElementById("txt_dv").value.trim();
    const nombres = document.getElementById("txt_nombres").value.trim();
    const apellidos = document.getElementById("txt_apellidos").value.trim();
    const email = document.getElementById("txt_email").value.trim();
    const celular = document.getElementById("txt_celular").value.trim();
    const username = document.getElementById("txt_username").value.trim();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_usuario, dv, nombres, apellidos, email, celular, username
    });

    fetch(`http://144.126.136.43/api/usuario/${g_id_usuario}`, {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(() => {
            mostrarMensaje("Usuario actualizado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al actualizar usuario.", "danger"));
}

function obtenerIdEliminacionUsuario() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_usuario = parametros.get("id");
    document.getElementById("lbl_eliminar_usuario").innerText = "ID Usuario: " + g_id_usuario;
}

function eliminarUsuario() {
    fetch(`http://144.126.136.43/api/usuario/${g_id_usuario}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                mostrarMensaje("Usuario eliminado correctamente.", "success");
                setTimeout(() => window.location.href = "listar.html", 1500);
            } else {
                mostrarMensaje("Error al eliminar usuario.", "danger");
            }
        })
        .catch(() => mostrarMensaje("Error al eliminar usuario.", "danger"));
}