// Datos de ejemplo (simulados) para la demostración
window.BiciData = {
  ciclovias: [
    {
      nombre: 'Av. Arequipa',
      estado: 'bueno',
      puntos: [[-12.0715, -77.0345], [-12.0905, -77.0335], [-12.1095, -77.0320]]
    },
    {
      nombre: 'Av. Salaverry',
      estado: 'regular',
      puntos: [[-12.0790, -77.0475], [-12.0900, -77.0480], [-12.1000, -77.0490]]
    },
    {
      nombre: 'Malecón de Miraflores',
      estado: 'bueno',
      puntos: [[-12.1180, -77.0430], [-12.1260, -77.0350], [-12.1340, -77.0280]]
    },
    {
      nombre: 'Av. Universitaria (tramo norte)',
      estado: 'malo',
      puntos: [[-12.0200, -77.0820], [-12.0350, -77.0830], [-12.0500, -77.0840]]
    }
  ],
  incidentes: [
    { id: 1, tipo: 'robo', lat: -12.0935, lng: -77.0338, estado: 'validado', descripcion: 'Robo de bicicleta en el cruce' },
    { id: 2, tipo: 'robo', lat: -12.0945, lng: -77.0342, estado: 'validado', descripcion: 'Intento de robo de noche' },
    { id: 3, tipo: 'accidente', lat: -12.0925, lng: -77.0330, estado: 'validado', descripcion: 'Choque con auto que giraba' },
    { id: 4, tipo: 'via_invadida', lat: -12.0880, lng: -77.0482, estado: 'validado', descripcion: 'Autos estacionados en la ciclovía' },
    { id: 5, tipo: 'mal_estado', lat: -12.0400, lng: -77.0832, estado: 'pendiente', descripcion: 'Baches grandes' }
  ],
  estacionamientos: [
    { nombre: 'Parque Kennedy', lat: -12.1218, lng: -77.0300, calificacion: 4.5 },
    { nombre: 'Larcomar', lat: -12.1320, lng: -77.0305, calificacion: 4.2 },
    { nombre: 'Centro Cívico', lat: -12.0565, lng: -77.0365, calificacion: 3.6 },
    { nombre: 'Universidad (Av. Universitaria)', lat: -12.0560, lng: -77.0845, calificacion: 4.0 }
  ]
};
