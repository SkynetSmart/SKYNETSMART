
  //Script para cambio de imagen
    function cambiarImagen(idOcultar, idMostrar) {
      document.getElementById(idOcultar).style.display = "none";
      document.getElementById(idMostrar).style.display = "block";
    }

  // Script para la seccion oculta
  
    /*function mostrarSeccion(id) {
      // Ocultar todas las secciones
      const secciones = document.querySelectorAll('.seccion-oculta, .seccion-visible');
      secciones.forEach(seccion => seccion.classList.remove('seccion-visible'));

      // Mostrar la seleccionada
      const activa = document.getElementById(id);
      if (activa) {
        activa.classList.add('seccion-visible');
      }
    }*/
  
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
    // MAGIA: El JS lee automáticamente el ancho real de la caja en píxeles
    // No importa qué tamaño le pongas en el CSS, el JS lo sabrá.
    const anchoExacto = carrusel.children[0].clientWidth; 

    carrusel.style.transition = conAnimacion ? "transform 0.8s ease" : "none";
    carrusel.style.transform = `translateX(-${index * anchoExacto}px)`; 
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

// ==========================================
// LÓGICA BÁSICA DEL CHATBOT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirChat = document.getElementById('btn-abrir-chat');
    const btnCerrarChat = document.getElementById('btn-cerrar-chat');
    const ventanaChat = document.getElementById('skynet-chatbot');

    if(btnAbrirChat && btnCerrarChat && ventanaChat) {
        // Abrir chat
btnAbrirChat.addEventListener('click', () => {
    ventanaChat.style.display = 'flex';
    btnAbrirChat.style.display = 'none'; // Oculta el botón redondo

    // // Ocultar el menú de navegación (El carrusel)
    // const menuNavegacion = document.querySelector('.carrusel'); 
    // if (menuNavegacion) {
    //     menuNavegacion.style.display = 'none'; 
    // }
});

// Cerrar chat
btnCerrarChat.addEventListener('click', () => {
    ventanaChat.style.display = 'none';
    btnAbrirChat.style.display = 'block'; // Muestra el botón redondo

    // // Volver a mostrar el menú cuando se cierra el chat
    // const menuNavegacion = document.querySelector('.carrusel');
    // if (menuNavegacion) {
    //     menuNavegacion.style.display = 'flex'; // Tu menú usa flexbox
    // }
});
    }
});

// Función "fantasma" por ahora para que no de error al dar clic en las opciones
// ==========================================
// LÓGICA DEL MENÚ PRINCIPAL DEL CHATBOT
// ==========================================

function procesarOpcion(opcion) {
    const areaMensajes = document.getElementById('chatbot-mensajes');
    const areaOpciones = document.getElementById('chatbot-opciones');

    // Opción 1: Catálogo
    if (opcion === 'catalogo') {
        areaMensajes.innerHTML += `
            <div class="mensaje-bot">
                <p>¡Perfecto! Puedes usar nuestra barra de búsqueda o hacer clic en los logos de las marcas arriba para filtrar los equipos y componentes que tenemos en stock.</p>
            </div>
        `;
    } 
    // Opción 2: Servicios (Usa tu propia función mostrarSeccion)
    else if (opcion === 'servicios') {
        areaMensajes.innerHTML += `
            <div class="mensaje-bot">
                <p>Contamos con 4 áreas de especialidad técnica. Te he llevado a nuestra sección de servicios. ¡Haz clic en el banner del servicio que necesites para detallar tu problema!</p>
            </div>
        `;
        
        // 1. Usamos tu función nativa para limpiar todo y mostrar solo los Servicios
        if (typeof mostrarSeccion === 'function') {
            mostrarSeccion('Servicios');
        } else {
            // Por si acaso la función falla, forzamos la aparición
            document.getElementById('Servicios').classList.remove('seccion-oculta');
            document.getElementById('Servicios').style.display = 'block';
        }

        // 2. Hacemos el scroll hacia los banners
        setTimeout(() => {
            const seccionServicios = document.getElementById('Servicios');
            if(seccionServicios) {
                seccionServicios.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }
    // Opción 3: Información (Filtro automático de preguntas repetitivas)
    else if (opcion === 'info') {
        areaMensajes.innerHTML += `
            <div class="mensaje-bot">
                <p>📍 <strong>Ubicación:</strong> Manuel Vega 7-32, Cuenca.<br>
                📦 <strong>Envíos:</strong> A nivel nacional por Servientrega.<br>
                💳 <strong>Pagos:</strong> Efectivo, transferencias y tarjetas de crédito.</p>
            </div>
        `;
    } 
    // Opción 4: Hablar con asesor (Ruta de escape general)
    else if (opcion === 'asesor') {
        areaMensajes.innerHTML += `
            <div class="mensaje-bot">
                <p>Te comunicaré con nuestro equipo. Por favor, escribe tu consulta abajo para que el asesor pueda ayudarte más rápido:</p>
            </div>
        `;
        // Cambiamos los botones por la caja de texto para WhatsApp
        areaOpciones.innerHTML = `
            <textarea id="input-general" placeholder="Escribe tu consulta aquí..." style="width: 100%; height: 60px; padding: 10px; border-radius: 5px; border: 1px solid #ccc; resize: none; font-family: inherit; margin-bottom: 10px;"></textarea>
            <button class="btn-opcion-chat" style="background-color: #00cc66; color: white; text-align: center; font-weight: bold;" onclick="enviarWhatsAppGeneral()">
                Ir a WhatsApp
            </button>
            <button class="btn-opcion-chat" style="text-align: center; border-color: #ccc; color: #666;" onclick="volverAlMenuPrincipal()">
                ← Volver al inicio
            </button>
        `;
    }

    // Asegurarnos de que el scroll del chat baje automáticamente para leer el nuevo mensaje
    areaMensajes.scrollTop = areaMensajes.scrollHeight;
}

// Función exclusiva para el botón "Hablar con un asesor"
function enviarWhatsAppGeneral() {
    const inputGeneral = document.getElementById('input-general').value;
    
    if (inputGeneral.trim() === "") {
        alert("Por favor, escribe un breve mensaje antes de ir a WhatsApp.");
        return;
    }

    const numeroWhatsApp = "593988024097"; // Tu número de Skynet Smart
    const mensajeFinal = `Hola Skynet Smart, tengo una consulta:\n\n"${inputGeneral}"`;
    
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeFinal)}`;
    window.open(urlWhatsApp, '_blank');

    volverAlMenuPrincipal();
}

// ==========================================
// LÓGICA AVANZADA DEL CHATBOT Y SERVICIOS
// ==========================================

// Número de WhatsApp de Skynet Smart (Incluir código de país, ej: 593 para Ecuador)
const numeroWhatsApp = "593988024097"; // Asegúrate de que este sea el correcto para Skynet Smart

// Respuestas y flujos predefinidos según el servicio
const flujosServicio = {
    mantenimiento: {
        titulo: "🛠️ Mantenimiento y Reparación",
        mensajeBot: "¡Hola! Para ayudarte con el mantenimiento o reparación, cuéntanos: ¿Qué equipo tienes (marca/modelo) y cuál es el problema principal?",
        textoWhatsApp: "Hola Skynet Smart, necesito ayuda con el Mantenimiento/Reparación de mi equipo. Te detallo el problema:"
    },
    upgrades: {
        titulo: "🚀 Repotenciación de Equipos",
        mensajeBot: "¡Excelente decisión! Para cotizar el upgrade adecuado, dinos: ¿Qué computadora tienes y qué buscas mejorar (más velocidad, espacio, etc.)?",
        textoWhatsApp: "Hola Skynet Smart, me interesa repotenciar mi equipo. Esta es la información:"
    },
    redes: {
        titulo: "📹 Cámaras y Redes",
        mensajeBot: "¡Perfecto! Para proyectos de seguridad o redes necesitamos algunos detalles. ¿Es para hogar o empresa? Cuéntanos un poco de lo que necesitas.",
        textoWhatsApp: "Hola Skynet Smart, requiero cotizar un proyecto de Cámaras/Redes. Te cuento los detalles:"
    },
    empresas: {
        titulo: "🏢 Asesoría Corporativa",
        mensajeBot: "¡Un gusto saludarte! Para darte la mejor asesoría IT, por favor indícanos el nombre de tu empresa y el requerimiento principal.",
        textoWhatsApp: "Hola Skynet Smart, me contacto por sus servicios de Asesoría Corporativa. El requerimiento es el siguiente:"
    }
};

// Variable para saber en qué parte de la conversación estamos
let flujoActual = null;

function abrirChatServicio(tipoServicio) {
    const ventanaChat = document.getElementById('skynet-chatbot');
    const btnAbrirChat = document.getElementById('btn-abrir-chat');
    const areaMensajes = document.getElementById('chatbot-mensajes');
    const areaOpciones = document.getElementById('chatbot-opciones');

    // 1. Abrir la ventana
    ventanaChat.style.display = 'flex';
    btnAbrirChat.style.display = 'none';

    // 2. Obtener la información del flujo seleccionado
    const flujo = flujosServicio[tipoServicio];
    flujoActual = tipoServicio; 

    // 3. Limpiar mensajes anteriores y mostrar el nuevo mensaje del bot
    areaMensajes.innerHTML = `
        <div class="mensaje-bot">
            <p>${flujo.mensajeBot}</p>
        </div>
    `;

    // 4. Cambiar las opciones para que el cliente pueda escribir y enviar
    areaOpciones.innerHTML = `
        <textarea id="input-problema" placeholder="Escribe aquí los detalles (marca, modelo, problema)..." style="width: 100%; height: 60px; padding: 10px; border-radius: 5px; border: 1px solid #ccc; resize: none; font-family: inherit; margin-bottom: 10px;"></textarea>
        <button class="btn-opcion-chat" style="background-color: #00cc66; color: white; text-align: center; font-weight: bold;" onclick="enviarWhatsAppServicio()">
            Enviar a WhatsApp
        </button>
        <button class="btn-opcion-chat" style="text-align: center; border-color: #ccc; color: #666;" onclick="volverAlMenuPrincipal()">
            ← Volver al inicio
        </button>
    `;
    
    // Auto-scroll hacia abajo
    areaMensajes.scrollTop = areaMensajes.scrollHeight;
}

function enviarWhatsAppServicio() {
    const inputProblema = document.getElementById('input-problema').value;
    
    if (inputProblema.trim() === "") {
        alert("Por favor, escribe un pequeño detalle de tu requerimiento antes de continuar.");
        return;
    }

    const flujo = flujosServicio[flujoActual];
    
    // Construir el mensaje final combinando la plantilla y lo que escribió el cliente
    const mensajeFinal = `${flujo.textoWhatsApp}\n\n"${inputProblema}"`;
    
    // Codificar la URL y abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeFinal)}`;
    window.open(urlWhatsApp, '_blank');

    // Opcional: Volver al menú principal después de enviar
    volverAlMenuPrincipal();
}

// Función para restaurar los 4 botones principales si el usuario se arrepiente
function volverAlMenuPrincipal() {
    const areaMensajes = document.getElementById('chatbot-mensajes');
    const areaOpciones = document.getElementById('chatbot-opciones');
    flujoActual = null;

    areaMensajes.innerHTML = `
        <div class="mensaje-bot">
            <p>¡Hola! Soy el asistente virtual de Skynet Smart. ¿En qué te puedo ayudar hoy?</p>
        </div>
    `;

    areaOpciones.innerHTML = `
        <button class="btn-opcion-chat" onclick="procesarOpcion('catalogo')">💻 Busco equipos o partes</button>
        <button class="btn-opcion-chat" onclick="procesarOpcion('servicios')">🛠️ Soporte o servicios</button>
        <button class="btn-opcion-chat" onclick="procesarOpcion('info')">📍 Ubicación y envíos</button>
        <button class="btn-opcion-chat" onclick="procesarOpcion('asesor')">💬 Hablar con un asesor</button>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const reproductor = document.getElementById('reproductor-promo');
    
    // Aquí pones las rutas exactas de tus dos (o más) videos
    const listaVideos = [
        "IMAGENES/imagenes publicidad/tecladomsi.mp4",
        "IMAGENES/imagenes publicidad/hpvideo.mp4",
        "IMAGENES/imagenes publicidad/publicidadvideolaptopopen.mp4",
        "IMAGENES/imagenes publicidad/publicidadvideocelulares.mp4",
        
        
    ];
    
    let indiceActual = 0;

    // Escuchamos cuando el video actual termina
    reproductor.addEventListener('ended', () => {
        indiceActual++; // Pasamos al siguiente
        
        // Si ya llegamos al final de la lista, volvemos al inicio (Loop general)
        if (indiceActual >= listaVideos.length) {
            indiceActual = 0; 
        }
        
        // Cambiamos el origen del video y lo reproducimos
        reproductor.src = listaVideos[indiceActual];
        reproductor.play();
    });
});