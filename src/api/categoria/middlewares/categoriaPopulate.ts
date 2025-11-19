/**
 * `categoriaPopulate` middleware
 */

const populateConfig = {
  hijo_id:true,
  padre_id:true,
  cat_img:true
};

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In categoriaPopulate middleware.');
    ctx.query.populate = populateConfig;
    ctx.query.pagination = {
      pageSize: 100,
      withCount: true,
    };

    await next();
  };
};
