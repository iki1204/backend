import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::producto.producto',{
    config: {
        find:{
            middlewares: ['api::producto.product-populate'],
        }
    }
});