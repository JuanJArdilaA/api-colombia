# Mini Portal de Colombia con API

Plataforma web interactiva desarrollada para explorar la riqueza geográfica y gastronómica de Colombia mediante el consumo en tiempo real de la API REST pública de [Colombia API](https://api-colombia.com/).

Este proyecto fue desarrollado bajo una arquitectura web limpia, ligera y sin frameworks, implementando estándares modernos de diseño responsivo y buenas prácticas de ingeniería de software para evaluación académica.

---

## Descripción General

El **Mini Portal de Colombia** permite a los usuarios consultar información oficial y detallada sobre la división político-administrativa del país y su herencia culinaria tradicional. El portal se conecta directamente con los servicios web abiertos de Colombia API para renderizar dinámicamente tarjetas informativas, calcular estadísticas regionales en tiempo real y gestionar la carga resiliente de recursos multimedia.

---

## Módulos del Portal

El proyecto se estructura en tres vistas principales interconectadas de manera semántica:

### 1. Inicio (`index.html`)
- Página de bienvenida y punto de entrada al portal.
- Sección Hero con presentación visual y accesos directos mediante navegación HTML pura.
- Tarjetas de navegación rápida a los módulos de **Departamentos** y **Sabores de Colombia**.
- Presentación de las características de la plataforma y acreditación académica.

### 2. Departamentos de Colombia (`departamentos.html`)
- **Consumo de API**: Realiza peticiones asíncronas al endpoint `https://api-colombia.com/api/v1/Department`.
- **Renderizado Dinámico**: Presenta tarjetas detalladas para cada uno de los 33 departamentos de Colombia, incluyendo:
  - Nombre oficial del departamento.
  - Región natural (Caribe, Pacífico, Orinoquía, Amazonía, Andina, Insular) obtenida a través de mapeo relacional de identificadores.
  - Población estimada y superficie territorial en kilómetros cuadrados con formato numérico localizado en español.
  - Descripción geográfica y cultural de cada territorio.
- **Cálculo Regional Dinámico**: Agrupa y contabiliza automáticamente el número total de departamentos por cada región natural mediante funciones puras en JavaScript.
- **Tolerancia a Fallos**: Indicador visual de carga (`.loader`) y panel de mensaje amigable ante fallos de conexión o red con opción de reintento.

### 3. Sabores de Colombia / Platos Típicos (`platos.html`)
- **Consumo de API**: Consume el endpoint `https://api-colombia.com/api/v1/TypicalDish`.
- **Catálogo Gastronómico**: Renderizado dinámico de los platos típicos tradicionales de la gastronomía colombiana, mostrando:
  - Nombre del plato tradicional.
  - Departamento de origen asociado.
  - Lista de ingredientes autóctonos.
  - Reseña y descripción gastronómica.
- **Contador Dinámico**: Muestra en tiempo real el total de platos tradicionales disponibles y renderizados.
- **Resiliencia Multimedia y Fallback**: Mecanismo de respaldo automático ante imágenes no disponibles o errores HTTP en Azure Blob Storage, redirigiendo la visualización al gráfico vectorial local `img/plato-default.svg`.
- **Manejo de Errores**: Feedback visual con indicador de carga y alertas claras en caso de fallos de red.

---

## Tecnologías Utilizadas

El desarrollo del portal se realizó con un enfoque de código limpio y cero dependencias de producción:

- **HTML5 Semántico**: Estructura accesible basada en etiquetas estándar (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Puro**:
  - Arquitectura modular dividida en `css/main.css`, `css/layout.css` y `css/components.css`.
  - Enfoque de diseño **Mobile-First** con breakpoints adaptativos mediante media queries en **768px** (tablets) y **1024px** (escritorio).
  - Nomenclatura semántica de clases en español (`.contenedor`, `.tarjeta`, `.buscador`, `.loader`, `.grid`, `.btn`).
  - Animaciones nativas en CSS3 (`@keyframes spin`) para estados de espera.
- **JavaScript ES6+ (Vanilla)**:
  - Consumo asíncrono con `async/await` y la nativa `Fetch API`.
  - Control riguroso de excepciones y ciclo de vida mediante bloques `try/catch/finally`.
  - Manipulación limpia del DOM sin bibliotecas intermedias.
- **Pruebas Automatizadas E2E**:
  - Suite de pruebas de caja opaca basada en el ejecutor nativo Node.js Test Runner (`node:test`), cubriendo cobertura funcional, límites de resiliencia y verificación estructural.
- **Control de Versiones con Git**:
  - Gestión organizada en ramas de características (`feature/home`, `feature/departamentos`, `feature/platos`, `feature/readme`).
  - Historial de cambios bajo la especificación Conventional Commits en minúsculas.

---

## Instalación y Uso Local

Para ejecutar el portal en un entorno de desarrollo local, siga estos sencillos pasos:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JuanJArdilaA/api-colombia.git
cd api-colombia
```

### 2. Apertura en el Navegador
Dado que el proyecto utiliza tecnologías web nativas sin procesos de compilación (build-free), puede visualizarse de las siguientes formas:

- **Servidor local rápido con Node.js**:
  ```bash
  npx serve .
  ```
  o mediante `http-server`:
  ```bash
  npx http-server .
  ```

- **Extensión Live Server (Visual Studio Code)**:
  Abra la carpeta en VS Code, haga clic derecho sobre `index.html` y seleccione *Open with Live Server*.

- **Apertura directa**:
  Abra el archivo `index.html` directamente con doble clic en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### 3. Ejecución de la Suite de Pruebas Automatizadas
Para verificar la integridad del portal y el cumplimiento de los requerimientos técnicos:

```bash
node --test tests/**/*.test.mjs
```

Para una visualización detallada de cada prueba:
```bash
node --test --test-reporter=spec tests/**/*.test.mjs
```

---

## Estructura del Proyecto

```text
api-colombia/
├── index.html                   # Vista principal de bienvenida
├── departamentos.html           # Vista del explorador de departamentos
├── platos.html                  # Vista del catálogo de gastronomía típica
├── README.md                    # Documentación oficial del portal
├── css/
│   ├── main.css                 # Variables de diseño y estilos globales
│   ├── layout.css               # Estructura de grilla y adaptabilidad responsiva
│   └── components.css           # Estilos de componentes (tarjetas, botones, loader)
├── js/
│   ├── departamentos.js         # Lógica de consumo de API y agrupación regional
│   └── platos.js                # Lógica de consumo de platos y fallback de imagen
├── img/
│   └── plato-default.svg        # Ilustración vectorial de respaldo
└── tests/                       # Suite de pruebas E2E con Node.js Test Runner
```

---

## Autoría y Evaluación

- **Estudiante**: Juan José Ardila Arévalo
- **Usuario GitHub**: [`JuanJArdilaA`](https://github.com/JuanJArdilaA)
- **Repositorio Oficial**: [https://github.com/JuanJArdilaA/api-colombia](https://github.com/JuanJArdilaA/api-colombia)
- **Propósito**: Proyecto desarrollado para evaluación académica.
