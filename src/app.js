/* global L, BiciUtils, BiciData */
(function () {
  const COLORES_ESTADO = { bueno: '#16a34a', regular: '#f59e0b', malo: '#dc2626' };
  const NOMBRES_TIPO = {
    robo: 'Robo',
    accidente: 'Accidente',
    via_invadida: 'Vía invadida',
    mal_estado: 'Mal estado'
  };
  const CLAVE_STORAGE = 'bicisegura-reportes';

  const mapa = L.map('mapa').setView([-12.085, -77.045], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapa);

  // Reportes guardados por el usuario en este navegador
  function leerReportes() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    } catch {
      return [];
    }
  }
  function guardarReportes(lista) {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
    } catch {
      /* almacenamiento no disponible: se pierde al recargar */
    }
  }

  const reportesPropios = leerReportes();
  const todosIncidentes = () => BiciData.incidentes.concat(reportesPropios);

  // HU04 / HU06: ciclovías coloreadas según su estado
  const capaCiclovias = L.layerGroup(
    BiciData.ciclovias.map((c) =>
      L.polyline(c.puntos, { color: COLORES_ESTADO[c.estado], weight: 6, opacity: 0.85 })
        .bindPopup(`<strong>${BiciUtils.escaparHtml(c.nombre)}</strong><br>Estado: ${c.estado}`)
    )
  ).addTo(mapa);

  // HU07 / HU08: incidentes; el color depende del nivel de riesgo de la zona
  const capaIncidentes = L.layerGroup().addTo(mapa);
  function dibujarIncidentes() {
    capaIncidentes.clearLayers();
    const lista = todosIncidentes();
    lista.forEach((i) => {
      const riesgo = BiciUtils.nivelRiesgo(i, lista);
      const color = riesgo === 'alto' ? '#dc2626' : riesgo === 'medio' ? '#f59e0b' : '#6b7280';
      L.circleMarker([i.lat, i.lng], {
        radius: 8,
        color,
        fillColor: color,
        fillOpacity: i.estado === 'validado' ? 0.7 : 0.25,
        dashArray: i.estado === 'validado' ? null : '4'
      })
        .bindPopup(
          `<strong>${NOMBRES_TIPO[i.tipo]}</strong><br>` +
          `${BiciUtils.escaparHtml(i.descripcion || '')}<br>` +
          `Estado: ${i.estado} · Riesgo de la zona: ${riesgo}`
        )
        .addTo(capaIncidentes);
    });
  }
  dibujarIncidentes();

  // HU11: estacionamientos
  const capaEstacionamientos = L.layerGroup(
    BiciData.estacionamientos.map((e) =>
      L.circleMarker([e.lat, e.lng], { radius: 7, color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 0.8 })
        .bindPopup(`<strong>P · ${BiciUtils.escaparHtml(e.nombre)}</strong><br>Calificación: ${e.calificacion} / 5`)
    )
  ).addTo(mapa);

  // Interruptores de capas
  const capas = {
    'capa-ciclovias': capaCiclovias,
    'capa-incidentes': capaIncidentes,
    'capa-estacionamientos': capaEstacionamientos
  };
  Object.keys(capas).forEach((id) => {
    document.getElementById(id).addEventListener('change', (ev) => {
      const capa = capas[id]; // eslint-disable-line security/detect-object-injection
      if (ev.target.checked) capa.addTo(mapa);
      else mapa.removeLayer(capa);
    });
  });

  // Punto seleccionado en el mapa
  let puntoElegido = null;
  let marcadorElegido = null;
  mapa.on('click', (ev) => {
    puntoElegido = { lat: ev.latlng.lat, lng: ev.latlng.lng };
    if (marcadorElegido) mapa.removeLayer(marcadorElegido);
    marcadorElegido = L.circleMarker(ev.latlng, { radius: 9, color: '#111827', fillColor: '#facc15', fillOpacity: 1 })
      .addTo(mapa)
      .bindTooltip('Punto seleccionado')
      .openTooltip();
  });

  const mensaje = document.getElementById('mensaje');
  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo;
  }

  // HU07: enviar reporte (queda pendiente de validación)
  document.getElementById('form-reporte').addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!puntoElegido) {
      mostrarMensaje('Primero haz clic en el mapa para marcar el lugar.', 'error');
      return;
    }
    const reporte = {
      id: Date.now(),
      tipo: document.getElementById('tipo').value,
      descripcion: document.getElementById('descripcion').value.trim(),
      lat: puntoElegido.lat,
      lng: puntoElegido.lng,
      estado: 'pendiente'
    };
    const errores = BiciUtils.validarReporte(reporte);
    if (errores.length) {
      mostrarMensaje(errores.join('. '), 'error');
      return;
    }
    reportesPropios.push(reporte);
    guardarReportes(reportesPropios);
    dibujarIncidentes();
    ev.target.reset();
    mostrarMensaje('Reporte enviado. Queda pendiente de validación.', 'ok');
  });

  // HU11: estacionamientos a menos de 500 m del punto elegido
  document.getElementById('buscar-estacionamientos').addEventListener('click', () => {
    const lista = document.getElementById('lista-estacionamientos');
    lista.textContent = '';
    if (!puntoElegido) {
      mostrarMensaje('Marca tu destino en el mapa para buscar estacionamientos.', 'error');
      return;
    }
    const cercanos = BiciUtils.estacionamientosCercanos(puntoElegido, BiciData.estacionamientos, 500);
    if (!cercanos.length) {
      const li = document.createElement('li');
      li.textContent = 'No hay estacionamientos a menos de 500 m.';
      lista.appendChild(li);
      return;
    }
    cercanos.forEach((e) => {
      const li = document.createElement('li');
      li.textContent = `${e.nombre}: ${e.distancia} m · ${e.calificacion} / 5`;
      lista.appendChild(li);
    });
  });
})();
