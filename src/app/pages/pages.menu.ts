export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'profile',
        data: {
          menu: {
            title: 'general.menu.profile',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            hidden: true,
            order: 0,
          },
        },
      },
      {
        path: 'change-password',
        data: {
          menu: {
            title: 'general.menu.change-password',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            hidden: true,
            order: 0,
          },
        },
      },
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0,
            // roles: ['SuperAdmin']
          },
        },
      },
      {
        path: 'view-area/:id',
        data: {
          menu: {
            title: 'general.menu.area-detail',
            icon: 'ion-android-home',
            hidden: true,
            pathMatch: 'prefix',
            selected: false,
            expanded: false,
            order: 0,
            // roles: ['Admin']
          },
        },
      },
      {
        path: 'sensors',
        data: {
          menu: {
            title: 'general.menu.sensor',
            icon: 'fa fa-microchip',
            selected: false,
            expanded: false,
            order: 0,
            roles: ['Admin'],
          },
        },
      },
      {
        path: 'areas',
        data: {
          menu: {
            title: 'general.menu.area',
            icon: 'fa fa-crosshairs',
            selected: false,
            expanded: false,
            order: 0,
            roles: ['Admin'],
          },
        },
      },
      {
        path: 'farms',
        data: {
          menu: {
            title: 'general.menu.farm',
            icon: 'fa fa-object-group',
            selected: false,
            expanded: false,
            order: 0,
            roles: ['Admin'],
          },
        },
      },
      {
        path: 'users',
        data: {
          menu: {
            title: 'general.menu.user',
            icon: 'ion-ios-people',
            selected: false,
            expanded: false,
            order: 0,
            roles: ['Admin'],
          },
        },
      },
    ],
  },
];
