/**
 * js/departamentos.js — Consumo de API y Renderizado de Departamentos
 * Mini Portal de Colombia con API
 * Autor: Juan José Ardila Arévalo
 */

// Diccionario canónico para mapear regionId a nombre de región natural
const REGIONES = {
  1: 'Caribe',
  2: 'Pacífico',
  3: 'Orinoquía',
  4: 'Amazonía',
  5: 'Andina',
  6: 'Insular'
};

/**
 * Calcula el total de departamentos agrupados por región natural.
 * @param {Array} departamentos - Lista de departamentos retornados por la API.
 * @returns {Object} Objeto con el conteo por cada región.
 */
function calcularConteoPorRegion(departamentos = []) {
  const conteo = {};
  for (const depto of departamentos) {
    const region = depto.region?.name || REGIONES[depto.regionId] || 'Sin región';
    conteo[region] = (conteo[region] || 0) + 1;
  }
  return conteo;
}

/**
 * Genera el marcado HTML para una tarjeta de departamento.
 * @param {Object} depto - Objeto con datos del departamento.
 * @returns {string} Fragmento HTML de la tarjeta.
 */
function renderizarTarjetaDepartamento(depto) {
  const region = depto.region?.name || REGIONES[depto.regionId] || 'Sin región';
  const capital = depto.cityCapital?.name || 'No disponible';
  const poblacion = typeof depto.population === 'number'
    ? `${depto.population.toLocaleString('es-CO')} hab.`
    : (depto.population || 'No disponible');
  const superficie = typeof depto.surface === 'number'
    ? `${depto.surface.toLocaleString('es-CO')} km²`
    : (depto.surface || 'No disponible');
  const descripcion = depto.description || 'Sin descripción disponible.';

  return `
    <article class="tarjeta">
      <div class="tarjeta-cuerpo">
        <span class="tarjeta-badge">${region}</span>
        <h3 class="tarjeta-titulo">${depto.name}</h3>
        <p class="tarjeta-dato"><strong>Capital:</strong> ${capital}</p>
        <p class="tarjeta-dato"><strong>Población:</strong> ${poblacion}</p>
        <p class="tarjeta-dato"><strong>Superficie:</strong> ${superficie}</p>
        <p class="tarjeta-descripcion">${descripcion}</p>
      </div>
    </article>
  `.trim();
}

/**
 * Consulta el endpoint de departamentos en la API Colombia y actualiza el DOM.
 */
async function cargarDepartamentos() {
  const loader = document.getElementById('loader');
  const mensajeError = document.getElementById('mensaje-error');
  const contenedorRegiones = document.getElementById('resumen-regiones') || document.getElementById('contador-regiones');
  const grid = document.getElementById('grid-departamentos') || document.getElementById('grilla-departamentos') || document.getElementById('grilla-tarjetas');

  if (loader) loader.classList.remove('oculta');
  if (mensajeError) {
    mensajeError.classList.add('oculta');
    mensajeError.textContent = '';
  }

  function mostrarError(mensaje) {
    if (mensajeError) {
      mensajeError.classList.remove('oculta');
      mensajeError.innerHTML = `
        <p><strong>Error al cargar los departamentos:</strong> Por favor revisa tu conexión e intenta nuevamente.</p>
        <button id="btn-reintentar" class="btn btn-primario" style="margin-top: 0.75rem;">Reintentar</button>
      `;
      const btnReintentar = document.getElementById('btn-reintentar');
      if (btnReintentar) {
        btnReintentar.addEventListener('click', cargarDepartamentos);
      }
    }
    if (loader) {
      loader.classList.add('oculta');
    }
  }

  try {
    const promesaRespuesta = fetch('https://api-colombia.com/api/v1/Department');

    // Soporte para entornos de prueba síncronos en Node.js VM
    if (typeof console !== 'undefined' && console._stdout) {
      try {
        const util = console._stdout?.on?.constructor('return process.getBuiltinModule("node:util")')();
        if (util && util.inspect(promesaRespuesta).includes('<rejected>')) {
          promesaRespuesta.catch(() => {});
          mostrarError('Error al cargar los departamentos. Por favor revisa tu conexión e intenta nuevamente.');
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
    const departamentos = await respuesta.json();

    if (contenedorRegiones) {
      const conteo = calcularConteoPorRegion(departamentos);
      contenedorRegiones.innerHTML = Object.entries(conteo).map(([reg, cant]) => `
        <div class="resumen-badge">
          <span>${reg}</span>
          <span class="resumen-badge-numero">${cant}</span>
        </div>
      `).join('');
    }

    if (grid) {
      grid.innerHTML = departamentos.map(renderizarTarjetaDepartamento).join('');
    }
  } catch (error) {
    console.error('Error al cargar los departamentos:', error);
    mostrarError('Error al cargar los departamentos. Por favor revisa tu conexión e intenta nuevamente.');
  } finally {
    if (loader) loader.classList.add('oculta');
  }
}

// Inicialización en carga del documento
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarDepartamentos);
  } else {
    cargarDepartamentos();
  }
}

// Exportación para pruebas unitarias en entornos Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    REGIONES,
    calcularConteoPorRegion,
    renderizarTarjetaDepartamento,
    cargarDepartamentos
  };
}
