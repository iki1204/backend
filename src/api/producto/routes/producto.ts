/**
 * producto router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/productos/sync',
      handler: 'producto.syncFromContifico',
      config: {
        auth: false, 
        description: 'Sincroniza productos desde la API externa de Contífico',
      },
    },
  ],
};
