
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
/*OCULTA LAS SECCIONES Y PUBLICIDAD*/
  function mostrarSeccion(id) {
      const secciones = document.querySelectorAll('.seccion-oculta');

    // 1. Ocultamos el bloque de publicidad y video (Laptops + TikTok)
    const publicidadInicio = document.querySelector('.bloque-publicidad-inicio');
    if (publicidadInicio) {
    publicidadInicio.style.display = 'none';
    }


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
/*Al hacer click en el logo vuelve al inicio*/
function irAlInicio() {
    // 1. Buscamos el bloque de Laptops + Video
    const publicidadInicio = document.querySelector('.bloque-publicidad-inicio');
    
    // 2. Lo volvemos a mostrar (porque mostrarSeccion lo había ocultado)
    if (publicidadInicio) {
        publicidadInicio.style.display = 'flex';
    }

    // 3. ESTA ES LA LÍNEA QUE PREGUNTAS: Apaga las otras secciones (PCs, Celulares, etc.)
    const secciones = document.querySelectorAll('.seccion-oculta');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });

    // 4. Limpia el buscador para que no queden textos viejos
    if (inputBuscar) inputBuscar.value = '';
}

/************************************************************************************************************/
// --- FUNCIÓN PARA FILTRAR SUMINISTROS ---
function filtrarSuministros(categoria, botonPresionado) {
    // 1. Quitarle la clase 'activo' a todos los botones
    let botones = document.querySelectorAll('.btn-suministro');
    botones.forEach(function(btn) {
        btn.classList.remove('activo');
    });
    
    // 2. Ponerle la clase 'activo' (verde) solo al botón que se hizo clic
    botonPresionado.classList.add('activo');

    // 3. Filtrar los productos
    let productos = document.querySelectorAll('.item-suministro');
    
    productos.forEach(function(producto) {
        if (categoria === 'todos') {
            producto.style.display = 'block'; // Muestra todos
        } else {
            // Si la tarjeta tiene la clase de la categoría (ej. 'tintas'), se muestra, si no, se oculta
            if (producto.classList.contains(categoria)) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        }
    });
}
/************************************************************************************************************/
// FUNCIÓN PARA FILTRAR COMPONENTES Y CAMBIAR COLOR DEL BOTÓN
function filtrarComponentes(categoriaSeleccionada, botonClicado) {
    
    // 1. GESTIÓN VISUAL DE LOS BOTONES
    // Capturamos todos los botones dentro de este panel específico
    let botones = document.querySelectorAll('.panel-filtros-pildora .btn-pildora');
    // Le quitamos la clase 'activo' (el color verde) a todos
    botones.forEach(boton => boton.classList.remove('activo'));
    // Le ponemos la clase 'activo' SOLO al botón que se acaba de presionar
    botonClicado.classList.add('activo');

    // 2. FILTRADO DE TARJETAS
    // Nos aseguramos de buscar solo dentro de la sección de componentes
    let tarjetas = document.querySelectorAll('#Componentes .tarjeta');
    
    tarjetas.forEach(tarjeta => {
        if (categoriaSeleccionada === 'todas') {
            tarjeta.style.display = 'block'; 
        } else {
            if (tarjeta.classList.contains(categoriaSeleccionada)) {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        }
    });

    // 3. OCULTAR SUBTÍTULOS
    let subtitulos = document.querySelectorAll('#Componentes .subtitulo-categoria');
    subtitulos.forEach(subtitulo => {
        if (categoriaSeleccionada === 'todas') {
            subtitulo.style.display = 'block';
        } else {
            subtitulo.style.display = 'none';
        }
    });
}


// FUNCIÓN PARA FILTRAR PERIFÉRICOS (Adaptada para ID con tilde)
function filtrarPerifericos(categoriaSeleccionada, botonClicado) {
    
    // 1. GESTIÓN VISUAL: Buscamos dentro del ID con tilde
    let botones = document.querySelectorAll('#Periféricos .btn-pildora');
    botones.forEach(boton => boton.classList.remove('activo'));
    botonClicado.classList.add('activo');

    // 2. FILTRADO DE TARJETAS: Buscamos dentro del ID con tilde
    let tarjetas = document.querySelectorAll('#Periféricos .tarjeta');
    
    tarjetas.forEach(tarjeta => {
        if (categoriaSeleccionada === 'todas') {
            tarjeta.style.display = 'block'; 
        } else {
            if (tarjeta.classList.contains(categoriaSeleccionada)) {
                tarjeta.style.display = 'block';
            } else {
                tarjeta.style.display = 'none';
            }
        }
    });
}

/*// HABILITAR SCROLL HORIZONTAL EN EL MENÚ PRINCIPAL (CON SOPORTE PARA TRACKPAD)
const carruselPrincipal = document.querySelector('.carrusel');

if (carruselPrincipal) {
    carruselPrincipal.addEventListener('wheel', function(e) {
        // DETECCIÓN DE PANEL TÁCTIL (Trackpad)
        // Si el usuario mueve los dedos hacia los lados, dejamos que la laptop haga su trabajo natural
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            return; 
        }

        // DETECCIÓN DE MOUSE DE ESCRITORIO
        // Si el usuario gira la rueda de un mouse normal (movimiento vertical)
        e.preventDefault(); 
        
        // Multiplicamos por 2 para que el giro del mouse sea más ágil y menos cansado
        carruselPrincipal.scrollLeft += (e.deltaY * 2); 
    }, { passive: false });
}*/

// HABILITAR SCROLL HORIZONTAL EN EL MENÚ PRINCIPAL (VELOCIDAD PREMIUM)
const carruselPrincipal = document.querySelector('.carrusel');

if (carruselPrincipal) {
    carruselPrincipal.addEventListener('wheel', function(e) {
        // Respeta el panel táctil de la laptop
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            return; 
        }

        // Si es la rueda del mouse, detenemos el bajón de página
        e.preventDefault(); 
        
        // Multiplicamos por 0.5 para reducir la velocidad a la mitad. 
        // Si lo quieres AÚN más lento, pon 0.3 o 0.4.
        carruselPrincipal.scrollLeft += (e.deltaY * 0.4); 
    }, { passive: false });
}

