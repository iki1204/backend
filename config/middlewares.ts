export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'strapi::cors',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://192.168.5.52:4321'],
      credentials: true,
    },
  },
];
