/**
 * `pagePopulate` middleware
 */

const populateConfig = {

  Secciones: {
    on: {
      "shared.seo":{
        populate: ["shareImage"],
      },
      "shared.slider":{
        populate: ["files"],
      },
      "shared.hero":{
        populate: {
          Imagen: true,
          boton_link: {
            populate:{
              logo:true
            }
          }
        },
      },
      "shared.about":{
        populate: {
          Imagen: true,
          Contacto: {
            populate:{
              QR:true
            }
          }
        }
      },
      "shared.contacto":{
        populate: ["QR"],
      },
      "shared.ubicacion":{
        populate:["Imagen"]
      },
      "shared.cta":{
        populate: ["Imagen"]
      }
    }
  }
}

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In pagePopulate middleware.');
    ctx.query.populate = populateConfig;
    await next();
  };
};
