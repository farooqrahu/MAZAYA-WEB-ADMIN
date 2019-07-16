'use strict';

import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { IsNotLoggedInGuard } from '../../guards/is-not-logged-in.guard';
import { IsAdminGuard } from '../../guards/is-admin.guard';
import { IsResellerGuard } from '../../guards/is-reseller.guard';
import { IsCorporateGuard } from '../../guards/is-corporate.guard';
import { IsOperatorGuard } from '../../guards/is-operator.guard';
import { IsOrderExistsGuard } from '../../guards/is-order-exists.guard';
import { IsUseridExistsGuard } from '../../guards/is-userid-exists.guard';
import { IsPackageIdExistsGuard } from '../../guards/is-package-id-exists.guard';

export const IsLoggedIn = IsLoggedInGuard;
export const IsNotLoggedIn = IsNotLoggedInGuard;
export const IsAdmin = IsAdminGuard;
export const IsReseller = IsResellerGuard;
export const IsCorporate = IsCorporateGuard;
export const IsOperator = IsOperatorGuard;
export const IsOrderExists = IsOrderExistsGuard;
export const IsUseridExists = IsUseridExistsGuard;
export const IsPackageIdExists = IsPackageIdExistsGuard;
