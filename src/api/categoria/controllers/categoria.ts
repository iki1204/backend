/**
 * categoria controller
 */

import { factories } from '@strapi/strapi';
import fetch from 'node-fetch';

export default factories.createCoreController('api::categoria.categoria', ({ strapi }) => ({
    async syncFromContifico(ctx) {
        try {
            const apiUrl = process.env.CONTIFICO_API_URL_CATEGORIA;
            const apiKey = process.env.CONTIFICO_API_KEY;

            // Petición HTTP a la API de Contífico para obtener categorías
            const response = await fetch(apiUrl, {
                headers: { Authorization: apiKey },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${text}`);
            }

            const categoriasExternas = await response.json();


            // Procesar el json obtenido para identificar cada categoría
            let count = 0;
            for (const c of categoriasExternas) {

                const existente = await strapi.entityService.findMany('api::categoria.categoria', {
                    filters: { ID_Categoria: c.id },
                });

                const padre = await strapi.entityService.findMany('api::categoria.categoria', {
                    filters: { ID_Categoria: c.padre_id },
                });


                const data: any ={
                    nombre: c.nombre,
                    ID_Categoria: c.id,
                    padre_id: padre.length > 0 ? padre[0].id : null,
                    ID_Nombre: c.nombre.toLowerCase().replace(/\s+/g, '-'),

                };
                
                if (existente.length > 0) { 
                    if (existente[0].ID_Nombre) {
                        delete data.ID_Nombre;
                    }
                    await strapi.entityService.update('api::categoria.categoria', 
                        existente[0].id, { 
                            data, 
                    }); 
                }else { 
                    await strapi.entityService.create('api::categoria.categoria', { 
                        data 
                    }); 
                }
                count++;
            }

             
            ctx.body = { message: 'Categorías sincronizadas correctamente', count };
        } catch (err) {
            strapi.log.error('Error en syncFromContifico (categorías):', err);
            ctx.body = { error: 'Error al sincronizar categorías', details: err.message };
        }
    },
}));
