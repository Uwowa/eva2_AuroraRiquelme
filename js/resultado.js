let g_id_resultado = null;
function agregarResultado() {
    const nombre = document.getElementById("txt_nombre_resultado").value.trim();
    if (!nombre) {
        alert("Debe ingresar un nombre para el resultado.");
        return;
    }
    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' '); // formato MySQL DATETIME

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nombre_resultado": nombre,
        "fecha_registro": fecha
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            mostrarMensaje("Resultado agregado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch((error) => {
            mostrarMensaje("Error al agregar resultado.", "danger");
            console.error(error);
        });
}
function listarResultados() {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log(json); // <-- Agrega esto
            const tbody = document.querySelector("#tbl_resultado tbody");
            tbody.innerHTML = "";
            json.forEach(element => {
                tbody.innerHTML += `
                    <tr>
                        <td>${element.id_resultado}</td>
                        <td>${element.nombre_resultado}</td>
                        <td>${element.fecha_registro}</td>
                        <td>
                            <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
                            <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
                        </td>
                    </tr>`;
            });
        })
        .catch((error) => console.error(error));
}
function completarFila(element,index,arr) {
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML += 
        `<tr>
            <td>${element.id_resultado}</td>
            <td>${element.nombre_resultado}</td>
            <td>${element.fecha_registro}</td>
            <td>
                <a href='actualizar.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
                <a href='eliminar.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
            </td>
        </tr>`
}
function actualizarResultado() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const nombre = document.getElementById("txt_nombre_resultado").value;

    const raw = JSON.stringify({
        "nombre_resultado": nombre
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado/" + g_id_resultado, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            mostrarMensaje("Resultado actualizado correctamente.", "success");
            setTimeout(() => window.location.href = "listar.html", 1500);
        })
        .catch((error) => {
            mostrarMensaje("Error al actualizar resultado.", "danger");
            console.error(error);
        });
}
//Obtenemos el ID del resultado que queremos actualizar
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get("id");
    //asignamos a la variable global el id a actualizar
    g_id_resultado = p_id_resultado;
    //Invocamos un método para obtener los datos del resultado en pantalla
    obtenerDatosActualizacion(p_id_resultado);

}
function obtenerDatosActualizacion(id_resultado) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado/"+id_resultado, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function completarFormulario(element,index,arr) {
    var nombre = element.nombre_resultado;
    document.getElementById("txt_nombre_resultado").value = nombre;

}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    g_id_resultado = parametros.get("id");
    document.getElementById("lbl_eliminar").innerText = "ID: " + g_id_resultado;
}

function eliminarResultado() {
    if (!g_id_resultado) {
        alert("No se encontró el ID del resultado.");
        return;
    }
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    fetch("http://144.126.136.43/api/resultado/" + g_id_resultado, requestOptions)
        .then(response => {
            if (response.ok) {
                alert("Resultado eliminado correctamente");
                window.location.href = "listar.html";
            } else {
                alert("Error al eliminar el resultado");
            }
        })
        .catch(error => console.error(error));
}

function mostrarMensaje(mensaje, tipo = "info") {
    let alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${tipo} mt-3`;
    alertDiv.role = "alert";
    alertDiv.innerText = mensaje;

    const contenedor = document.querySelector(".container");
    contenedor.prepend(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
