const {
  dentroDeLima,
  distanciaMetros,
  estacionamientosCercanos,
  validarReporte,
  escaparHtml,
  nivelRiesgo
} = require('../src/utils');

const MIRAFLORES = { lat: -12.1218, lng: -77.0300 };

describe('dentroDeLima', () => {
  test('acepta un punto de Miraflores', () => {
    expect(dentroDeLima(MIRAFLORES.lat, MIRAFLORES.lng)).toBe(true);
  });
  test('rechaza un punto de Nueva York', () => {
    expect(dentroDeLima(40.71, -74.0)).toBe(false);
  });
  test('rechaza coordenadas que no son números', () => {
    expect(dentroDeLima('-12.1', '-77.0')).toBe(false);
  });
});

describe('distanciaMetros', () => {
  test('la distancia de un punto a sí mismo es 0', () => {
    expect(distanciaMetros(MIRAFLORES, MIRAFLORES)).toBe(0);
  });
  test('Parque Kennedy a Larcomar está entre 1 y 1.3 km', () => {
    const d = distanciaMetros(MIRAFLORES, { lat: -12.1320, lng: -77.0305 });
    expect(d).toBeGreaterThan(1000);
    expect(d).toBeLessThan(1300);
  });
});

describe('HU11 - estacionamientosCercanos', () => {
  const estacionamientos = [
    { nombre: 'Lejos', lat: -12.0565, lng: -77.0365 },
    { nombre: 'Cerca', lat: -12.1220, lng: -77.0305 },
    { nombre: 'Muy cerca', lat: -12.1219, lng: -77.0301 }
  ];
  test('devuelve solo los que están a menos de 500 m, ordenados', () => {
    const r = estacionamientosCercanos(MIRAFLORES, estacionamientos, 500);
    expect(r.map((e) => e.nombre)).toEqual(['Muy cerca', 'Cerca']);
  });
  test('devuelve lista vacía si no hay ninguno cerca', () => {
    expect(estacionamientosCercanos({ lat: -11.9, lng: -77.1 }, estacionamientos)).toEqual([]);
  });
});

describe('HU07 - validarReporte', () => {
  const valido = { tipo: 'robo', lat: -12.09, lng: -77.03, descripcion: 'Robo en el cruce' };
  test('un reporte correcto no tiene errores', () => {
    expect(validarReporte(valido)).toEqual([]);
  });
  test('rechaza un tipo que no existe', () => {
    expect(validarReporte({ ...valido, tipo: 'otro' })).toContain('Tipo de incidente no válido');
  });
  test('rechaza una ubicación fuera de Lima', () => {
    expect(validarReporte({ ...valido, lat: 40.71, lng: -74.0 })).toContain('La ubicación debe estar dentro de Lima');
  });
  test('rechaza descripciones de más de 280 caracteres', () => {
    expect(validarReporte({ ...valido, descripcion: 'a'.repeat(281) }))
      .toContain('La descripción no puede superar 280 caracteres');
  });
  test('rechaza un reporte vacío', () => {
    expect(validarReporte(null)).toEqual(['El reporte está vacío']);
  });
});

describe('Seguridad - escaparHtml', () => {
  test('neutraliza una etiqueta script (XSS)', () => {
    expect(escaparHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
  test('escapa comillas', () => {
    expect(escaparHtml('"hola" \'mundo\'')).toBe('&quot;hola&quot; &#39;mundo&#39;');
  });
});

describe('HU08 - nivelRiesgo', () => {
  const punto = { lat: -12.0935, lng: -77.0338 };
  const validado = (lat, lng) => ({ lat, lng, estado: 'validado' });
  test('alto con 3 incidentes validados cerca', () => {
    const lista = [validado(-12.0935, -77.0338), validado(-12.0940, -77.0340), validado(-12.0930, -77.0335)];
    expect(nivelRiesgo(punto, lista)).toBe('alto');
  });
  test('medio con 1 incidente validado cerca', () => {
    expect(nivelRiesgo(punto, [validado(-12.0936, -77.0339)])).toBe('medio');
  });
  test('ignora los reportes pendientes', () => {
    expect(nivelRiesgo(punto, [{ lat: -12.0935, lng: -77.0338, estado: 'pendiente' }])).toBe('bajo');
  });
});
