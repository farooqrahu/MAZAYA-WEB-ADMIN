/**
 * The Production Environment
 * @type {{production: boolean; baseUrl: string}}
 */
export const environment = {
  production: true,
  qa: false,
  uat: false,
  baseUrl: 'https://mazaya-api.azurewebsites.net',
  googleMaps: {
    key: 'AIzaSyBB1A5pervLZDnE6iCKbu8Xfb6ysc_SOg0'
  },
  payfort: {
    accessCode: 'Qv0clNAjqhvT3LtJXvPR',
    merchantIdentifier: 'RDVuwRxl',
    passPhraseIn: 'MAZAYAREQ',
    passPhraseOut: 'MAZAYAREQ'
  }
};
