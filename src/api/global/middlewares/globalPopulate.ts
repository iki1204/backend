/**
 * `globalPopulate` middleware
 */

import type { Core } from '@strapi/strapi';

const populateConfig = {
  favicon:true,
  defaultSeo: {
    populate: {
      shareImage: true
    }
  },
  header: {
    populate: {
      Logo: true,
      subitem: {
        populate:{
          logo: true
        }
      },
      Botones: true
    }
  },
  footer: {
    populate: {
      logo: true,
      Columna: {
        populate:{
          logo: true
        }
      }
    }
  }
}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In globalPopulate middleware.');
    ctx.query.populate = populateConfig;
    await next();
  };
};
