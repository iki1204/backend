/**
 * marca router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/marcas/sync',
      handler: 'marca.syncFromContifico',
      config: {
        auth: false, 
        description: 'Sincroniza productos desde la API externa de Contífico',
      },
    },
  ],
};
