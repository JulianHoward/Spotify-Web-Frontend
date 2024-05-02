
document.addEventListener("DOMContentLoaded", async () => {
    const contenedorGeneros = document.getElementById("contenedor-generos");
    const artistDetailsContainer = document.getElementById("artist-details-container");
    const albumDetailContainer = document.getElementById("album-detail");

    try {
        // Cargar los géneros al cargar el documento
        const response = await fetch("http://localhost:3000/api/generos");
        const data = await response.json();
        data.forEach((genero) => {
            // Crear elemento de género
            const generoElemento = document.createElement("div");
            generoElemento.classList.add("genero"); // Clase CSS para estilizar el elemento
            generoElemento.textContent = genero.nombre;

            // Crear elemento de imagen del género
            const imagenGenero = document.createElement("img");
            imagenGenero.src = genero.imagenUrl;
            imagenGenero.alt = genero.nombre;
            generoElemento.appendChild(imagenGenero); // Agregar la imagen al elemento del género

            // Agregar evento click al elemento del género
            generoElemento.addEventListener("click", async () => {
                const artistas = await obtenerArtistasPorGenero(genero.id);
                // Mostrar los artistas del género
                await mostrarArtistas(artistas);
            });

            contenedorGeneros.appendChild(generoElemento); // Agregar el elemento del género al contenedor
        });
    } catch (error) {
        console.error("Error al obtener géneros:", error);
    }
});

// Función para obtener los artistas de un género específico
async function obtenerArtistasPorGenero(generoId) {
    console.log("genero ID: " + generoId);
    try {
        const response = await fetch(`http://localhost:3000/api/artistasByGenero`);
        const data = await response.json();
        
        // Filtrar los artistas por genero_id
        const artistasPorGenero = data.filter(item => item.genero_id === generoId);
        console.log("A por G ", artistasPorGenero)
        
        // Obtener los artist_id correspondientes
        const artistIds = artistasPorGenero.map(item => item.artist_id);
        
        return artistIds;
    } catch (error) {
        console.error("Error al obtener artistas por género:", error);
        return [];
    }
}

async function mostrarArtistas(artistas) {
    try {
      // Ocultar los géneros
      const contenedorGeneros = document.getElementById("contenedor-generos");
      const artistDetailsContainer = document.getElementById("artist-details-container");
      contenedorGeneros.style.display = "none";
      // Limpiar contenido anterior
      artistDetailsContainer.innerHTML = "";
      // Mostrar los detalles de todos los artistas
      for (const artist of artistas) {
        const artistId = artist; // Cambiar artist.id a artist
        const artistData = await obtenerDetallesArtista(artistId);
        mostrarDetallesArtista(artistData);
      }
      // Mostrar el contenedor de detalles de artistas
    } catch (error) {
      console.error("Error al mostrar artistas:", error);
    }
  }

// Función para obtener los detalles de un artista
async function obtenerDetallesArtista(artistId) {
    console.log("artist ID: " + artistId)
    try {
        const response = await fetch(`http://localhost:3000/api/artistas/${artistId}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener detalles del artista:", error);
        return null;
    }
}

// Función para mostrar los detalles de un artista
function mostrarDetallesArtista(artistData) {
    const artistDetailsContainer = document.getElementById("artist-details-container");
    const artistElement = document.createElement("div");
    artistElement.classList.add("artist-details");
    artistElement.innerHTML = `
        <span>${artistData.nombre}</span> <!-- Título -->
        <img src="${artistData.imagenUrl}" alt="${artistData.nombre}" /> <!-- Imagen -->
    `;
    artistDetailsContainer.appendChild(artistElement);

    // Agregar evento click para mostrar los álbumes del artista
    artistElement.addEventListener("click", async () => {
        await mostrarAlbumesArtista(artistData.id);
    });
}


// Función para mostrar los álbumes de un artista
async function mostrarAlbumesArtista(artistaId) {
    try {
        // Ocultar los artistas
        const artistDetailsContainer = document.getElementById("artist-details-container");
        const albumDetailContainer = document.getElementById("album-detail");
        artistDetailsContainer.style.display = "none";
        // Limpiar contenido anterior
        albumDetailContainer.innerHTML = "";

        // Obtener todas las canciones
        const responseCanciones = await fetch("http://localhost:3000/api/canciones");
        const canciones = await responseCanciones.json();

        // Filtrar las canciones por álbum
        const songsByAlbum = {};
        canciones.forEach(song => {
            const albumId = song.album_id;
            if (!songsByAlbum[albumId]) {
                songsByAlbum[albumId] = [];
            }
            songsByAlbum[albumId].push(song);
        });

        // Obtener los álbumes del artista
        const responseAlbums = await fetch("http://localhost:3000/api/albums");
        const albums = await responseAlbums.json();

        // Filtrar los álbumes del artista específico
        const albumsDelArtista = albums.filter(album => album.artista_id === artistaId);

        // Crear una lista para los álbumes
        const albumList = document.createElement("ul");

        // Iterar sobre cada álbum del artista
        for (const album of albumsDelArtista) {
            const albumItem = document.createElement("li");

            const albumName = document.createElement("div");
            albumName.textContent = album.nombre;
            albumItem.appendChild(albumName);

            const albumImage = document.createElement("img"); // Para la imagen del álbum
            albumImage.src = album.imagenUrl;
            albumImage.alt = album.nombre;
            albumItem.appendChild(albumImage);

            // Crear una lista para las canciones del álbum
            const songsList = document.createElement("ul");

            // Obtener las canciones del álbum actual
            const songsOfAlbum = songsByAlbum[album.id] || [];

            // Iterar sobre cada canción del álbum actual
            for (const song of songsOfAlbum) {
                // Construir la ruta del archivo de audio con la nueva ubicación
                const audioFilePath = `http://localhost:3000/pu4/songs/${song.id}.mp3`;

                // Crear el elemento de audio
                const audioElement = document.createElement("audio");
                audioElement.controls = true;
                audioElement.src = audioFilePath;

                // Crear un elemento de lista para la canción
                const songItem = document.createElement("li");
                songItem.textContent = song.nombre;

                // Agregar el elemento de audio al elemento de la lista
                songItem.appendChild(audioElement);

                // Agregar el elemento de lista al contenedor de canciones
                songsList.appendChild(songItem);
            }

            // Agregar la lista de canciones al elemento del álbum
            albumItem.appendChild(songsList);

            // Agregar evento click para mostrar las canciones del álbum
            albumItem.addEventListener("click", async () => {
                // Limpiar contenido anterior
                songsList.innerHTML = "";

                // Obtener las canciones del álbum actual
                const songsOfAlbum = songsByAlbum[album.id] || [];

                // Iterar sobre cada canción del álbum actual
                for (const song of songsOfAlbum) {
                    // Construir la ruta del archivo de audio con la nueva ubicación
                    const audioFilePath = `http://localhost:3000/pu4/songs/${artistaId}_${album.id}.mp3`;

                    // Crear el elemento de audio
                    const audioElement = document.createElement("audio");
                    audioElement.controls = true;
                    audioElement.src = audioFilePath;

                    // Crear un elemento de lista para la canción
                    const songItem = document.createElement("li");
                    songItem.textContent = song.nombre;

                    // Agregar el elemento de audio al elemento de la lista
                    songItem.appendChild(audioElement);

                    // Agregar el elemento de lista al contenedor de canciones
                    songsList.appendChild(songItem);
                }
            });

            // Agregar el elemento del álbum a la lista de álbumes
            albumList.appendChild(albumItem);
        }

        // Mostrar la lista de álbumes del artista
        albumDetailContainer.appendChild(albumList);
    } catch (error) {
        console.error("Error al obtener álbumes del artista:", error);
    }
}


// Función para reproducir una canción de audio MP3
function reproducirCancion(urlCancion) {
    // Limpiar el contenedor
    const albumDetailContainer = document.getElementById("album-detail"); 
    albumDetailContainer.innerHTML = "";
    
    // Crear un elemento de audio
    const audioElement = document.createElement("audio");
    audioElement.controls = true; // Mostrar los controles de reproducción
    audioElement.src = urlCancion; // Establecer la URL del archivo de audio MP3
    audioElement.type = "audio/mp3"; // Establecer el tipo de archivo de audio

    // Agregar el elemento de audio al contenedor
    albumDetailContainer.appendChild(audioElement);

    // Reproducir la canción
    console.log(urlCancion);
    audioElement.play();
}

