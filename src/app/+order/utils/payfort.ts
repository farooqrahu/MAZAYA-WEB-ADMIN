import * as uuid from 'uuid';
import * as shajs from 'sha.js';
import * as _ from 'lodash';

declare var require: any;
var CryptoJS = require("crypto-js");

export const uuid4 = () => {
  let guid = uuid();
  guid = guid.replace(/-|_|\s/gm, '').trim();
  const start = _.random(0, guid.length - 1);
  const end = start + 8;
  return uuid();
};

export const createPayfortSignature = (passphrase, data) => {
  let signatureString = '';

  signatureString += passphrase;

  const dataOrdered = {};
  _(data).keys().sort().each((key) => dataOrdered[ key ] = data[ key ]);

  data = dataOrdered;

  for ( const key in data ) {
    if ( data.hasOwnProperty(key) ) {
      signatureString += key + '=' + data[ key ];
    }
  }

  signatureString += passphrase;

  return shajs('sha256').update(signatureString).digest('hex').toUpperCase();
};
