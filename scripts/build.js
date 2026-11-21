// Build: copia los archivos del frontend a dist/, que es lo que se publica en GitHub Pages
const fs = require('fs');
const path = require('path');

const origen = path.join(__dirname, '..', 'src');
const destino = path.join(__dirname, '..', 'dist');
const archivos = ['index.html', 'styles.css', 'app.js', 'utils.js', 'data.js'];

fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino);
for (const archivo of archivos) {
  fs.copyFileSync(path.join(origen, archivo), path.join(destino, archivo));
}
console.log(`Build listo: ${archivos.length} archivos en dist/`);
