/**
 * marca controller
 */

import { factories } from "@strapi/strapi";
import fetch from "node-fetch";

export default factories.createCoreController(
  "api::marca.marca",
  ({ strapi }) => ({
    async syncFromContifico(ctx) {
      try {
        const apiUrl = process.env.CONTIFICO_API_URL_MARCA;
        const apiKey = process.env.CONTIFICO_API_KEY;

        // Petición HTTP a la API de Contífico para obtener marcas
        const response = await fetch(apiUrl, {
          headers: { Authorization: apiKey },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${text}`);
        }

        const marcasExternas = await response.json();

        const idsExternos = new Set(
          marcasExternas.map((marca: any) => String(marca.id))
        );

        // Procesar el json obtenido para identificar cada categoría
        let count = 0;
        for (const m of marcasExternas) {
          const existente = await strapi.entityService.findMany(
            "api::marca.marca",
            {
              filters: { ID_Marca: m.id },
            }
          );


          const data: any = {
            nombre: m.nombre,
            ID_Marca: m.id,
            ID_Nombre: normalizeSlug(m.nombre, m.id),
          };

          if (existente.length > 0) {
            if (existente[0].ID_Nombre) {
              delete data.ID_Nombre;
            }
            await strapi.entityService.update(
              "api::marca.marca",
              existente[0].id,
              {
                data,
              }
            );
          } else {
            await strapi.entityService.create("api::marca.marca", {
              data,
            });
          }
          count++;
        }

        const marcasLocales = await strapi.entityService.findMany(
          "api::marca.marca",
          {
            fields: ["id", "ID_Marca"],
            pagination: { limit: -1 },
          }
        );

        let deleted = 0;
        for (const marca of marcasLocales) {
          const idMarca = marca.ID_Marca ? String(marca.ID_Marca) : null;
          if (idMarca && !idsExternos.has(idMarca)) {
            await strapi.entityService.delete("api::marca.marca", marca.id);
            deleted++;
          }
        }

        ctx.body = {
          message: "Categorías sincronizadas correctamente",
          count,
          deleted,
        };
      } catch (err) {
        strapi.log.error("Error en syncFromContifico (categorías):", err);
        ctx.body = {
          error: "Error al sincronizar categorías",
          details: err.message,
        };
      }
    },
  })
);

function normalizeSlug(nombre: string, codigo?: string) {
  const base = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^A-Za-z0-9]+/g, "-") // reemplaza todo lo no permitido
    .replace(/--+/g, "-") // evita guiones dobles
    .replace(/^-+|-+$/g, "") // limpia guiones inicio/final
    .toLowerCase();

  // Truncar a 60 caracteres
  let slug = base.substring(0, 60);

  if (codigo) slug += "-" + codigo.toLowerCase();
  slug = slug.replace(/-+/g, "-").replace(/-$/, "");

  return slug;
}
