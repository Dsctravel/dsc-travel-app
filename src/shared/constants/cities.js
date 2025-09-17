export const CITY_CODES = {
  'GYN': 'Goiânia',
  'SCL': 'Santiago',
  'GRU': 'São Paulo',
  'CGH': 'São Paulo',
  'VDC': 'Vitória da Conquista',
  'SSA': 'Salvador',
  'CNF': 'Belo Horizonte',
  'CGB': 'Cuiabá'
};

export const AIRPORT_CITIES = Object.entries(CITY_CODES).reduce((acc, [code, city]) => {
  acc[city] = code;
  return acc;
}, {});
