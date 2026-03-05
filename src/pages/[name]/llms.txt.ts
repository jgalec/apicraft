import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { name } = params;

  // Intentamos importar el archivo de texto correspondiente desde src/docs/
  const docFiles = import.meta.glob('/src/docs/*.txt', { query: '?raw', import: 'default' });
  const filePath = `/src/docs/${name}.txt`;

  if (docFiles[filePath]) {
    const content = await docFiles[filePath]() as string;
    return new Response(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // Si no existe, devolvemos un 404
  return new Response('Documento no encontrado', { status: 404 });
};

// Generamos las rutas estáticas basadas en los archivos presentes en src/docs/
export function getStaticPaths() {
  const docFiles = import.meta.glob('/src/docs/*.txt');
  return Object.keys(docFiles).map(path => ({
    params: { name: path.split('/').pop()?.replace('.txt', '') || '' }
  }));
}
