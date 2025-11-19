/**
 * `productPopulate` middleware
 */

const populateConfig = {
  imagen:true,
  datasheets:true
}

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In productPopulate middleware.');
    ctx.query.populate = populateConfig;
    await next();
  };
};
