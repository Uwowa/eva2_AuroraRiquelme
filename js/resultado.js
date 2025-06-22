function agregarResultado() {
    //Obtenemos el resultado
    var resultado = document.getElementById("txt_resultado").value;

    //Definición de encabezados
    const headers = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Datos a enviar
    const raw = JSON.stringify({
        "nombre:resultado": resultado,
        "fecha_registro": "2025-06-21 00:00:00"
    });

    //Configuración de la solicitud
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    //Ejecutamos la solicitud HTTP a la API
    fetch("http://144.126.136.43/api/resultado"), requestOptions
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    
}
function listarResultados() {
    //Configuración de la solicitud
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
        .then((response) => response.json())
        .then((json) => {
            json.forEach(completarFila);
        })
        .then((result) => console.log(result))
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

    const raw = JSON.stringify({
        "nombre_resultado": "Prueba 1905"
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado/267", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
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

function eliminarResultado() {
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    fetch("http://144.126.136.43/api/resultado/"+g_id_resultado, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get("id");
    
    g_id_resultado = p_id_resultado;

    obtenerDatosEliminacion(p_id_resultado);
}

function obtenerDatosEliminacion(id_resultado) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://144.126.136.43/api/resultado/"+id_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetas))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
function completarEtiquetas(element,index,arr) {
    //Completamos una etiqueta con la pregunta al usuario
    var nombreEliminar = element.nombre_resultado;
    document.getElementById("lbl_eliminar").innerHTML ="¿Desea eliminar el registro " + nombreEliminar + "?";
}
