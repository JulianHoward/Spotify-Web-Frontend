document.addEventListener("DOMContentLoaded", () => {
    const generosTableBody = document.getElementById("generos-table-body");
  
    // Hacer una solicitud GET a la API
    fetch("http://localhost:3000/api/generos")
      .then((response) => response.json())
      .then((data) => {
        // Renderizar los datos en la tabla
        data.forEach((genero) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${genero.id}</td>
            <td>${genero.nombre}</td>
            <td><img src="${`http://localhost:3000/images/generos/${genero.id}.png`}" alt="${genero.nombre}" style="width: 100px;"></td>
            <td>
                <a href="form.html?id=${genero.id}" class="btn btn-primary">Editar</a>
            </td>
            <td>
                <form id="deleteForm" action="http://localhost:3000/api/generos/${genero.id}/delete" method="post" onsubmit="deleteGenero(event, '${genero.id}')">
                    <input type="hidden" name="_method" value="DELETE">
                    <input class="btn btn-danger" type="submit" value="Eliminar" />
                </form>
            </td>
          `;
          generosTableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error al obtener los géneros:", error));
  });
  
  function deleteGenero(event) {
      event.preventDefault();
      const form = event.target; // Obtener el formulario que desencadenó el evento
      fetch(form.action, {
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('No se pudo eliminar el género');
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // Hacer algo con la respuesta si es necesario
          // Actualizar la tabla u otra parte de la interfaz de usuario si es necesario
      })
      .catch(error => {
          console.error(error);
          // Manejar errores de manera adecuada
      });
  }
  