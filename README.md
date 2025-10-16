# Frontend Multiservicio Renacer (React + Vite + MUI)

Este frontend está configurado para trabajar en producción con el backend:

API: https://api-renacer.onrender.com

## Configuración de entorno

Se usa una variable de entorno para definir la URL base del API.

- Archivo `.env.example` incluido:

```
VITE_API_BASE_URL=https://api-renacer.onrender.com
```

- En desarrollo, crea un archivo `.env` en la raíz con la variable anterior si necesitas apuntar a otra URL.
- En Vercel, define la variable en Project Settings > Environment Variables:
	- KEY: `VITE_API_BASE_URL`
	- VALUE: `https://api-renacer.onrender.com`
	- Environments: Production y Preview

## Autenticación

El frontend utiliza JWT almacenado en `localStorage` y un `fetchAuth` centralizado que adjunta `Authorization: Bearer <token>` a cada petición. No se usan cookies entre dominios para evitar problemas CORS.

## Centralización de URLs

Todas las llamadas de red usan rutas relativas (por ejemplo, `/clientes`, `/usuarios`). La base se resuelve con `src/utils/apiConfig.js`:

- `API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-renacer.onrender.com'`
- La función `apiUrl(path)` normaliza y combina la ruta con la base.

## Desarrollo

Scripts disponibles:

- `dev`: ejecutar Vite en modo desarrollo
- `build`: generar build de producción
- `preview`: previsualizar build

## Despliegue

En Vercel, el archivo `vercel.json` redirige todas las rutas a `index.html` para soportar SPA. Asegúrate de definir `VITE_API_BASE_URL` en las variables de entorno del proyecto.
