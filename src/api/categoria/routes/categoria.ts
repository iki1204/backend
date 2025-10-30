/**
 * categoria router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/categorias/sync',
      handler: 'categoria.syncFromContifico',
      config: {
        auth: false, 
        description: 'Sincroniza productos desde la API externa de Contífico',
      },
    },
  ],
};