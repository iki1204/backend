import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAbout extends Struct.ComponentSchema {
  collectionName: 'components_shared_abouts';
  info: {
    displayName: 'About';
    icon: 'information';
  };
  attributes: {
    Contacto: Schema.Attribute.Component<'shared.contacto', true>;
    Descripcion: Schema.Attribute.String;
    Imagen: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Titulo: Schema.Attribute.String;
  };
}

export interface SharedContacto extends Struct.ComponentSchema {
  collectionName: 'components_shared_contactos';
  info: {
    displayName: 'Contacto';
    icon: 'book';
  };
  attributes: {
    email_contacto: Schema.Attribute.Email;
    nombre: Schema.Attribute.String;
    QR: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios', true>;
    telefono: Schema.Attribute.BigInteger;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'CTA';
    icon: 'command';
  };
  attributes: {
    boton_link: Schema.Attribute.Component<'shared.nav-bar', true>;
    Descripcion: Schema.Attribute.String;
    Imagen: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'Footer';
    icon: 'hashtag';
  };
  attributes: {
    Columna: Schema.Attribute.Component<'shared.nav-bar', true>;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    texto_derechos: Schema.Attribute.String;
  };
}

export interface SharedHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_headers';
  info: {
    displayName: 'Header';
    icon: 'crown';
  };
  attributes: {
    Botones: Schema.Attribute.Component<'shared.quote', true>;
    Etiqueta: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subitem: Schema.Attribute.Component<'shared.nav-bar', true>;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    displayName: 'Hero';
    icon: 'briefcase';
  };
  attributes: {
    boton_link: Schema.Attribute.Component<'shared.nav-bar', true>;
    Descripcion: Schema.Attribute.Text;
    Imagen: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Subtitulo: Schema.Attribute.String;
    Titulo: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNavBar extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_bars';
  info: {
    displayName: 'NavBar';
    icon: 'bulletList';
  };
  attributes: {
    etiqueta: Schema.Attribute.String;
    logo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    url: Schema.Attribute.String;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaKeywords: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
    Titulo: Schema.Attribute.String;
  };
}

export interface SharedUbicacion extends Struct.ComponentSchema {
  collectionName: 'components_shared_ubicacions';
  info: {
    displayName: 'Ubicacion';
    icon: 'pinMap';
  };
  attributes: {
    Descripcion: Schema.Attribute.String;
    Imagen: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Titulo: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.about': SharedAbout;
      'shared.contacto': SharedContacto;
      'shared.cta': SharedCta;
      'shared.footer': SharedFooter;
      'shared.header': SharedHeader;
      'shared.hero': SharedHero;
      'shared.media': SharedMedia;
      'shared.nav-bar': SharedNavBar;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.ubicacion': SharedUbicacion;
    }
  }
}
