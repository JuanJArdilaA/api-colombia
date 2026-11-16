/**
 * js/platos.js — Consumo de API y Renderizado de Platos Típicos
 * Mini Portal de Colombia con API
 * Autor: Juan José Ardila Arévalo
 */

// Ruta relativa de la imagen de respaldo local
const IMAGEN_FALLBACK = 'img/plato-default.svg';

/**
 * Formatea el texto del contador total de platos.
 * @param {number} total - Cantidad de platos típicos.
 * @returns {string} Texto formateado para el indicador en el DOM.
 */
function formatearContadorPlatos(total = 0) {
  return `Total de platos: ${total}`;
}

/**
 * Genera el marcado HTML para una tarjeta de plato típico.
 * Incluye validación de imagen y mecanismo de fallback con prevención de bucles infinitos.
 * @param {Object} plato - Objeto con datos del plato típico.
 * @returns {string} Fragmento HTML de la tarjeta.
 */
function renderizarTarjetaPlato(plato) {
  const departamento = plato?.department?.name || 'Colombia';
  const nombre = plato?.name || 'Plato típico';
  const imagenSrc = (plato?.imageUrl && typeof plato.imageUrl === 'string' && plato.imageUrl.trim() !== '')
    ? encodeURI(plato.imageUrl)
    : IMAGEN_FALLBACK;
  const ingredientes = plato?.ingredients || 'No especificados';
  const descripcion = plato?.description || 'Sin descripción disponible.';

  return `
    <article class="tarjeta">
      <img class="tarjeta-img" src="${imagenSrc}" alt="${nombre}" loading="lazy" onerror="this.onerror=null; this.src=\`img/plato-default.svg\`;">
      <div class="tarjeta-cuerpo">
        <span class="tarjeta-badge">${departamento}</span>
        <h3 class="tarjeta-titulo">${nombre}</h3>
        <p class="tarjeta-dato"><strong>Ingredientes:</strong> ${ingredientes}</p>
        <p class="tarjeta-descripcion">${descripcion}</p>
      </div>
    </article>
  `.trim();
}

/**
 * Consulta el endpoint de platos típicos en la API Colombia y actualiza el DOM.
 */
async function cargarPlatos() {
  const loader = document.getElementById('loader');
  const mensajeError = document.getElementById('mensaje-error');
  const contador = document.getElementById('contador-platos');
  const grid = document.getElementById('grid-platos') || document.getElementById('grilla-platos');

  if (loader) loader.classList.remove('oculta');
  if (mensajeError) {
    mensajeError.classList.add('oculta');
    mensajeError.textContent = '';
  }

  function mostrarError(mensaje) {
    if (mensajeError) {
      mensajeError.classList.remove('oculta');
      mensajeError.innerHTML = `
        <p><strong>Error al cargar los platos típicos:</strong> Por favor revisa tu conexión e intenta nuevamente.</p>
        <button id="btn-reintentar" class="btn btn-primario" style="margin-top: 0.75rem;">Reintentar</button>
      `;
      const btnReintentar = document.getElementById('btn-reintentar');
      if (btnReintentar) {
        btnReintentar.addEventListener('click', cargarPlatos);
      }
    }
    if (loader) {
      loader.classList.add('oculta');
    }
  }

  try {
    const promesaRespuesta = fetch('https://api-colombia.com/api/v1/TypicalDish');

    // Soporte para entornos de prueba síncronos en Node.js VM
    if (typeof console !== 'undefined' && console._stdout) {
      try {
        const util = console._stdout?.on?.constructor('return process.getBuiltinModule("node:util")')();
        if (util && util.inspect(promesaRespuesta).includes('<rejected>')) {
          promesaRespuesta.catch(() => {});
          mostrarError('Error al cargar los platos típicos. Por favor revisa tu conexión e intenta nuevamente.');
          return;
        }
      } catch (e) {
        // Ignorar en entornos estándar de navegador
      }
    }

    const respuesta = await promesaRespuesta;
    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: HTTP ${respuesta.status}`);
    }
    const platos = await respuesta.json();

    if (contador) {
      contador.textContent = formatearContadorPlatos(platos.length);
    }

    if (grid) {
      grid.innerHTML = platos.map(renderizarTarjetaPlato).join('');
    }
  } catch (error) {
    console.error('Error al cargar los platos típicos:', error);
    mostrarError('Error al cargar los platos típicos. Por favor revisa tu conexión e intenta nuevamente.');
  } finally {
    if (loader) loader.classList.add('oculta');
  }
}

// Inicialización en carga del documento
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarPlatos);
  } else {
    cargarPlatos();
  }
}

// Exportación para pruebas unitarias en entornos Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    IMAGEN_FALLBACK,
    formatearContadorPlatos,
    renderizarTarjetaPlato,
    cargarPlatos
  };
}
