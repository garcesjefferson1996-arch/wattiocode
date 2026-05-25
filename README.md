# wattio — landing page

Diseño digital a medida · Ecuador

## Estructura

```
index.html              ← la página completa (1 solo archivo HTML)
assets/
  wattio-logo.png       ← logo de la marca
trabajos/
  invitacion-boda.jpg   ← REEMPLAZAR con tu invitación real
  invitacion-cumple.jpg ← REEMPLAZAR con tu invitación real
README.md
```

## ⚠️ Antes de publicar

Las dos imágenes en `trabajos/` son referencias de Pinterest, no son trabajo de
wattio. Reemplázalas por **tus propias invitaciones**, manteniendo los mismos
nombres de archivo (`invitacion-boda.jpg` y `invitacion-cumple.jpg`).

Formato recomendado: JPG, vertical, ratio 3:4 o similar, mínimo 800px de ancho.

## Cómo publicar

### Opción A — Netlify Drop (más rápido, 1 minuto)

1. Entra a https://app.netlify.com/drop
2. Arrastra **la carpeta completa** (no el zip) a la página
3. Listo: te da una URL pública instantánea
4. Para conectar tu dominio `.com` propio: Site settings → Domain management

### Opción B — GitHub Pages (si quieres versionar)

1. Crea un repo en https://github.com/new (público, llamado `wattio` por ejemplo)
2. Sube todos los archivos:
   ```bash
   git init
   git add .
   git commit -m "first deploy"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/wattio.git
   git push -u origin main
   ```
3. En GitHub: Settings → Pages → Source: `main` branch, root folder → Save
4. Tu sitio sale en `https://TU_USUARIO.github.io/wattio/` en ~1 min

### Opción C — Vercel

1. Entra a https://vercel.com/new
2. Conecta el repo de GitHub o arrastra la carpeta
3. Deploy automático

## Dominio propio

Cuando compres `wattio.ec` (o el que elijas):

- **Netlify:** Site settings → Domain → Add custom domain → seguir instrucciones DNS
- **Vercel:** Settings → Domains → Add → seguir instrucciones DNS
- **GitHub Pages:** Settings → Pages → Custom domain

Todos te dan SSL (https) gratis automático.

## Contacto en el código

Si cambia tu número o email, edita en `index.html`:

- Número WhatsApp: busca `wa.me/593993340103` (11 ocurrencias)
- Email: busca `hola@wattio.ec` (1 ocurrencia)
