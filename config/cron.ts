
export default {
  "sync-products-every-5min": {
    task: async ({ strapi }) => {
      strapi.log.info("⏳ Iniciando sincronización diaria de Contífico...");

       try {
        const productoService = strapi.controller("api::producto.producto");
        const categoriaService = strapi.controller("api::categoria.categoria");
        const marcaService = strapi.controller("api::marca.marca");

        const [categorias, marcas, productos] = await Promise.all([
          categoriaService.syncFromContifico(),
          marcaService.syncFromContifico(),
          productoService.syncFromContifico(),
        ]);

        strapi.log.info(
          `Sync diaria completada: ${categorias.count} categorías, ${marcas.count} marcas, ${productos.count} productos`
        );
      } catch (error) {
        strapi.log.error("Error en la sincronización diaria de Contífico", error);
      }
    },
    options: {
      rule: "*/5 * * * *", // Cada 5 minutos
    //rule: "0 3 * * *", // 03:00 UTC todos los días
    },
  },
};
