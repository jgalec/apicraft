import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  // Escaneamos la carpeta src/docs/ dinámicamente
  const docFiles = import.meta.glob('/src/docs/*.txt');
  const paths = Object.keys(docFiles);

  const entries = paths.map((path) => {
    // /src/docs/kommo.txt -> kommo
    const filename = path.split('/').pop()?.replace('.txt', '') || '';
    const name = filename.charAt(0).toUpperCase() + filename.slice(1);
    
    // Generamos la URL dinámica usando el origen actual (localhost o producción)
    return `- [${name} API Reference](${url.origin}/${filename}/llms.txt)`;
  });

  const content = [
    "# ApiCraft - LLM Manifest",
    "Repositorio dinámico de referencias para LLMs.",
    "",
    "## Documentación disponible",
    ...entries,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
