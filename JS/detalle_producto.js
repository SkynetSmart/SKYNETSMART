    // 1. IMPORTAMOS LAS HERRAMIENTAS DE FIREBASE DIRECTO DE GOOGLE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. TUS CREDENCIALES (Ve a tu archivo catalogo.js o admin.html, copia tu firebaseConfig real y pégalo aquí)
const firebaseConfig = {
    apiKey: "AIzaSyDawRJ_UEd60LCwxD3Lk-eZsmMffpjWXlg",
  authDomain: "skynetsmart-a9521.firebaseapp.com",
  projectId: "skynetsmart-a9521",
  storageBucket: "skynetsmart-a9521.firebasestorage.app",
  messagingSenderId: "601143108776",
  appId: "1:601143108776:web:de56547394c4293e8e0e9d",
  measurementId: "G-WRF55Q2CB5"         
};

// 3. INICIALIZAMOS TU BASE DE DATOS (AQUÍ ES DONDE NACE LA VARIABLE 'db')
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// A partir de aquí, va el código que ya teníamos
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProducto = parametrosURL.get("id");

    if (!idProducto) {
        document.getElementById("prod-titulo").textContent = "Producto no encontrado.";
        return;
    }

        // 2. BUSCAR EN FIREBASE (Asumiendo que buscas por el campo codigo_caos o codigoInterno)
    try {
        const productosRef = collection(db, "productos");
        let datosProducto = null;
        
        // PLAN A: Buscamos como codigo_caos (Productos de CAOS)
        let q = query(productosRef, where("codigo_caos", "==", idProducto));
        let snapshot = await getDocs(q);
        if (!snapshot.empty) {
            datosProducto = snapshot.docs[0].data();
        }

        // PLAN B: Buscamos como codigoInterno en formato TEXTO
        if (!datosProducto) {
            q = query(productosRef, where("codigoInterno", "==", idProducto));
            snapshot = await getDocs(q);
            if (!snapshot.empty) datosProducto = snapshot.docs[0].data();
        }

        // PLAN C: Buscamos como codigoInterno en formato NÚMERO (Por si se guardó sin comillas)
        if (!datosProducto && !isNaN(idProducto)) {
            q = query(productosRef, where("codigoInterno", "==", Number(idProducto)));
            snapshot = await getDocs(q);
            if (!snapshot.empty) datosProducto = snapshot.docs[0].data();
        }

        // PLAN D: El último recurso. Si no tenía códigos, buscamos directamente por el ID de documento de Firebase
        if (!datosProducto) {
            const docRef = doc(db, "productos", idProducto);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) datosProducto = docSnap.data();
        }

        // Si después de los 4 planes no hay nada, bloqueamos
        if (!datosProducto) {
            document.getElementById("prod-titulo").textContent = "El producto no existe o está agotado.";
            return;
        }

       // 3. PINTAR LOS DATOS EN LA PÁGINA (Y apagar el Skeleton)
        
        // Retiramos las clases de animación
        document.getElementById("prod-titulo").classList.remove("skeleton", "skel-titulo");
        document.getElementById("prod-codigo").classList.remove("skeleton", "skel-codigo");
        document.getElementById("prod-precio").classList.remove("skeleton", "skel-precio");
        document.getElementById("prod-descripcion").classList.remove("skeleton", "skel-texto");
        document.getElementById("caja-img-skeleton").classList.remove("skeleton", "skel-img");

        // Inyectamos los textos reales
        document.getElementById("prod-titulo").textContent = datosProducto.titulo || "Producto sin título";
        document.getElementById("prod-codigo").textContent = idProducto;
        
        const precioFormateado = datosProducto.precio ? Number(datosProducto.precio).toFixed(2) : "0.00";
        document.getElementById("prod-precio").textContent = `$${precioFormateado}`;
        
        document.getElementById("prod-descripcion").textContent = datosProducto.descripcion || "Sin descripción disponible.";

        // Hacemos que la imagen real se vuelva visible
        const imagenPrincipal = document.getElementById("prod-imagen");
        imagenPrincipal.style.opacity = "1"; 
        
        // --- MOTOR GRÁFICO DE IMÁGENES E INTERACTIVIDAD ---
        const contenedorMiniaturas = document.getElementById("contenedor-miniaturas");

        if (datosProducto.imagen) {
            imagenPrincipal.src = datosProducto.imagen;
            
            // ¿Existe una segunda imagen en la base de datos?
            if (datosProducto.imagen2) {
                // Limpiamos por si acaso
                contenedorMiniaturas.innerHTML = '';

                // Creamos una lista con las dos fotos
                const listaImagenes = [datosProducto.imagen, datosProducto.imagen2];

                listaImagenes.forEach((url, index) => {
                    const imgMini = document.createElement("img");
                    imgMini.src = url;
                    imgMini.classList.add("miniatura");
                    
                    // A la primera miniatura le ponemos el borde verde por defecto
                    if (index === 0) imgMini.classList.add("activa"); 

                    // VERSIÓN A PRUEBA DE BALAS PARA EL CLIC
                    imgMini.addEventListener("click", function() {
                        // Cambiamos la imagen grande usando directamente el origen (src) de la miniatura que tocaste
                        document.getElementById("prod-imagen").src = this.src;


                        // Le quitamos el borde verde a todas las miniaturas...
                        document.querySelectorAll(".miniatura").forEach(m => m.classList.remove("activa"));
                        // ...y se lo ponemos solo a la que tocamos
                        imgMini.classList.add("activa");
                    });

                    contenedorMiniaturas.appendChild(imgMini);
                });
            } else {
                // Si no hay imagen2, ocultamos el contenedor para que no estorbe
                contenedorMiniaturas.style.display = "none";
            }
        } else {
            imagenPrincipal.alt = "Imagen no disponible";
            contenedorMiniaturas.style.display = "none";
        }

        // 4. PROGRAMAR EL BOTÓN DE WHATSAPP (Ajustado a tus variables)
        document.getElementById("btn-comprar-whatsapp").addEventListener("click", () => {
            const numeroSkynet = "593988024097"; // Tu número real
            const urlPaginaActual = window.location.href; // Captura el link que el cliente está viendo
            
            const mensaje = `Hola Skynet Smart, estoy interesado en comprar este producto:\n\n*${datosProducto.titulo}*\nCódigo: ${idProducto}\nPrecio: $${precioFormateado}\n\nLo vi aquí: ${urlPaginaActual}`;
            
            const enlaceWhatsapp = `https://wa.me/${numeroSkynet}?text=${encodeURIComponent(mensaje)}`;
            window.open(enlaceWhatsapp, '_blank');
        });

    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        document.getElementById("prod-titulo").textContent = "Error de conexión.";
    }

    // --- LÓGICA DEL LIGHTBOX (IMAGEN EXPANDIDA) ---
        const modal = document.getElementById("modal-imagen");
        const imgExpandida = document.getElementById("img-expandida");
        const btnCerrarModal = document.getElementById("btn-cerrar-modal");
        
        // CORRECCIÓN: Volvemos a llamar a la imagen por su ID para que no importe dónde pongas este código
        const fotoClickeable = document.getElementById("prod-imagen"); 

        // 1. Al hacer clic en la foto principal, se abre el modal
        fotoClickeable.addEventListener("click", () => {
            modal.style.display = "block";
            // Le pasamos la imagen exacta que se esté viendo en ese momento
            imgExpandida.src = fotoClickeable.src; 
        });

        // 2. Al hacer clic en la "X", se cierra
        btnCerrarModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // 3. Si hace clic en la parte negra (fuera de la foto), también se cierra
        window.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                modal.style.display = "none";
            }
        });

});