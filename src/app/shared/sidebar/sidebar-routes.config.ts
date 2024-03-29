import { RouteInfo } from './sidebar.metadata';

/**
 * All Routes used in the Sidebar
 */
export const ROUTES: RouteInfo[] = [
   {
     path: '/app/dashboard',
     title: 'Dashboard',
     icon: 'ft-layout',
     class: '',
     badge: '',
     badgeClass: '',
     isExternalLink: false,
     submenu: [],
     visibleFor: ['admin']
   },
  {
    path: '',
    title: 'Users',
    icon: 'ft-users',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: [
      {
        path: '/app/users',
        title: 'User Management',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin', 'supervisor']
      },
      {
        path: '/app/users/new',
        title: 'Add User',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      }
    ],
    visibleFor: ['admin', 'supervisor']
  },
  {
    path: '',
    title: 'Packages & Services',
    icon: 'ft-shopping-cart',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    visibleFor: ['admin'],
    submenu: [
      {
        path: '/app/sp/packages',
        title: 'Packages',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      },
      {
        path: '/app/sp/services',
        title: 'Services',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      },
      {
        path: '/app/sp/capacities',
        title: 'Capacities',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      }
    ]
  },

	{
		path: '',
		title: 'Agreements',
		icon: 'ft-file-text',
		class: 'has-sub',
		badge: '',
		badgeClass: '',
		isExternalLink: false,
		visibleFor: [ 'admin', 'corporate', 'reseller' ],
		submenu: [
			{
				path: '/app/agreements/corporate',
				title: 'Corporate Agreements',
				icon: '',
				class: '',
				badge: '',
				badgeClass: '',
				isExternalLink: false,
				submenu: [],
				visibleFor: [ 'admin', 'corporate' ]
			},
			{
				path: '/app/agreements/reseller',
				title: 'Reseller Agreements',
				icon: '',
				class: '',
				badge: '',
				badgeClass: '',
				isExternalLink: false,
				submenu: [],
				visibleFor: [ 'admin', 'reseller' ]
			},
			{
				path: '/app/agreements/add',
				title: 'Add Agreement',
				icon: '',
				class: '',
				badge: '',
				badgeClass: '',
				isExternalLink: false,
				submenu: [],
				visibleFor: [ 'admin', 'corporate', 'reseller' ]
			}
		]
	},

  {
    path: '',
    title: 'Orders',
    icon: 'ft-list',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    visibleFor: ['admin', 'supervisor', 'driver', 'operator', 'reseller'],
    submenu: [
      {
        path: '/app/orders/open',
        title: 'New Orders',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        visibleFor: ['admin', 'supervisor'],
        submenu: []
      },
      {
        path: '/app/orders/assigned',
        title: 'Assigned Orders',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        visibleFor: ['admin', 'supervisor', 'driver', 'operator'],
        submenu: []
      },
			{
				path: '/order/select-flight',
				title: 'Submit Order',
				icon: '',
				class: '',
				badge: '',
				badgeClass: '',
				isExternalLink: false,
				visibleFor: ['reseller'],
				submenu: []
			},
			{
				path: '/order/select-flight',
				title: 'Order History',
				icon: '',
				class: '',
				badge: '',
				badgeClass: '',
				isExternalLink: false,
				visibleFor: ['reseller'],
				submenu: []
			}
      //			{
      //				path: '/app/orders/booking/select-flight',
      //				title: 'Place Order',
      //				icon: '',
      //				class: '',
      //				badge: '',
      //				badgeClass: '',
      //				isExternalLink: false,
      //				visibleFor: [ 'admin', 'supervisor', 'operator' ],
      //				submenu: []
      //			}
    ]
  },
  {
    path: '',
    title: 'Vouchers',
    icon: 'ft-file-text',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: [
      {
        path: '/app/vouchers',
        title: 'Voucher Management',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      },
      {
        path: '/app/vouchers/new',
        title: 'Add Voucher',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        visibleFor: ['admin']
      }
    ],
    visibleFor: ['admin']
  },
  {
    path: '',
    title: 'My Account',
    icon: 'ft-settings',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    visibleFor: ['*'],
    submenu: [
      {
        path: '/app/account/profile',
        title: 'View Profile',
        icon: '',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        visibleFor: ['*'],
        submenu: []
      }
    ]
  },
  {
    path: '/auth/logout',
    title: 'Logout',
    icon: 'ft-log-out',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    visibleFor: ['*'],
    submenu: []
  }
];
