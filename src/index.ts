// import type { Core } from '@strapi/strapi';

export default {
  register() {},

  bootstrap() {
    //  Captura promesas rechazadas no manejadas
    process.on("unhandledRejection", (reason: any) => {
      console.error("[unhandledRejection]", reason);
      try {
        console.error(
          "[unhandledRejection details]",
          JSON.stringify(reason, Object.getOwnPropertyNames(reason), 2)
        );
      } catch {
        console.error("[unhandledRejection details]", String(reason));
      }
    });

    //  Captura excepciones no atrapadas
    process.on("uncaughtException", (err: any) => {
      console.error("[uncaughtException]", err);
      try {
        console.error(
          "[uncaughtException details]",
          JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
        );
      } catch {
        console.error("[uncaughtException details]", String(err));
      }
    });

    console.log(" Global error handlers registrados");
  },
};
