

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const generoId = urlParams.get('id');

    // Obtener datos del género y poblar el formulario al cargar la página
    fetch(`http://localhost:3000/api/generos/${generoId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("imagenUrl").value = data.imagenUrl;
        })
        .catch(error => console.error("Error al obtener el género:", error));

    // Escuchar el evento de envío del formulario
    document.getElementById("editForm").addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los datos del formulario
        const nombre = document.getElementById("nombre").value;
        const imagenUrl = document.getElementById("imagenUrl").value;

        // Realizar la solicitud PUT a la ruta de actualización
        fetch(`http://localhost:3000/api/generos/${generoId}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, imagenUrl })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo actualizar el género');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Hacer algo con la respuesta si es necesario
            // Redirigir o actualizar la interfaz de usuario si es necesario
        })
        .catch(error => {
            console.error(error);
            // Manejar errores de manera adecuada
        });
    });
});
