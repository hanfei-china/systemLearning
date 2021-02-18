import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
};

import tools from './tools';
import organization from './organization';
import examine from './examine';
import system from './system';
import lrdFirstRoutes from './lrdFirstRoutes';
import branchEditView from './branchEditView';
import dataCenter from './dataCenter'

const router = new VueRouter({
    mode: 'hash',
    routes: [{
            path: '*',
            component: () =>
                import ('../../components/error/Error')
        },
        {
            path: '/smartChat',
            component: () =>
                import ('../../components/functions/tools/smartChat/smartChat')
        },
        {
            path: '/travelExpenses',
            component: () =>
                import ('../../components/functions/tools/travelExpenses/travelExpenses')
        },
        {
            path: '/router',
            component: { render: h => h('router-view') }
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () =>
                import ('../../components/login/Login2')
        },
        {
            path: '/map',
            component: () =>
                import ('../../components/map/Map')
        },
        {
            path: '/authLogin',
            component: () =>
                import ('../../components/login/TicketLogin')
        },
        {
            path: '/forgetPassword',
            component: () =>
                import ('../../components/login/ForgetPassword')
        },
        {
            path: '/formPage/:formId',
            component: () =>
                import ('../../components/functions/tools/onlineForm/OnlineFormPage')
        },
        {
            path: '/applyFieldManage/:applyId',
            component: () =>
                import ('../../components/functions/organization/memberTypeManage/applicationForm/ApplyFieldManage.vue')
        },
        ...lrdFirstRoutes,
        ...branchEditView,
        {
            path: '/console',
            name: 'console', //console下的路由是需要展示在菜单项中的
            component: () =>
                import ('../../components/functions/SideFunctions'),
            children: [{
                    path: '/console/portal',
                    name: 'portal',
                    component: () =>
                        import ('../../components/functions/portal/Portal'),
                },
                organization,
                tools,
                examine,
                system,
                dataCenter,
                {
                    path: '/console/notice',
                    name: 'consoleNotice',
                    component: () =>
                        import ('../../components/functions/notice/SystemNotice')
                },
            ]

        }
    ]
});


export default router;