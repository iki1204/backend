
let running = false;

export default {
  "sync-products-every-5min": {
    task: async ({ strapi }) => {
      if (running) {
        strapi.log.warn("[CRON] Sync omitido: aún hay una sincronización en curso.");
        return;
      }

      running = true;
      const startedAt = Date.now();

      try {
        strapi.log.info(`[CRON] Sync iniciado ${new Date().toISOString()}`);

        const productoCtrl = strapi.controller("api::producto.producto");
        const categoriaCtrl = strapi.controller("api::categoria.categoria");
        const marcaCtrl = strapi.controller("api::marca.marca");

        const results = await Promise.allSettled([
          categoriaCtrl.syncFromContifico(),
          marcaCtrl.syncFromContifico(),
          productoCtrl.syncFromContifico(),
        ]);

        const [catRes, marRes, prodRes] = results;

        if (catRes.status === "rejected") strapi.log.error("[CRON] Error categorías:", catRes.reason);
        if (marRes.status === "rejected") strapi.log.error("[CRON] Error marcas:", marRes.reason);
        if (prodRes.status === "rejected") strapi.log.error("[CRON] Error productos:", prodRes.reason);

        const categorias = catRes.status === "fulfilled" ? catRes.value : { count: 0 };
        const marcas = marRes.status === "fulfilled" ? marRes.value : { count: 0 };
        const productos = prodRes.status === "fulfilled" ? prodRes.value : { count: 0 };

        strapi.log.info(
          `[CRON] Sync completada en ${Math.round((Date.now() - startedAt) / 1000)}s: ` +
          `${categorias.count} categorías, ${marcas.count} marcas, ${productos.count} productos`
        );
      } catch (error) {
        strapi.log.error("[CRON] Error general en sincronización", error);
      } finally {
        running = false;
      }
    },
    options: {
      rule: "*/10 * * * *",
    },
  },
};
