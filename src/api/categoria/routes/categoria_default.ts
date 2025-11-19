import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::categoria.categoria',{
    config:{
        find:{
            middlewares: ['api::categoria.categoria-populate']
        }
    }

});