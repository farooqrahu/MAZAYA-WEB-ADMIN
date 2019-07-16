export const currentUserRole = (payload: any): string => {
	return (<string>payload[ 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' ]).toLowerCase();
};
