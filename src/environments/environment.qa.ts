/**
 * The Production Environment
 * @type {{production: boolean; baseUrl: string}}
 */
export const environment = {
  production: true,
  qa: true,
  uat: false,
  baseUrl: 'https://mazaya-api-qa.azurewebsites.net',
  googleMaps: {
    key: 'AIzaSyBB1A5pervLZDnE6iCKbu8Xfb6ysc_SOg0'
  },
  payfort: {
    accessCode: 'zdNNBvU25W2ER0eA1L8w',
    merchantIdentifier: 'WAjVjYwT',
    passPhraseIn: 'TESTSHAIN',
    passPhraseOut: 'TESTSHAOUT'
  }
};
