
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
const imagenesOriginales = carrusel.children;
const totalOriginales = imagenesOriginales.length;
let index = 0;
let autoavance;

// 1. Clonar la primera imagen y añadirla al final
const primeraClonada = imagenesOriginales[0].cloneNode(true);
carrusel.appendChild(primeraClonada);

const moverCarrusel = (conAnimacion = true) => {
    // Si queremos un salto instantáneo, quitamos la transición
    carrusel.style.transition = conAnimacion ? "transform 0.8s ease" : "none";
    carrusel.style.transform = `translateX(-${index * 600}px)`;
};

const siguiente = () => {
    index++;
    moverCarrusel(true);

    // Si llegamos al clon (al final), saltamos al inicio real sin que se note
    if (index === totalOriginales) {
        setTimeout(() => {
            index = 0;
            moverCarrusel(false); // Salto instantáneo
        }, 800); // 800ms es lo que dura tu transición CSS
    }
};

const anterior = () => {
    if (index === 0) {
        // Si estamos al inicio y damos atrás, saltamos al clon primero
        index = totalOriginales;
        moverCarrusel(false);
        // Y luego animamos hacia la última imagen real
        setTimeout(() => {
            index = totalOriginales - 1;
            moverCarrusel(true);
        }, 10);
    } else {
        index--;
        moverCarrusel(true);
    }
};

const iniciarTemporizador = () => {
    clearInterval(autoavance);
    autoavance = setInterval(siguiente, 3000);
};

// Eventos
document.getElementById('btnSiguiente').addEventListener('click', () => {
    siguiente();
    iniciarTemporizador();
});

document.getElementById('btnAnterior').addEventListener('click', () => {
    anterior();
    iniciarTemporizador();
});

iniciarTemporizador();