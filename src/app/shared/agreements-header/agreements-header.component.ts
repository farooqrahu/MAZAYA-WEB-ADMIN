import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';

@Component({
  selector: 'mazaya-agreements-header',
  templateUrl: './agreements-header.component.html',
  styleUrls: ['./agreements-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AgreementsHeaderComponent implements OnInit {
	role: string;
  constructor(private auth: AuthService) { }

  ngOnInit() {
		const payload = this.auth.getPayload();
		this.role = (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
  }

}
