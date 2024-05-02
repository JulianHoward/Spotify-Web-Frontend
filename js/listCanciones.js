document.addEventListener("DOMContentLoaded", () => {
    const cancionesTableBody = document.getElementById("canciones-table-body");

    // Hacer una solicitud GET a la API para obtener las canciones
    fetch("http://localhost:3000/api/canciones")
        .then((response) => response.json())
        .then(async (data) => {
            // Renderizar los datos en la tabla
            for (const cancion of data) {
                // Obtener el nombre del álbum correspondiente a través de una solicitud a la API
                const albumResponse = await fetch(`http://localhost:3000/api/albums/${cancion.album_id}`);
                const albumData = await albumResponse.json();
                const albumNombre = albumData.nombre;

                // Crear una fila para la canción en la tabla
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cancion.id}</td>
                    <td>${cancion.nombre}</td>
                    <td>${albumNombre}</td>
                    <td>${cancion.link}</td>
                    <td><img src="${cancion.imagenUrl}" alt="${cancion.nombre}" style="width: 100px;"></td>
                    <td>${cancion.imagenUrl}</td>
                    <td>
                        <a href="form.html?id=${cancion.id}" class="btn btn-primary">Editar</a>
                    </td>
                    <td>
                        <form id="deleteForm" action="http://localhost:3000/api/canciones/${cancion.id}/delete" method="post" onsubmit="deleteCancion(event, '${cancion.id}')">
                            <input type="hidden" name="_method" value="DELETE">
                            <input class="btn btn-danger" type="submit" value="Eliminar" />
                        </form>
                    </td>
                `;
                cancionesTableBody.appendChild(row);
            }
        })
        .catch((error) => console.error("Error al obtener las canciones:", error));
});
