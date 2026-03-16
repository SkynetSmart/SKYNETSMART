
  //Script para cambio de imagen
    function cambiarImagen(idOcultar, idMostrar) {
      document.getElementById(idOcultar).style.display = "none";
      document.getElementById(idMostrar).style.display = "block";
    }

  // Script para la seccion oculta
  
    function mostrarSeccion(id) {
      // Ocultar todas las secciones
      const secciones = document.querySelectorAll('.seccion-oculta, .seccion-visible');
      secciones.forEach(seccion => seccion.classList.remove('seccion-visible'));

      // Mostrar la seleccionada
      const activa = document.getElementById(id);
      if (activa) {
        activa.classList.add('seccion-visible');
      }
    }
  
 //buscador
 const inputBuscar = document.getElementById('buscar');

    inputBuscar.addEventListener('input', function () {
      const texto = this.value.toLowerCase().trim();
      const secciones = document.querySelectorAll('.seccion-oculta');

      if (texto === '') {
        // Cuando está vacío, ocultar TODAS las secciones
        secciones.forEach(seccion => {
          seccion.style.display = 'none';
          // También ocultar todos los productos dentro
          const productos = seccion.querySelectorAll('.tarjeta');
          productos.forEach(producto => producto.style.display = 'none');
        });
        return;
      }

      secciones.forEach(seccion => {
        let coincidenciaEncontrada = false;
        const productos = seccion.querySelectorAll('.tarjeta');

        productos.forEach(producto => {
          const titulo = producto.querySelector('.titulocompu1')?.textContent.toLowerCase();

          if (titulo && titulo.includes(texto)) {
            producto.style.display = 'block';
            coincidenciaEncontrada = true;
          } else {
            producto.style.display = 'none';
          }
        });

        seccion.style.display = coincidenciaEncontrada ? 'block' : 'none';
      });
    });

    function mostrarSeccion(id) {
      const secciones = document.querySelectorAll('.seccion-oculta');

      // Oculta todas las secciones y sus productos
      secciones.forEach(seccion => {
        seccion.style.display = 'none';
        const productos = seccion.querySelectorAll('.tarjeta');
        productos.forEach(producto => producto.style.display = 'none');
      });

      // Muestra la sección y todos sus productos que seleccionaste
      const mostrar = document.getElementById(id);
      if (mostrar) {
        mostrar.style.display = 'block';
        const productos = mostrar.querySelectorAll('.tarjeta');
        productos.forEach(producto => producto.style.display = 'block');
      }

      // Limpia el buscador para evitar conflicto con la búsqueda
      inputBuscar.value = '';
    }
//carrusel
const carrusel = document.getElementById('publicidadInner');
  const totalImagenes = carrusel.children.length;
  let index = 0;

  const moverCarrusel = () => {
    carrusel.style.transform = `translateX(-${index * 600}px)`;
  };

  // Flecha de la izquierda
  document.getElementById('btnAnterior').addEventListener('click', () => {
    index = (index - 1 + totalImagenes) % totalImagenes;
    moverCarrusel();
  });

  // Flecha de la derecha
  document.getElementById('btnSiguiente').addEventListener('click', () => {
    index = (index + 1) % totalImagenes;
    moverCarrusel();
  });

  // Autoavance (opcional, puedes quitar esto si no quieres que avance solo)
  setInterval(() => {
    index = (index + 1) % totalImagenes;
    moverCarrusel();
  }, 3000);
 