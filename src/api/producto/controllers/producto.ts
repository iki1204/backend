/**
 * producto controller
 */

import { factories } from "@strapi/strapi";
import fetch from "node-fetch";

export default factories.createCoreController(
  "api::producto.producto",
  ({ strapi }) => ({
    async syncFromContifico(ctx) {
      try {
        const apiUrl = process.env.CONTIFICO_API_URL_PRODUCTO;
        const apiKey = process.env.CONTIFICO_API_KEY;

        // Petición HTTP a la API de Contífico para obtener productos
        const response = await fetch(apiUrl, {
          headers: { Authorization: apiKey },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error HTTP ${response.status}: ${text}`);
        }

        const productosExternos = await response.json();

        // Procesar el json obtenido para identificar cada producto
        let count = 0;
        for (const p of productosExternos) {
          const categoria = await strapi.entityService.findMany(
            
            "api::categoria.categoria",
            {
              filters: { ID_Categoria: p.categoria_id },
            }
          );

          const marca = await strapi.entityService.findMany(
            "api::marca.marca",
            {
              filters: { ID_Marca: p.marca_id },
            }
          );

          const existente = await strapi.entityService.findMany(
            "api::producto.producto",
            {
              filters: { codigo: p.codigo },
            }
          );

          let slug = normalizeSlug(p.nombre, p.codigo);

          const slugExistente = await strapi.entityService.findMany(
            "api::producto.producto",
            {
              filters: { ID_Nombre: slug },
            }
          );

          if (
            slugExistente.length > 0 &&
            (!existente.length || slugExistente[0].id !== existente[0]?.id)
          ) {
            const uniqueSuffix = Date.now().toString().slice(-4); // 4 dígitos únicos
            slug = `${slug}-${uniqueSuffix}`;
          }

          const data: any = {
            nombre: p.nombre,
            codigo: p.codigo,
            precio: p.pvp1 ? parseFloat(p.pvp1) : 0,
            Precio2 : p.pvp2 ? parseFloat(p.pvp2) : 0,
            Precio3 : p.pvp3 ? parseFloat(p.pvp3) : 0,
            Precio4 : p.pvp4 ? parseFloat(p.pvp4) : 0,
            cantidad_stock: p.cantidad_stock ? parseInt(p.cantidad_stock) : 0,
            estado: p.estado,
            ID_Categoria: p.categoria_id,
            ID_Marca: p.marca_id,
            ID_Nombre: slug,

            marca: marca.length > 0 ? marca[0].id : null,
            categoria: categoria.length > 0 ? categoria[0].id : null,
          };

          if (existente.length > 0) {
            if (existente[0].ID_Nombre) {
              delete data.ID_Nombre;
            }
            await strapi.entityService.update(
              "api::producto.producto",
              existente[0].id,
              {
                data,
              }
            );
          } else {
            await strapi.entityService.create("api::producto.producto", {
              data,
            });
          }

          count++;
        }
        ctx.body = { message: "Sincronización completada", count };
      } catch (err: any) {
        strapi.log.error("Error en syncFromContifico:", err);
        ctx.body = {
          error: "Error al sincronizar productos",
          details: err.message,
        };
      }
    },
  })
);

function normalizeSlug(nombre: string, codigo: string) {
  const base = nombre
    .normalize("NFD") // separa acentos (á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
    .replace(/[^A-Za-z0-9-_.~]+/g, "-") // reemplaza todo lo no permitido
    .replace(/--+/g, "-") // evita guiones dobles
    .replace(/^-+|-+$/g, "") // limpia guiones al inicio/final
    .toLowerCase();

  let slug = base;

  if (codigo) {
    slug += "-" + codigo.toLowerCase();
  }

  slug = slug.replace(/-+/g, "-").replace(/-$/, "");

  return slug;
}
