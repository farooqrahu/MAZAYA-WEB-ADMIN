import { Injectable } from '@angular/core';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class ServicesService extends EntityService {

	entityUrl = 'services';

}
