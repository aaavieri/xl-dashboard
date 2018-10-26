// import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue'
import XiaoliLayout from 'src/pages/Xiaoli/Layout/XiaoliLayout.vue'
// import AuthLayout from 'src/pages/Dashboard/Pages/AuthLayout.vue'
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue'

// Page Headers
import DefaultHeader from 'src/pages/Dashboard/DefaultHeader'
// import DashboardHeader from 'src/pages/Dashboard/Dashboard/DashboardHeader.vue'
// import SweetAlertHeader from 'src/pages/Dashboard/Components/Headers/SweetAlertHeader'
// import CalendarHeader from 'src/pages/Dashboard/Calendar/CalendarHeader'
// import VectorMapsHeader from 'src/pages/Dashboard/Maps/VectorMapsHeader'

// Dashboard pages
// import Dashboard from 'src/pages/Dashboard/Dashboard/Dashboard.vue'
// import Welcome from 'src/pages/Xiaoli/Welcome.vue'

import ShowGlitch from 'src/pages/Xiaoli/ShowGlitch.vue'

// Pages
// const User = ()=>  import('src/pages/Dashboard/Pages/UserProfile.vue');
// const Pricing = ()=>  import('src/pages/Dashboard/Pages/Pricing.vue');
// const TimeLine = ()=>  import('src/pages/Dashboard/Pages/TimeLinePage.vue');
// const Login = ()=>  import('src/pages/Dashboard/Pages/Login.vue');
// const Register = ()=>  import('src/pages/Dashboard/Pages/Register.vue');
// const Lock = ()=>  import('src/pages/Dashboard/Pages/Lock.vue');

// Components pages
// const Buttons = ()=>  import('src/pages/Dashboard/Components/Buttons.vue');
// const GridSystem = ()=>  import('src/pages/Dashboard/Components/GridSystem.vue');
// const Panels = ()=>  import('src/pages/Dashboard/Components/Panels.vue');
// const SweetAlert = () => import('src/pages/Dashboard/Components/SweetAlert.vue');
// const Notifications = ()=> import('src/pages/Dashboard/Components/Notifications.vue');
// const Icons = ()=> import('src/pages/Dashboard/Components/Icons.vue');
// const Typography = ()=> import('src/pages/Dashboard/Components/Typography.vue');

// Forms pages
// const RegularForms = () => import('src/pages/Dashboard/Forms/RegularForms.vue');
// const ExtendedForms = () => import('src/pages/Dashboard/Forms/ExtendedForms.vue');
// const ValidationForms = () => import('src/pages/Dashboard/Forms/ValidationForms.vue');
// const Wizard = () => import('src/pages/Dashboard/Forms/Wizard.vue');

// TableList pages
// const RegularTables = () => import('src/pages/Dashboard/Tables/RegularTables.vue');
// const ExtendedTables = () => import('src/pages/Dashboard/Tables/ExtendedTables.vue');
// const PaginatedTables = () => import('src/pages/Dashboard/Tables/PaginatedTables.vue');
// Maps pages
// const GoogleMaps = () => import('src/pages/Dashboard/Maps/GoogleMaps.vue');
// const FullScreenMap = () => import('src/pages/Dashboard/Maps/FullScreenMap.vue');
// const VectorMaps = () => import('src/pages/Dashboard/Maps/VectorMaps.vue');

// Calendar
// const Calendar = () => import('src/pages/Dashboard/Calendar/CalendarRoute.vue');
// Charts
// const Charts = () => import('src/pages/Dashboard/Charts.vue');
// import Widgets from 'src/pages/Dashboard/Widgets.vue'

// Xiaolijiyin
import MedicalData from 'src/pages/Xiaoli/ManageData/MedicalData'
import HealthyData from 'src/pages/Xiaoli/ManageData/HealthyData'
import GoodsData from 'src/pages/Xiaoli/ManageData/GoodsData'
import ShowData from 'src/pages/Xiaoli/ManageData/ShowData'
import EditData from 'src/pages/Xiaoli/ManageData/EditData'
import ShowGoodsData from 'src/pages/Xiaoli/ManageData/ShowGoodsData'
import EditGoodsData from 'src/pages/Xiaoli/ManageData/EditGoodsData'

import PictureListEditor from 'src/pages/Dashboard/Components/PictureListEditor'

import LoginBack from 'src/pages/Login/LoginBack'

let editDataMenu = {
  path: '/manageData',
  component: XiaoliLayout,
  redirect: '/manageData/medicalData',
  name: 'ManageData',
  children: [
    {
      path: 'medicalData',
      name: 'MedicalData',
      redirect: {
        path: '/manageData/medicalData/showData',
        params: {}
      },
      components: {default: MedicalData, header: DefaultHeader},
      children: [
        {
          path: 'showData',
          name: 'ShowMedicalData',
          components: {default: ShowData, header: DefaultHeader}
        },
        {
          path: 'editData',
          name: 'EditMedicalData',
          components: {default: EditData, header: DefaultHeader}
        }
      ]
    },
    {
      path: 'healthyData',
      name: 'HealthyData',
      redirect: {
        path: '/manageData/healthyData/showData',
        params: {}
      },
      components: {default: HealthyData, header: DefaultHeader},
      children: [
        {
          path: 'showData',
          name: 'ShowHealthyData',
          components: {default: ShowData, header: DefaultHeader}
        },
        {
          path: 'editData',
          name: 'EditHealthyData',
          components: {default: EditData, header: DefaultHeader}
        }
      ]
    },
    {
      path: 'goodsData',
      name: 'GoodsData',
      redirect: {
        path: '/manageData/goodsData/showGoodsData',
        params: {}
      },
      components: {default: GoodsData, header: DefaultHeader},
      children: [
        {
          path: 'showGoodsData',
          name: 'ShowGoodsData',
          components: {default: ShowGoodsData, header: DefaultHeader}
        },
        {
          path: 'editGoodsData',
          name: 'EditGoodsData',
          components: {default: EditGoodsData, header: DefaultHeader}
        },
        {
          path: 'pictureListEditor',
          name: 'editGoodsPictureList',
          components: {default: PictureListEditor, header: DefaultHeader},
          props: {default: true, header: false}
        }
      ]
    }
  ]
}
//
// let componentsMenu = {
//   path: '/components',
//   component: XiaoliLayout,
//   redirect: '/components/buttons',
//   name: 'Components',
//   children: [
//     {
//       path: 'buttons',
//       name: 'Buttons',
//       components: {default: Buttons, header: DefaultHeader}
//     },
//     {
//       path: 'grid-system',
//       name: 'Grid System',
//       components: {default: GridSystem, header: DefaultHeader}
//     },
//     {
//       path: 'panels',
//       name: 'Panels',
//       components: {default: Panels, header: DefaultHeader}
//     },
//     {
//       path: 'sweet-alert',
//       name: 'Sweet Alert',
//       components: {default: SweetAlert, header: SweetAlertHeader}
//     },
//     {
//       path: 'notifications',
//       name: 'Notifications',
//       components: {default: Notifications, header: DefaultHeader}
//     },
//     {
//       path: 'icons',
//       name: 'Icons',
//       components: {default: Icons, header: DefaultHeader}
//     },
//     {
//       path: 'typography',
//       name: 'Typography',
//       components: {default: Typography, header: DefaultHeader}
//     }
//
//   ]
// }
// let formsMenu = {
//   path: '/forms',
//   component: XiaoliLayout,
//   redirect: '/forms/regular',
//   name: 'Forms',
//   children: [
//     {
//       path: 'regular',
//       name: 'Regular Forms',
//       components: {default: RegularForms, header: DefaultHeader}
//     },
//     {
//       path: 'extended',
//       name: 'Extended Forms',
//       components: {default: ExtendedForms, header: DefaultHeader}
//     },
//     {
//       path: 'validation',
//       name: 'Validation Forms',
//       components: {default: ValidationForms, header: DefaultHeader}
//     },
//     {
//       path: 'wizard',
//       name: 'Wizard',
//       components: {default: Wizard, header: DefaultHeader}
//     }
//   ]
// }
//
// let tablesMenu = {
//   path: '/table-list',
//   component: XiaoliLayout,
//   redirect: '/table-list/regular',
//   name: 'Tables',
//   children: [
//     {
//       path: 'regular',
//       name: 'Regular Tables',
//       components: {default: RegularTables, header: DefaultHeader}
//     },
//     {
//       path: 'extended',
//       name: 'Extended Tables',
//       components: {default: ExtendedTables, header: DefaultHeader}
//     },
//     {
//       path: 'paginated',
//       name: 'Paginated Tables',
//       components: {default: PaginatedTables, header: DefaultHeader}
//     }]
// }
//
// let mapsMenu = {
//   path: '/maps',
//   component: XiaoliLayout,
//   name: 'Maps',
//   redirect: '/maps/google',
//   children: [
//     {
//       path: 'google',
//       name: 'Google Maps',
//       components: {default: GoogleMaps, header: DefaultHeader}
//     },
//     {
//       path: 'full-screen',
//       name: 'Full Screen Map',
//       meta: {
//         hideContent: true,
//         hideFooter: true
//       },
//       components: {default: FullScreenMap}
//     },
//     {
//       path: 'vector-map',
//       name: 'Vector Map',
//       components: {default: VectorMaps, header: VectorMapsHeader}
//     }
//   ]
// }
//
// let pagesMenu = {
//   path: '/pages',
//   component: XiaoliLayout,
//   name: 'Pages',
//   redirect: '/pages/user',
//   children: [
//     {
//       path: 'user',
//       name: 'User Page',
//       components: {default: User, header: DefaultHeader}
//     },
//     {
//       path: 'timeline',
//       name: 'Timeline Page',
//       components: {default: TimeLine, header: DefaultHeader}
//     }
//   ]
// }
//
// let authPages = {
//   path: '/',
//   component: AuthLayout,
//   name: 'Authentication',
//   children: [
//     {
//       path: '/login',
//       name: 'Login',
//       component: Login
//     },
//     {
//       path: '/register',
//       name: 'Register',
//       component: Register
//     },
//     {
//       path: '/pricing',
//       name: 'Pricing',
//       component: Pricing
//     },
//     {
//       path: '/lock',
//       name: 'Lock',
//       component: Lock
//     }
//   ]
// }

const routes = [
  {
    path: '/',
    redirect: '/loginBack',
    name: 'Home'
  },
  editDataMenu,
  // componentsMenu,
  // formsMenu,
  // tablesMenu,
  // mapsMenu,
  // pagesMenu,
  // authPages,
  {
    path: '/loginBack',
    name: 'LoginBack',
    component: LoginBack
  },
  {
    path: '/',
    component: XiaoliLayout,
    redirect: '/showGlitch',
    name: 'MainPage',
    children: [
      {
        path: 'showGlitch',
        name: 'ShowGlitch',
        components: {default: ShowGlitch, header: DefaultHeader}
      }
      // {
      //   path: 'calendar',
      //   name: 'Calendar',
      //   components: {default: Calendar, header: CalendarHeader}
      // },
      // {
      //   path: 'charts',
      //   name: 'Charts',
      //   components: {default: Charts, header: DefaultHeader}
      // },
      // {
      //   path: 'widgets',
      //   name: 'Widgets',
      //   components: {default: Widgets, header: DefaultHeader}
      // }
    ]
  },
  {path: '*', component: NotFound}
]

export default routes

// WEBPACK FOOTER //
// ./src/routes/routes.js
