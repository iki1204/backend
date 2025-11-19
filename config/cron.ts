import axios from "axios";

export default {
  "sync-products-every-5min": {
    task: async ({ strapi }) => {
      strapi.log.info("⏳ Sync productos (cada 5 minutos)...");
      // await axios.get("http://localhost:1337/api/productos/sync");
    },
    options: {
      rule: "*/5 * * * *", // Every 5 minutes
    },
  },

  "sync-categories-every-5min": {
    task: async ({ strapi }) => {
      strapi.log.info("⏳ Sync categorías (cada 5 minutos)...");
      // await axios.get("http://localhost:1337/api/categorias/sync");
    },
    options: {
      rule: "*/5 * * * *",
    },
  },
};
