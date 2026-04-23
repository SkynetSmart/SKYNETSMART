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

// FUNCIÓN PARA CAMBIAR IMAGEN (Corregida para que coincida con tus tarjetas)
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
    
    // --- 1. EL SEMÁFORO: Elegimos la caja correcta según la categoría ---
    let contenedor;
    if (categoria === "suministros") {
        contenedor = document.getElementById('galeriaSuministros');
    } else if (categoria === "celulares") {
        contenedor = document.getElementById('galeriaCelulares');
    } else if (categoria === "accesorios") {
        contenedor = document.getElementById('galeriaAccesorios');
    } else if (categoria === "impresoras") {
        contenedor = document.getElementById('galeriaImpresoras');
    } else if (categoria === "software") {
        contenedor = document.getElementById('galeriaVarios'); 
    } else if (categoria === "proteccion") {
        contenedor = document.getElementById('galeriaProteccion');
    } else if (categoria === "varios") {
        contenedor = document.getElementById('galeriaVarios'); 
    } else if (categoria === "redes") {
        contenedor = document.getElementById('galeriaRedes'); 
    } else if (categoria === "redes") {
        contenedor = document.getElementById('galeriaServicios'); 
    } else if (categoria === "perifericos") {
        contenedor = document.getElementById('galeriaPerifericos'); 
    } else if (categoria === "componentes") {
        contenedor = document.getElementById('galeriaComponentes'); // <-- LA ÚLTIMA RUTA
    }

    if (!contenedor) return; // Si no encuentra la caja, se detiene para no dar error

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

       // --- 3. MOTOR DE ORDENAMIENTO MULTI-CATEGORÍA ---

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
            
            // 🛑 1. REGLAS PARA COMPONENTES (Orden de armado de PC)
            if (categoria === "componentes") {
                const ordenComponentes = {
                    "mainboard": 1,
                    "almacenamiento": 2, // Discos Duros
                    "procesador": 3,
                    "tarjetavideo": 4,
                    "ram": 5,
                    "case": 6,
                    "fuente": 7,
                    "refrigeracion": 8 // Ventiladores y coolers
                };
                
                const prioA = ordenComponentes[a.subcategoria] || 99;
                const prioB = ordenComponentes[b.subcategoria] || 99;

                if (prioA !== prioB) {
                    return prioA - prioB; 
                }
                return a.titulo.localeCompare(b.titulo); 
            }

            // 🛑 2. REGLAS PARA PERIFÉRICOS (Orden de tus botones)
            else if (categoria === "perifericos") {
                const ordenPerifericos = {
                    "monitores": 1,
                    "teclados": 2,
                    "mouses": 3,
                    "camaras": 4,
                    "audio-domotica": 5, // Audio y Alexa
                    "almacenamiento-extra": 6, // Memorias y SD
                    "accesorios-varios": 7 // Micrófonos y Laser
                };
                
                const prioA = ordenPerifericos[a.subcategoria] || 99;
                const prioB = ordenPerifericos[b.subcategoria] || 99;

                if (prioA !== prioB) {
                    return prioA - prioB; 
                }
                return a.titulo.localeCompare(b.titulo); 
            }

            // 🛑 3. REGLAS PARA SUMINISTROS (La lógica original de las tintas)
            else if (categoria === "suministros") {
                const prioFamiliaA = obtenerPrioridadFamilia(a.titulo);
                const prioFamiliaB = obtenerPrioridadFamilia(b.titulo);

                if (prioFamiliaA !== prioFamiliaB) {
                    return prioFamiliaA - prioFamiliaB; 
                }
                return obtenerPrioridadColor(a.titulo) - obtenerPrioridadColor(b.titulo);
            }

            // 🛑 4. REGLA POR DEFECTO PARA EL RESTO (Celulares, Redes, Accesorios...)
            else {
                return a.titulo.localeCompare(b.titulo); // Orden alfabético
            }
        });
        // ---------------------------------------------------

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

// PROTECTOR DE CARGA: Espera a que el HTML exista antes de buscar los botones
document.addEventListener('DOMContentLoaded', () => {
    
    // Carga inicial
    cargarProductos("suministros", "todo");
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
    // Configuración de botones (con verificación para que no den error null)
    const botones = {
        'btnSubTodo': "todo",
        'btnSubTinta': "Tinta",
        'btnSubLaser': "Laser",
        'btnSubTermico': "Termico",
        'btnSubMatricial': "Matricial"
    };

    // --- CONFIGURACIÓN DE BOTONES PARA PERIFÉRICOS ---
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

    


    Object.keys(botones).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', () => {
                cargarProductos("suministros", botones[id]);
                
            });
        }
    });

    Object.keys(botonesComponentes).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', function() {
                cargarProductos("componentes", botonesComponentes[id]);
                // Reutilizamos la función de iluminar botones (asegúrate de que los botones tengan la clase que la función busca, o ajusta la función para que busque '.btn-pildora')
                
                // Pequeño truco para que ilumine las píldoras:
                const botones = document.querySelectorAll('.btn-pildora');
                botones.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
            });
        }
    });

   

    

    Object.keys(botonesPerifericos).forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.addEventListener('click', function() {
                // Le pide a Firebase que filtre por "perifericos" y por la subcategoría específica
                cargarProductos("perifericos", botonesPerifericos[id]);
                activarBotonMenu(this); // Prende el botón de verde
            });
        }
    });

    
    // EJEMPLO DE CÓMO CONECTAR LOS BOTONES DE TU MENÚ

// Carga inicial
cargarProductos("suministros", "todo");

// Botón VER TODO
document.getElementById('btnSubTodo').addEventListener('click', function() {
    cargarProductos("suministros", "todo");
    activarBotonMenu(this); // 'this' significa "este botón que acabo de presionar"
});

// Botón TINTA
document.getElementById('btnSubTinta').addEventListener('click', function() {
    cargarProductos("suministros", "Tinta"); 
    activarBotonMenu(this);
});

// Botón LASER
document.getElementById('btnSubLaser').addEventListener('click', function() {
    cargarProductos("suministros", "Laser");
    activarBotonMenu(this);
});

// Botón TÉRMICO
document.getElementById('btnSubTermico').addEventListener('click', function() {
    cargarProductos("suministros", "Termico");
    activarBotonMenu(this);
});

// Botón MATRICIAL
document.getElementById('btnSubMatricial').addEventListener('click', function() {
    cargarProductos("suministros", "Matricial");
    activarBotonMenu(this);
});
});
// --- SISTEMA DE BOTONES ACTIVOS ---

function activarBotonMenu(botonSeleccionado) {
    // 1. Buscamos TODOS los botones que tengan la clase 'btn-suministro'
    const botones = document.querySelectorAll('.btn-suministro');
    
    // 2. Apagamos todos (les quitamos la clase 'activo')
    botones.forEach(boton => {
        boton.classList.remove('activo');
    });
    
    // 3. Encendemos SOLO el que el usuario presionó
    botonSeleccionado.classList.add('activo');
}

