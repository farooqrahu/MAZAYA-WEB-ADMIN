'use strict';

import { environment } from '../../../environments/environment';
import { IPartialConfigOptions } from 'ng2-ui-auth';

export const authOptions: IPartialConfigOptions = {
	baseUrl: environment.baseUrl,
	loginUrl: 'auth/token',
	providers: {
		google: {
			clientId: '',
			additionalUrlParams: {
				'display': 'popup'
			},
			scope: [ 'openid', 'profile', 'email' ],
			scopeDelimiter: ' ',
			oauthType: '2.0',
			popupOptions: { width: 452, height: 633 }
		},
		facebook: {
			clientId: '',
			additionalUrlParams: {
				display: 'popup'
			},
			scope: [ 'email' ],
			scopeDelimiter: ',',
			oauthType: '2.0',
			popupOptions: { width: 580, height: 400 }
		}
	}
};
