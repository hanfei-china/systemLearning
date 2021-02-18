export default [{
        path: '/mpDesign/:mpId',
        component: () =>
            import ('../../components/functions/tools/mpDesign/routerView/mpManage/MpDesignContainer'),
        name: 'mpDesignView'
    },
    {
        path: "/template/design/:templateId",
        component: () =>
            import ('../../components/functions/system/templateManage/common/templateDesign/TemplateDesign'),
        name: 'templateDesign'
    },
    {
        path: "/template/preview/:templateId",
        component: () =>
            import ('../../components/functions/system/templateManage/common/templatePreview/TemplatePreview'),
        name: 'templatePreview'
    },
    {
        path: "/website/design/:moduleId/header",
        component: () =>
            import ('../../components/functions/tools/websitePro/component/design/HeaderDesign'),
        name: 'websiteProHeaderDesign'
    },
    {
        path: "/website/design/:moduleId/footer",
        component: () =>
            import ('../../components/functions/tools/websitePro/component/design/FooterDesign'),
        name: 'websiteProFooterDesign'
    },
    {
        path: "/website/design/:moduleId/main",
        component: () =>
            import ('../../components/functions/tools/websitePro/component/design/MainDesign'),
        name: 'websiteProMainDesign'
    },
    {
        path: "/page/:moduleId",
        component: () =>
            import ('../../components/functions/tools/websitePro/component/view/Page'),
        name: 'page'
    },
    {
        path: '/portal/design/:moduleId',
        name: 'portalDesign',
        component: () =>
            import ('../../components/functions/tools/websitePro/component/design/portalDesign/PortalDesign')
    },
    {
        path: '/pdfTemplate/design/:moduleId',
        name: 'pdfTemplateDesign',
        component: () =>
            import ('../../components/functions/tools/websitePro/component/design/pdfTemplateDesign/PDFTemplateDesign')
    },
    {
        path: '/addActivity/:branchId',
        name: 'addActivity',
        component: () =>
            import ('../../components/functions/tools/activity/addActivity/AddActivity'),
    },
    {
        path: '/uploadPosters',
        name: 'uploadPosters',
        component: () =>
            import ('../../components/functions/tools/activity/uploadPosters/UploadPosters'),
    },
    {
        path: '/activeForm/:activityId',
        component: () =>
            import ('../../components/functions/tools/activity/activityManage/ActiveForm'),
        children: [{
                path: '/activeForm/:activityId/editActivity',
                name: '/activeForm/:activityId/editActivity',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/editActivity/EditActivity'),
            },
            {
                path: '/activeForm/:activityId/orderList',
                name: '/activeForm/:activityId/orderList',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/orderList/OrderList'),
            },
            {
                path: '/activeForm/:activityId/activitySignIn',
                name: '/activeForm/:activityId/activitySignIn',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/activitySignIn/ActivitySignIn'),
            },
            {
                path: '/activeForm/:activityId/qrCode',
                name: '/activeForm/:activityId/qrCode',
                component: () =>
                    import ('../../components/functions/tools/activity/qrCode/QrCodeManage'),
            },
            {
                path: '/activeForm/:activityId/guestManage',
                name: '/activeForm/:activityId/guestManage',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/guestManage/ActivityGuestManage'),
            },
            {
                path: '/activeForm/:activityId/activityComments',
                name: '/activeForm/:activityId/activityComments',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/activityComments/ActivityComments'),
            },
            {
                path: '/activeForm/:activityId/activityPictures',
                name: '/activeForm/:activityId/activityPictures',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/activityPictures/ActivityPictures'),
            },
            {
                path: '/activeForm/:activityId/messageManage/sendMessage',
                name: '/activeForm/:activityId/messageManage/sendMessage',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/messageManage/sendMessage/SendMessage'),
            },
            {
                path: '/activeForm/:activityId/messageManage/configurationMessage',
                name: '/activeForm/:activityId/messageManage/configurationMessage',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/messageManage/configurationMessage/ConfigurationMessage'),
            },
            {
                path: '/activeForm/:activityId/activityDesign',
                name: '/activeForm/:activityId/activityDesign',
                component: () =>
                    import ('../../components/functions/tools/activity/activityManage/activityDesign/ActivityDesign'),
            },
        ]
    },

    {
        path: '/onlineForm/:formId',
        component: () =>
            import ('../../components/functions/tools/onlineForm/setting/OnlineFormManage'),
        children: [{
                path: '/onlineForm/:formId/setting',
                name: '/onlineForm/:formId/setting',
                component: () =>
                    import ('../../components/functions/tools/onlineForm/setting/OnlineFormSetting'),
            },
            {
                path: '/onlineForm/:formId/design',
                name: '/onlineForm/:formId/design',
                component: () =>
                    import ('../../components/functions/tools/onlineForm/setting/OnlineFormDesign'),
            },
            {
                path: '/onlineForm/:formId/dataManage',
                name: '/onlineForm/:formId/dataManage',
                component: () =>
                    import ('../../components/functions/tools/onlineForm/setting/OnlineFormDataManage'),
            },
        ]
    },

    {
        path: '/albumHomepage/:moduleId',
        name: 'albumHomepage',
        component: () =>
            import ('../../components/functions/tools/album/albumHomepage/AlbumHomepage'),
    },
    {
        path: '/contentDetail/:contentId',
        name: 'contentDetail',
        component: () =>
            import ('../../components/functions/tools/content/contentManage/ContentDetail'),
    },
    {
        path: '/graduationPhotoEnquiry/academyList',
        name: 'academyList',
        component: () =>
            import ('../../components/functions/tools/album/graduationPhotoEnquiry/AcademyList'),
    },
]