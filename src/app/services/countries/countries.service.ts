import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from 'ng2-ui-auth';
import { LocalStorage, LocalStorageService } from 'ngx-store';
import { find } from 'lodash';

@Injectable()
export class CountriesService {
  @LocalStorage( 'nat_list' ) private nationalities = null;

  constructor ( private http: HttpClient,
                private auth: AuthService,
                private localStorageService: LocalStorageService) {

  }

  getNationalities (): Promise<any> {
    if ( this.nationalities ) {
      return this.nationalities;
    }

    return new Promise ( async ( resolve ) => {
      await this.http.get(`${environment.baseUrl}/nationalities?page[size]=500&sort=en-short-name`).subscribe((response: any) => {
        response = response.data;
        this.localStorageService.set( 'nat_list', response );
        resolve ( response );
      });
    });
  }

  getSaudiNationality () {
    const nationalities = this.nationalities;
    return nationalities && find( nationalities, ( nationality: any ) => nationality.attributes[ 'alpha-3-code' ] === 'SAU' );
  }

  getDialCodes () {
    const nationalities = this.nationalities;
    const codes = [];
    nationalities.forEach(( nationality: any ) => {
      nationality = nationality.attributes;
      codes.push({ 'dial-code' : nationality[ 'dial-code' ], 'nationality': nationality[ 'en-short-name' ] });
    });

    return codes;
  }


  getMobileLength ( dialCode ) {
    const nationalities = this.nationalities;

    let country = null;
    if (nationalities) {
      nationalities.forEach(entry => {
        entry = entry.attributes;
        if ( dialCode  === entry['dial-code']) {
          country = entry;
        }
      });
    }
    
    const length = country && country[ 'mobile-number-length' ] || 10;
    return length;
  }

}
