// Funciones puras de BiciSegura Lima. Se usan en el navegador y en las pruebas con Jest.
(function (global) {
  const TIPOS_INCIDENTE = ['robo', 'accidente', 'via_invadida', 'mal_estado'];

  // Límites aproximados de Lima Metropolitana
  const LIMA = { minLat: -12.6, maxLat: -11.6, minLng: -77.3, maxLng: -76.6 };

  function dentroDeLima(lat, lng) {
    return (
      typeof lat === 'number' && typeof lng === 'number' &&
      lat >= LIMA.minLat && lat <= LIMA.maxLat &&
      lng >= LIMA.minLng && lng <= LIMA.maxLng
    );
  }

  // Distancia en metros entre dos puntos (fórmula de Haversine)
  function distanciaMetros(a, b) {
    const R = 6371000;
    const rad = (g) => (g * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // HU11: estacionamientos a menos de `radio` metros del destino, del más cercano al más lejano
  function estacionamientosCercanos(destino, estacionamientos, radio = 500) {
    return estacionamientos
      .map((e) => ({ ...e, distancia: Math.round(distanciaMetros(destino, e)) }))
      .filter((e) => e.distancia <= radio)
      .sort((x, y) => x.distancia - y.distancia);
  }

  // HU07: valida un reporte antes de guardarlo. Devuelve la lista de errores (vacía si es válido)
  function validarReporte(reporte) {
    const errores = [];
    if (!reporte || typeof reporte !== 'object') {
      return ['El reporte está vacío'];
    }
    if (!TIPOS_INCIDENTE.includes(reporte.tipo)) {
      errores.push('Tipo de incidente no válido');
    }
    if (!dentroDeLima(reporte.lat, reporte.lng)) {
      errores.push('La ubicación debe estar dentro de Lima');
    }
    if (typeof reporte.descripcion === 'string' && reporte.descripcion.length > 280) {
      errores.push('La descripción no puede superar 280 caracteres');
    }
    return errores;
  }

  // Seguridad: escapa texto ingresado por el usuario antes de mostrarlo (evita XSS)
  function escaparHtml(texto) {
    return String(texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // HU08: nivel de riesgo de una zona según la cantidad de incidentes validados cercanos
  function nivelRiesgo(punto, incidentes, radio = 300) {
    const cerca = incidentes.filter(
      (i) => i.estado === 'validado' && distanciaMetros(punto, i) <= radio
    ).length;
    if (cerca >= 3) return 'alto';
    if (cerca >= 1) return 'medio';
    return 'bajo';
  }

  const api = {
    TIPOS_INCIDENTE,
    dentroDeLima,
    distanciaMetros,
    estacionamientosCercanos,
    validarReporte,
    escaparHtml,
    nivelRiesgo
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.BiciUtils = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
