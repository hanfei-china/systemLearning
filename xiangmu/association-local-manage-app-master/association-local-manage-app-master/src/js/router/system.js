export default {
    path: '/console/system',
    name: 'system',
    component: {render: h => h('router-view')},
    children: [
        {
            path: '/console/system/systemRoleManage',
            name: 'systemRoleManage',
            component: () => import('../../components/functions/system/systemRoleManage/SystemRoleManage')
        },
        {
            path: '/console/system/branchRoleManage',
            name: 'branchRoleManage',
            component: () => import('../../components/functions/system/branchRoleManage/BranchRoleManage')
        },
        {
            path: '/console/system/accountManage',
            name: 'accountManage',
            component: () => import('../../components/functions/system/accountManage/AccountManage')
        },
        {
          path: '/console/system/collegeManage',
          name: 'collegeManage',
          component: () => import('../../components/functions/system/collegeManage/CollegeManage')
        },
        {
            path: '/console/system/setting',
            name: 'setting',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/system/setting/menuSetting',
                    name: 'menuSetting',
                    component: () => import('../../components/functions/system/setting/menuSetting/MenuSetting')
                },
                {
                    path: '/console/system/setting/systemSetting',
                    name: 'systemSetting',
                    component: () => import('../../components/functions/system/setting/settings/Settings')

                }
            ]
        },
        {
            path: '/console/system/templateManage',
            name: 'templateManage',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/system/templateManage/websitePage',
                    name: 'websitePageTemplate',
                    component: () => import('../../components/functions/system/templateManage/websitePage/WebsitePageTemplates')
                },
                {
                    path: '/console/system/templateManage/websiteModule',
                    name: 'websiteModuleTemplate',
                    component: () => import('../../components/functions/system/templateManage/websiteModule/WebsiteModuleTemplates')

                }
            ]
        },
        {
            path: '/console/system/adminLog',
            name: 'adminLog',
            component: () => import('../../components/functions/system/logManage/adminLog/AdminLog')
        },
        {
            path: '/console/system/userLog',
            name: 'userLog',
            component: () => import('../../components/functions/system/logManage/userLog/UserLog')
        },
        {
            path: '/console/system/labelManage',
            name: 'labelManage',
            component: () => import('../../components/functions/system/labelManage/LabelManage')
        },
        {
            path: '/console/system/labelManage/:classId',
            name: 'labelManage2',
            component: () => import('../../components/functions/system/labelManage/LabelManage')
        },
        {
            path: '/console/system/memberRole',
            name: 'memberRole',
            component: () => import('../../components/functions/system/memberPrivilege/memberRole/MemberRole')
        },
        {
            path: '/console/system/memberAccountRule',
            name: 'memberAccountRule',
            component: () => import('../../components/functions/system/memberPrivilege/memberAccountRule/MemberAccountRule')
        }
    ]
}
