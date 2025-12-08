/**
 * `marcaPopulate` middleware
 */

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In marcaPopulate middleware.');
    ctx.query.pagination = {
      pageSize: 100,
      withCount: true,
    };

    await next();
  };
};
