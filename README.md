# DATANA SOFT — Sitio web

Web corporativa estática (HTML + CSS + JS, sin dependencias ni build) publicada con GitHub Pages.

## Estructura

```
index.html                  Página principal (todas las secciones)
legal.html                  Aviso legal, privacidad y cookies (plantilla, completar)
styles.css                  Estilos — colores de marca en :root
script.js                   Animaciones, menú móvil y formulario de contacto
assets/logo.svg             Logo
assets/favicon.svg          Icono de pestaña
.github/workflows/deploy.yml  Despliegue automático a GitHub Pages
```

## Ver en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar (primera vez)

1. Crea un repositorio vacío en GitHub, p. ej. `datanasoft-web` (sin README).
2. Desde esta carpeta:
   ```bash
   git remote add origin https://github.com/<TU_USUARIO>/datanasoft-web.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Ve a la pestaña **Actions**: cuando termine el workflow, la web estará en
   `https://<TU_USUARIO>.github.io/datanasoft-web/`.

## Modificar la web

Edita los archivos, luego:
```bash
git add . && git commit -m "Describe el cambio" && git push
```
En ~1 minuto se publica la nueva versión.

## Dominio propio (opcional, datanasoftcompany.com)

1. **Settings → Pages → Custom domain**: escribe `datanasoftcompany.com` y guarda.
2. En tu proveedor DNS crea un registro `CNAME` de `www` → `<TU_USUARIO>.github.io`.
   Para el dominio raíz, registros `A` a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Activa **Enforce HTTPS**.

## Formulario de contacto

Por defecto abre el correo del visitante (`mailto`). Para recibir los mensajes sin que el usuario use su correo:
crea un formulario gratis en [Formspree](https://formspree.io) y pega su URL en `FORM_ENDPOINT` dentro de `script.js`.

## Pendiente de completar

- Crear el reenvío de `contacto@datanasoftcompany.com` en Cloudflare Email Routing en `index.html`, `script.js` y `legal.html`.
- URL de LinkedIn de la empresa en `index.html`.
- Dirección y datos registrales en `legal.html`.
