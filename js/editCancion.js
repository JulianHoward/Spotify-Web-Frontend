

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cancionId = urlParams.get('id');

    // Obtener datos del género y poblar el formulario al cargar la página
    fetch(`http://localhost:3000/api/canciones/${cancionId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("album_id").value = data.album_id;
            document.getElementById("link").value = data.link;
            document.getElementById("imagenUrl").value = data.imagenUrl;
        })
        .catch(error => console.error("Error al obtener la canción:", error));

    // Escuchar el evento de envío del formulario
    document.getElementById("editForm").addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los datos del formulario
        const nombre = document.getElementById("nombre").value;
        const album_id = document.getElementById("album_id").value;
        const link = document.getElementById("link").value;
        const imagenUrl = document.getElementById("imagenUrl").value;

        // Realizar la solicitud PUT a la ruta de actualización
        fetch(`http://localhost:3000/api/canciones/${cancionId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, album_id, link, imagenUrl })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo actualizar la canción');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.error(error);
        });
    });
});
