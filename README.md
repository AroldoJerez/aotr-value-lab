# AOTR Value Lab

**Tu espacio de referencia para comparar el valor en AOTR.**
Comparador de trades en tiempo real: armá dos ofertas lado a lado, medí la diferencia y negociá sabiendo exactamente dónde estás parado.

🔗 **Demo en vivo:** [aotr-value-lab.vercel.app](https://aotr-value-lab.vercel.app)

---

## ✨ Features

- **Comparador de ofertas** — arrastrá y soltá items en dos slots ("tu oferta" vs "oferta rival") y compará el valor total al instante.
- **Tres monedas soportadas** — Keys 🔑, Viz 💎 y Scrolls 📜, con conversión automática entre ellas.
- **Sync automático de precios** — los valores se sincronizan periódicamente desde la Value List pública de la comunidad, cubriendo todas las categorías del juego (cosméticos, crates, battlepass, artefactos, drops, shop, etc.).
- **Tema claro / oscuro** — con persistencia en `localStorage` y estética dark-gaming carbón/borgoña.
- **Fondo de video ambiental** — con fallback y respeto a `prefers-reduced-motion`.
- **Búsqueda y catálogo** — filtrado de artículos por nombre con paginación progresiva.

## 🚧 Roadmap

- [ ] Imágenes propias para cada artículo del catálogo
- [ ] Soporte bilingüe completo (Inglés / Español) vía `next-intl`
- [ ] Gráfica de precios mejorada (histórico, tendencias)

## 🛠️ Stack técnico

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [next-intl](https://next-intl.dev/) — internacionalización y rutas por locale
- [@dnd-kit](https://dndkit.com/) — drag & drop en el comparador
- [lucide-react](https://lucide.dev/) — iconografía

**Backend / Datos**
- [Prisma 7](https://www.prisma.io/) con `@prisma/adapter-pg`
- [PostgreSQL](https://www.postgresql.org/) (hosteado en [Neon](https://neon.tech))
- API Routes de Next.js

**Integraciones**
- [googleapis](https://github.com/googleapis/google-api-nodejs-client) — lectura de la Google Sheet pública de precios
- [xlsx](https://www.npmjs.com/package/xlsx) — parseo de datos
- Sync automatizado vía endpoint `/api/sync`

**Infraestructura**
- [Vercel](https://vercel.com/) — hosting y despliegue continuo
- [Neon](https://neon.tech/) — Postgres serverless (free tier)

## 🚀 Getting started

### Requisitos previos
- Node.js 20+
- Una base de datos PostgreSQL (por ejemplo, un proyecto gratis en [Neon](https://neon.tech))

### 1. Cloná el repo
```bash
git clone https://github.com/AroldoJerez/aotr-value-lab.git
cd aotr-value-lab
```

### 2. Instalá las dependencias
```bash
npm install
```

### 3. Configurá las variables de entorno
Creá un archivo `.env` en la raíz con:
```dotenv
DATABASE_URL="postgresql://usuario:password@host/db?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://usuario:password@host-directo/db?sslmode=require&channel_binding=require"
```
> `DATABASE_URL` es la conexión pooled (para runtime), `DIRECT_URL` es la conexión directa (para migraciones de Prisma).

### 4. Generá el cliente de Prisma y corré las migraciones
```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Levantá el servidor de desarrollo
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000).

## 📦 Scripts disponibles

| Comando         | Descripción                                   |
|-----------------|------------------------------------------------|
| `npm run dev`   | Levanta el servidor de desarrollo (Turbopack)  |
| `npm run build` | Genera el cliente de Prisma y compila para producción |
| `npm run start` | Corre el build de producción                   |
| `npm run lint`  | Corre ESLint sobre el proyecto                  |

## 🌐 Deploy

El proyecto está pensado para desplegarse en **Vercel** con una base de datos **Neon**:

1. Importá el repo en [vercel.com](https://vercel.com/new).
2. Agregá `DATABASE_URL` y `DIRECT_URL` como variables de entorno.
3. Deploy automático en cada push a `main`.

> ⚠️ El sync de precios corre vía `/api/sync`. El plan gratuito de Vercel solo permite cron jobs una vez al día, así que para sincronizar con más frecuencia se recomienda un scheduler externo gratuito (como [cron-job.org](https://cron-job.org)) o un workflow programado de GitHub Actions apuntando a ese endpoint.

## ⚠️ Disclaimer

Este proyecto no está afiliado oficialmente al juego. Los precios se basan en una value list mantenida por la comunidad y son solo de referencia.

## 👤 Autor

Desarrollado por [Aroldo Jerez](https://github.com/AroldoJerez).

## 📄 Licencia

Este proyecto no tiene una licencia definida todavía. Si querés que otros puedan usar o contribuir al código libremente, considerá agregar una licencia (por ejemplo [MIT](https://choosealicense.com/licenses/mit/)).
