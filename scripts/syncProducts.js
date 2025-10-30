const fetch = require('node-fetch');

module.exports = async () => {
  try {
    const API_URL = process.env.CONTIFICO_BASE.toString();
    const API_KEY = process.env.CONTIFICO_API_KEY.toString();

    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const productos = await response.json();

    for (const p of productos) {
      // Verifica si el producto ya existe
      const existing = await strapi.db.query('api::producto.producto').findOne({
        where: { codigo: p.codigo }
      });

      if (existing) {
        // Actualiza producto
        await strapi.db.query('api::producto.producto').update({
          where: { id: existing.id },
          data: {
            nombre: p.nombre,
            descripcion: p.descripcion,
            pvp1: p.pvp1,
            pvp2: p.pvp2,
            pvp3: p.pvp3,
            pvp4: p.pvp4,
            pvp_comisariato: p.pvp_comisariato,
            pvp_supereasy: p.pvp_supereasy,
            cantidad_stock: p.cantidad_stock,
            porcentaje_iva: p.porcentaje_iva,
            tipo_producto: p.tipo_producto,
            detalle_variantes: p.detalle_variantes,
            categoria_id: p.categoria_id
          }
        });
      } else {
        // Crear producto
        await strapi.db.query('api::producto.producto').create({
          data: {
            nombre: p.nombre,
            descripcion: p.descripcion,
            codigo: p.codigo,
            codigo_barra: p.codigo_barra,
            pvp1: p.pvp1,
            pvp2: p.pvp2,
            pvp3: p.pvp3,
            pvp4: p.pvp4,
            pvp_comisariato: p.pvp_comisariato,
            pvp_supereasy: p.pvp_supereasy,
            cantidad_stock: p.cantidad_stock,
            porcentaje_iva: p.porcentaje_iva,
            tipo_producto: p.tipo_producto,
            detalle_variantes: p.detalle_variantes,
            categoria_id: p.categoria_id
          }
        });
      }
    }

    console.log("Sincronización completada ✅");

  } catch (error) {
    console.error("Error sincronizando productos:", error);
  }
};
