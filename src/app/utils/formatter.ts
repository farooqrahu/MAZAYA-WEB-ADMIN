import * as moment from 'moment';
import { CountriesService } from '../services/countries/countries.service';
import { capitalize } from './string-functions';
import { LanguageType } from '../shared/enums/language-type.enum';

export const formatDate =  ( date ) => {
  const stillUtc = moment.utc( date ).toDate();
  const local = moment( stillUtc ).local().format('MMMM DD, YYYY' ) ;
  return local;
};

export const formatDateWithLocale =  ( date, languageType: LanguageType ) => {
    let local = '';
    if (languageType === LanguageType.English) {
      moment.locale('en');
    } else {
      moment.locale('ar-SA');
    }
    //const m = moment();
    //const stillUtc = m.utc( date ); //Not working!

    const stillUtc = moment.utc(date);

    local = stillUtc.local().format('MMMM DD, YYYY') ;
    return local;
};

export const formatAvatar = ( customer ) => {
  if ( customer[ 'first-name' ] && customer[ 'last-name' ] && !customer['avatar'] ) {
    const letter1 = customer[ 'first-name' ].charAt(0);
    const letter2 = customer[ 'last-name' ].charAt(0);
    return `http://placehold.it/500x500?text=${letter1} ${letter2}`;
  } else {
    return customer['avatar'];
  }
};

export const formatMobileNumber = ( mobile, dialCode ) => {
  mobile = mobile.replace(/[^0-9]/g, '');
  const mobileLength = CountriesService.prototype.getMobileLength( dialCode );
  return mobile.substring( 0, mobileLength );
};


export const formatName = ( name ) => {
  name = name.replace(/[^a-zA-Z\s]*$/, '');
  name = capitalize( name );
  return name;
};


export const formatEmailAddress = (email) => {
  // disable spaces
  email = email.replace(/\s/g, '');
  return email;
};


