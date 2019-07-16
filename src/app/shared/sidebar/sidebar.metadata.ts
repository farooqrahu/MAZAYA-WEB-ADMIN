/**
 * Type Definition for Routes triggered from the Sidebar
 */
export interface RouteInfo {
	/**
	 * The URL path the route will navigate to
	 */
	path: string;
	/**
	 * Title to display in the sidebar
	 */
	title: string;
	/**
	 * (Optional) Icon to display
	 */
	icon: string;
	/**
	 * (Optional) CSS class to add to the element
	 */
	class: string;
	/**
	 * (Optional) Number or Text that should be shown inside a badge
	 */
	badge: string;
	/**
	 * (Optional) CSS class to add to the badge element
	 */
	badgeClass: string;
	/**
	 * Whether or not the route links to an external page
	 */
	isExternalLink: boolean;
	/**
	 * (Optional) A submenu if present
	 */
	submenu: RouteInfo[];
	/**
	 * Array of roles which can view and access the route
	 */
	visibleFor: string[];
}
