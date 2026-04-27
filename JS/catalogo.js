import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDawRJ_UEd60LCwxD3Lk-eZsmMffpjWXlg",
  authDomain: "skynetsmart-a9521.firebaseapp.com",
  projectId: "skynetsmart-a9521",
  storageBucket: "skynetsmart-a9521.firebasestorage.app",
  messagingSenderId: "601143108776",
  appId: "1:601143108776:web:de56547394c4293e8e0e9d",
  measurementId: "G-WRF55Q2CB5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FUNCIÓN PARA CAMBIAR IMAGEN
window.alternarFotos = function(id) {
    const img1 = document.getElementById(`img1_${id}`);
    const img2 = document.getElementById(`img2_${id}`);
    
    if (img1 && img2) {
        if (img1.style.display !== 'none') {
            img1.style.display = 'none';
            img2.style.display = 'block';
        } else {
            img1.style.display = 'block';
            img2.style.display = 'none';
        }
    }
}

async function cargarProductos(categoria, subcategoria = "todo") {
    
    // --- 1. EL SEMÁFORO CORREGIDO ---
    let contenedor;

    if (categoria === "suministros") {
        contenedor = document.getElementById('galeriaSuministros');
    } else if (categoria === "computadoras") {
        contenedor = document.getElementById('galeriacomputadoras');
    } else if (categoria === "celulares") {
        contenedor = document.getElementById('galeriaCelulares');
    } else if (categoria === "accesorios") {
        contenedor = document.getElementById('galeriaAccesorios');
    } else if (categoria === "impresoras") {
        contenedor = document.getElementById('galeriaImpresoras');
    } else if (categoria === "software") {
        contenedor = document.getElementById('galeriaSoftware'); 
    } else if (categoria === "proteccion") {
        contenedor = document.getElementById('galeriaProteccion');
    } else if (categoria === "varios") {
        contenedor = document.getElementById('galeriaVarios'); 
    } else if (categoria === "redes") {
        contenedor = document.getElementById('galeriaRedes'); 
    } else if (categoria === "servicios") { // <-- ¡CORREGIDO EL ERROR DE TIPO AQUÍ!
        contenedor = document.getElementById('galeriaServicios'); 
    } else if (categoria === "perifericos") {
        contenedor = document.getElementById('galeriaPerifericos'); 
    } else if (categoria === "componentes") {
        contenedor = document.getElementById('galeriaComponentes'); 
    }

    if (!contenedor) return; 

    contenedor.innerHTML = "<p> </p>"; 

    try {
        const productosRef = collection(db, "productos");
        let consulta;

        // --- 2. FILTRAMOS EN FIREBASE ---
        if (subcategoria === "todo") {
            consulta = query(productosRef, where("categoria", "==", categoria));
        } else {
            consulta = query(productosRef, 
                where("categoria", "==", categoria), 
                where("subcategoria", "==", subcategoria)
            );
        }

        const querySnapshot = await getDocs(consulta);
        
        let listaProductos = [];
        querySnapshot.forEach((doc) => {
            listaProductos.push({ id: doc.id, ...doc.data() });
        });

       // --- 3. MOTOR DE ORDENAMIENTO ---
        function obtenerPrioridadFamilia(titulo) {
            const t = titulo.toLowerCase();
            if (t.includes("544")) return 10;
            if (t.includes("504")) return 20;
            if (t.includes("664")) return 30;
            if (t.includes("t748xxl")) return 40;
            if (t.includes("canon")) return 50;
            if (t.includes("almohadilla") || t.includes("mantenimiento")) return 60;
            if (t.includes("bond") || t.includes("resma")) return 70;
            if (t.includes("toner")) return 80;
            if (t.includes("ribbon")) return 90;
            if (t.includes("térmico") || t.includes("termico")) return 100;
            if (t.includes("etiqueta")) return 110;
            if (t.includes("químico") || t.includes("quimico")) return 120;
            if (t.includes("cinta")) return 130;
            return 999; 
        }

        function obtenerPrioridadColor(titulo) {
            const t = titulo.toLowerCase();
            if (t.includes("negro")) return 1;
            if (t.includes("cyan")) return 2;
            if (t.includes("magenta")) return 3;
            if (t.includes("amarillo")) return 4;
            return 5; 
        }

        listaProductos.sort((a, b) => {
            if (categoria === "componentes") {
                const ordenComponentes = { "mainboard": 1, "almacenamiento": 2, "procesador": 3, "tarjetavideo": 4, "ram": 5, "case": 6, "fuente": 7, "refrigeracion": 8 };
                const prioA = ordenComponentes[a.subcategoria] || 99;
                const prioB = ordenComponentes[b.subcategoria] || 99;
                if (prioA !== prioB) return prioA - prioB; 
                return a.titulo.localeCompare(b.titulo); 
            }
            else if (categoria === "perifericos") {
                const ordenPerifericos = { "monitores": 1, "teclados": 2, "mouses": 3, "camaras": 4, "audio-domotica": 5, "almacenamiento-extra": 6, "accesorios-varios": 7 };
                const prioA = ordenPerifericos[a.subcategoria] || 99;
                const prioB = ordenPerifericos[b.subcategoria] || 99;
                if (prioA !== prioB) return prioA - prioB; 
                return a.titulo.localeCompare(b.titulo); 
            }
            else if (categoria === "suministros") {
                const prioFamiliaA = obtenerPrioridadFamilia(a.titulo);
                const prioFamiliaB = obtenerPrioridadFamilia(b.titulo);
                if (prioFamiliaA !== prioFamiliaB) return prioFamiliaA - prioFamiliaB; 
                return obtenerPrioridadColor(a.titulo) - obtenerPrioridadColor(b.titulo);
            }
            else {
                return a.titulo.localeCompare(b.titulo); 
            }
        });

        contenedor.innerHTML = ""; 

        if (listaProductos.length === 0) {
            contenedor.innerHTML = `<h3>No hay productos en ${subcategoria}.</h3>`;
            return;
        }

        // --- 4. DIBUJAMOS LAS TARJETAS ---
        listaProductos.forEach((producto) => {
            const id = producto.id;
            const claseAgotado = producto.agotado ? 'agotado' : '';

            const tarjeta = `
                <div class="tarjeta item-suministro ${claseAgotado}">
                    <div class="contenedor-imagen-standard" onclick="alternarFotos('${id}')" style="cursor:pointer;">
                        <img id="img1_${id}" src="${producto.imagen}">
                        <img id="img2_${id}" src="${producto.imagen2 || producto.imagen}" style="display:none;">
                    </div>
                    <h3 class="titulocompu1">${producto.titulo}</h3>
                    <details> 
                        <summary>Más información</summary>
                        <p>${producto.descripcion}</p>
                        <br>
                        <h1>PRECIO: $${producto.precio}</h1>
                    </details>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// PROTECTOR DE CARGA
document.addEventListener('DOMContentLoaded', () => {
    
    // Carga inicial
    cargarProductos("suministros", "todo");
    cargarProductos("computadoras", "todo");
    cargarProductos("celulares", "todo");
    cargarProductos("accesorios", "todo"); 
    cargarProductos("impresoras", "todo"); 
    cargarProductos("proteccion", "todo");
    cargarProductos("software", "todo");
    cargarProductos("varios", "todo"); 
    cargarProductos("servicios", "todo");
    cargarProductos("redes", "todo"); 
    cargarProductos("perifericos", "todo");
    cargarProductos("componentes", "todo");

    const botones = {
        'btnSubTodo': "todo",
        'btnSubTinta': "Tinta",
        'btnSubLaser': "Laser",
        'btnSubTermico': "Termico",
        'btnSubMatricial': "Matricial"
    };

   const botonesPerifericos = {
        'btnPeriTodo': "todo",
        'btnPeriMonitores': "monitores",
        'btnPeriTeclados': "teclados",
        'btnPeriMouses': "mouses",
        'btnPeriCamaras': "camaras",
        'btnPeriAudio': "audio-domotica",
        'btnPeriMemorias': "almacenamiento-extra",
        'btnPeriVarios': "accesorios-varios"
    };

    const botonesComponentes = {
        'btnCompTodo': "todo",
        'btnCompMainboard': "mainboard",
        'btnCompAlmacenamiento': "almacenamiento",
        'btnCompProcesador': "procesador",
        'btnCompTarjetaVideo': "tarjetavideo",
        'btnCompRam': "ram",
        'btnCompCase': "case",
        'btnCompFuente': "fuente",
        'btnCompRefrigeracion': "refrigeracion"
    };

    // ACTIVADORES DE BOTONES SEGUROS
    Object.keys(botones).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', () => {
                cargarProductos("suministros", botones[id]);
                activarBotonMenu(boton);
            });
        }
    });

    Object.keys(botonesComponentes).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', function() {
                cargarProductos("componentes", botonesComponentes[id]);
                const botonesPildora = document.querySelectorAll('.btn-pildora');
                botonesPildora.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
            });
        }
    });

    Object.keys(botonesPerifericos).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', function() {
                cargarProductos("perifericos", botonesPerifericos[id]);
                activarBotonMenu(this); 
            });
        }
    });

    // NOTA: Borramos las llamadas manuales repetidas que causaban el error de la pantalla blanca.
});

// --- SISTEMA DE BOTONES ACTIVOS ---
function activarBotonMenu(botonSeleccionado) {
    const botones = document.querySelectorAll('.btn-suministro');
    botones.forEach(boton => {
        boton.classList.remove('activo');
    });
    botonSeleccionado.classList.add('activo');
}

// =================================================================
// 🚀 SOLUCIÓN BÚSQUEDA POR MARCAS EN BARRA PRINCIPAL
// =================================================================
window.filtrarPorMarca = function(marca) {
    const buscador = document.getElementById('buscar'); // Tu barra de búsqueda
    const pantallaInicio = document.getElementById('pantallaInicio'); // El contenedor de publicidad
    
    if (buscador) {
        // 1. Escribimos la marca en el buscador automáticamente
        buscador.value = marca;
        
        // 2. Ocultamos el fondo (publicidad y marcas) para no estorbar
        if(pantallaInicio) {
            pantallaInicio.style.display = 'none';
        }
        
        // 3. Simulamos que el usuario escribió para activar 1practica.js
        buscador.dispatchEvent(new Event('input', { bubbles: true }));
        buscador.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        // 4. Subimos la pantalla para ver los resultados
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// =================================================================
// PARCHE AUTOMÁTICO: CONTROL DE LA PANTALLA DE INICIO
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
    const pantallaInicio = document.getElementById('pantallaInicio');
    const barraBusqueda = document.getElementById('buscar'); 
    const enlacesMenu = document.querySelectorAll('.enlace'); 
    const logoInicio = document.querySelector('.imagen-esquina'); 
    
    if(!pantallaInicio) return;

    // 1. Si escriben en el buscador, ocultamos el inicio para que no estorbe abajo
    if(barraBusqueda) {
        barraBusqueda.addEventListener('input', (e) => {
            if(e.target.value.trim() !== "") {
                pantallaInicio.style.display = 'none';
            } else {
                // Si borran todo el texto del buscador, vuelve a aparecer el inicio
                pantallaInicio.style.display = 'block';
            }
        });
    }

    // 2. Si tocan cualquier categoría del menú de arriba (Computadoras, etc), ocultamos el inicio
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', () => {
            pantallaInicio.style.display = 'none';
        });
    });

    // 3. Si tocan el logo de Skynet para volver al Home, mostramos el inicio de nuevo
    if(logoInicio) {
        logoInicio.addEventListener('click', () => {
            pantallaInicio.style.display = 'block';
            if(barraBusqueda) barraBusqueda.value = ""; // Limpiamos la barra de búsqueda
        });
    }
});