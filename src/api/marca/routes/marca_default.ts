import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::marca.marca',{
    config:{
        find:{
            middlewares: ['api::marca.marca-populate']
        }
    }
});