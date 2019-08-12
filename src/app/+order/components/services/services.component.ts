import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PackagesService } from 'app/services/api/packages/packages.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  public services$: Observable<any>;

  constructor(private packageService: PackagesService) {
    this.services$ = this.packageService.getServices().pipe(map(x => x['data']));
  }

  ngOnInit(): void {
  }
}
