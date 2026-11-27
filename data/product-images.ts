import type { ImageSourcePropType } from 'react-native';

/**
 * Produtos 1, 5 e 11: fotos reais da loja. Demais: ilustrações de DEMONSTRAÇÃO geradas para o protótipo. Troque pelas fotos reais da loja:
 * coloque os arquivos em assets/products e atualize este mapa (ou use URLs: { uri: 'https://...' }).
 */
export const PRODUCT_IMAGES: Record<string, ImageSourcePropType[]> = {
  '1': [require('@/assets/products/p1-1.jpg'), require('@/assets/products/p1-2.jpg')],
  '2': [require('@/assets/products/p2-1.jpg'), require('@/assets/products/p2-2.jpg'), require('@/assets/products/p2-3.jpg')],
  '3': [require('@/assets/products/p3-1.jpg'), require('@/assets/products/p3-2.jpg'), require('@/assets/products/p3-3.jpg')],
  '4': [require('@/assets/products/p4-1.jpg'), require('@/assets/products/p4-2.jpg'), require('@/assets/products/p4-3.jpg')],
  '5': [require('@/assets/products/p5-1.jpg'), require('@/assets/products/p5-2.jpg')],
  '6': [require('@/assets/products/p6-1.jpg'), require('@/assets/products/p6-2.jpg'), require('@/assets/products/p6-3.jpg')],
  '7': [require('@/assets/products/p7-1.jpg'), require('@/assets/products/p7-2.jpg'), require('@/assets/products/p7-3.jpg')],
  '8': [require('@/assets/products/p8-1.jpg'), require('@/assets/products/p8-2.jpg'), require('@/assets/products/p8-3.jpg')],
  '9': [require('@/assets/products/p9-1.jpg'), require('@/assets/products/p9-2.jpg'), require('@/assets/products/p9-3.jpg')],
  '10': [require('@/assets/products/p10-1.jpg'), require('@/assets/products/p10-2.jpg'), require('@/assets/products/p10-3.jpg')],
  '11': [require('@/assets/products/p11-1.jpg'), require('@/assets/products/p11-2.jpg')],
  '12': [require('@/assets/products/p12-1.jpg'), require('@/assets/products/p12-2.jpg'), require('@/assets/products/p12-3.jpg')],
  '13': [require('@/assets/products/p13-1.jpg'), require('@/assets/products/p13-2.jpg'), require('@/assets/products/p13-3.jpg')],
  '14': [require('@/assets/products/p14-1.jpg'), require('@/assets/products/p14-2.jpg'), require('@/assets/products/p14-3.jpg')],
  '15': [require('@/assets/products/p15-1.jpg'), require('@/assets/products/p15-2.jpg'), require('@/assets/products/p15-3.jpg')],
  '16': [require('@/assets/products/p16-1.jpg'), require('@/assets/products/p16-2.jpg'), require('@/assets/products/p16-3.jpg')],
};
