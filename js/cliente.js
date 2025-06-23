let g_id_cliente = null;

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

function listarClientes() {
    fetch("http://144.126.136.43/api/cliente")
        .then(response => response.json())
        .then(json => {
            const tbody = document.querySelector("#tbl_cliente tbody");
            tbody.innerHTML = "";
            json.forEach(element => {
                tbody.innerHTML += `
                    <tr>
                        <td>${element.id_cliente}</td>
                        <td>${element.dv}</td>
                        <td>${element.nombres}</td>
                        <td>${element.apellidos}</td>
                        <td>${element.email}</td>
                        <td>${element.celular}</td>
                        <td>${element.fecha_registro}</td>
                        <td>
                            <a href='actualizar.html?id=${element.id_cliente}' class='btn btn-warning btn-sm'>Actualizar</a>
                            <a href='eliminar.html?id=${element.id_cliente}' class='btn btn-danger btn-sm'>Eliminar</a>
                        </td>
                    </tr>`;
            });
            $('#tbl_cliente').DataTable();
        })
        .catch(() => mostrarMensaje("Error al listar clientes.", "danger"));
}

function agregarCliente() {
    const id_cliente = document.getElementById("txt_id_cliente").value.trim();
    const dv = document.getElementById("txt_dv").value.trim();
    const nombres = document.getElementById("txt_nombres").value.trim();
    const apellidos = document.getElementById("txt_apellidos").value.trim();
    const email = document.getElementById("txt_email").value.trim();
    const celular = document.getElementById("txt_celular").value.trim();
    const fecha_registro = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!nombres || !apellidos || !email || !celular || !id_cliente || !dv) {
        mostrarMensaje("Todos los campos obligatorios.", "warning");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_cliente, dv, nombres, apellidos, email, celular, fecha_registro
    });

    fetch("http://144.126.136.43/api/cliente", {
        method: 'POST',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(() => {
            mostrarMensaje("Cliente agregado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al agregar cliente.", "danger"));
}

function obtenerIdActualizacionCliente() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_cliente = parametros.get("id");
    fetch(`http://144.126.136.43/api/cliente/${g_id_cliente}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("txt_id_cliente").value = data.id_cliente;
            document.getElementById("txt_dv").value = data.dv;
            document.getElementById("txt_nombres").value = data.nombres;
            document.getElementById("txt_apellidos").value = data.apellidos;
            document.getElementById("txt_email").value = data.email;
            document.getElementById("txt_celular").value = data.celular;
        });
}

function actualizarCliente() {
    const id_cliente = document.getElementById("txt_id_cliente").value.trim();
    if (!id_cliente) {
        mostrarMensaje("ID de cliente es obligatorio.", "warning");
        return;
    }
    const dv = document.getElementById("txt_dv").value.trim();
    const nombres = document.getElementById("txt_nombres").value.trim();
    const apellidos = document.getElementById("txt_apellidos").value.trim();
    const email = document.getElementById("txt_email").value.trim();
    const celular = document.getElementById("txt_celular").value.trim();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        id_cliente, dv, nombres, apellidos, email, celular
    });

    fetch(`http://144.126.136.43/api/cliente/${g_id_cliente}`, {
        method: 'PATCH',
        headers: myHeaders,
        body: raw
    })
        .then(response => response.text())
        .then(() => {
            mostrarMensaje("Cliente actualizado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch(() => mostrarMensaje("Error al actualizar cliente.", "danger"));
}

function obtenerIdEliminacionCliente() {
    const parametros = new URLSearchParams(window.location.search);
    g_id_cliente = parametros.get("id");
    document.getElementById("lbl_eliminar_cliente").innerText = "ID Cliente: " + g_id_cliente;
}

function eliminarCliente() {
    fetch(`http://144.126.136.43/api/cliente/${g_id_cliente}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                mostrarMensaje("Cliente eliminado correctamente.", "success");
                setTimeout(() => window.location.href = "listar.html", 1500);
            } else {
                mostrarMensaje("Error al eliminar cliente.", "danger");
            }
        })
        .catch(() => mostrarMensaje("Error al eliminar cliente.", "danger"));
}