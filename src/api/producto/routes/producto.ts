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
    {
      method: 'GET',
      path: '/productos/:id/stock',
      handler: 'producto.syncStockByID',
      config: {
        auth: false,
        description:
          'Sincroniza el stock de un producto específico desde la API de Contífico',
      },
    },
  ],
};
