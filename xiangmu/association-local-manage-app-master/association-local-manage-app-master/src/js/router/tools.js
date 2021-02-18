export default {
    path: '/console/tools',
    name: 'tools',
    component: {render: h => h('router-view')},
    children:[
        {
            path: '/console/tools/siteDesign',
            name: 'siteDesign',
            component: () => import('../../components/functions/tools/websitePro/component/manage/DesignBase')
        },
        {
            path: '/console/tools/mpDesign',
            name: 'mpDesign',
            component: () => import('../../components/functions/tools/mpDesign/routerView/MyManage')
        },
        {
            path: '/console/tools/portalDesign/:moduleId' ,
            name: 'portalManage',
            component: () => import('../../components/functions/tools/websitePro/component/design/portalDesign/PortalManage')
        },
        {
            path: '/console/tools/carouselPicture',
            name: 'carouselPicture',
            component: () => import('../../components/functions/tools/carouselPicture/CarouselPicture')
        },
        {
            path: '/console/tools/noticeManage',
            name: 'carouselPicture',
            component: () => import('../../components/functions/tools/noticeManage/NoticeManage')
        },
        {
            path: '/console/tools/contentManage',
            name: 'contentManage',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/tools/contentManage/contentList',
                    name: 'contentList',
                    component: () => import('../../components/functions/tools/content/contentManage/ContentManage')
                },
                {
                    path: '/console/tools/contentManage/contentList/:classId',
                    name: 'singleContentList',
                    component: () => import('../../components/functions/tools/content/contentManage/ContentManage')
                },
                {
                    path: '/console/tools/contentManage/contentClass',
                    name: 'contentClass',
                    component: () => import('../../components/functions/tools/content/contentClassManage/ContentClassManage')
                },
            ]
        },
        {
          path: '/console/tools/contentComments',
          name: 'contentComments',
          component: () => import('../../components/functions/tools/content/contentComments/ContentComments'),
        },
        {
            path: '/console/tools/activityManage',
            name: 'activityManage',
            component: () => import('../../components/functions/tools/activity/activityList/ActivityList'),
        },
        {
            path: '/console/tools/activeForm',
            name: 'activeForm',
            component: () => import('../../components/functions/tools/activity/activityManage/ActiveForm')
        },
        {
            path: '/console/tools/activityExamine',
            name: 'activityExamine',
            component: () => import('../../components/functions/tools/activity/activityExamine/ActivityExamine'),
        },
        {
            path: '/console/tools/activityType',
            name: 'activityType',
            component: () => import('../../components/functions/tools/activity/activityType/ActivityType'),
        },
        {
            path: '/console/tools/guestManage',
            name: 'guestManage',
            component: () => import('../../components/functions/tools/activity/activityManage/guestManage/GuestManage'),
        },
        {
            path: '/console/tools/onlineForm',
            name: 'onlineForm',
            component: () => import('../../components/functions/tools/onlineForm/OnlineFormList')
        },
        {
            path: '/console/tools/onlineForm/dataManage/:formId',
            name: 'onlineFormDataManage',
            component: () => import('../../components/functions/tools/onlineForm/setting/OnlineFormDataManage'),
        },
        {
            path: '/console/tools/onlineForm/classManage',
            name: 'onlineFormClassManage',
            component: () => import('../../components/functions/tools/onlineForm/onlineFormClassManage/OnlineFormClassManage')

        },
        {
            path: '/console/tools/onlineForm/:classId',
            name: 'singleOnlineFormList',
            component: () => import('../../components/functions/tools/onlineForm/OnlineFormList')
        },
        {
            path: '/console/tools/onlineDonation',
            name: 'onlineDonation',
            component: () => import('../../components/functions/tools/onlineDonation/OnlineDonationManage')
        },
        {
            path: '/console/tools/onlineDonation/classManage',
            name: 'onlineDonationClassManage',
            component: () => import('../../components/functions/tools/onlineDonation/onlineDonationClassManage/OnlineDonationClassManage')
        },
        {
            path: '/console/tools/onlineDonation/donationRecord',
            name: 'onlineDonationRecord',
            component: () => import('../../components/functions/tools/onlineDonation/OnlineDonationRecordList')
        },
        {
            path: '/console/tools/onlineDonation/:classId',
            name: 'singleOnlineDonationList',
            component: () => import('../../components/functions/tools/onlineDonation/OnlineDonationManage')
        },
        {
            path: '/console/tools/counsel',
            name: 'counsel',
            component: () => import('../../components/functions/tools/psychologyCounse/PsychologyCounse')
        },
        {
            path: '/console/tools/integralManage',
            name: 'integralManage',
            component: () => import('../../components/functions/tools/integral/IntegralManage')
        },
        {
            path: '/console/tools/educationManage',
            name: 'educationManage',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/tools/educationManage/courseTypeManage',
                    name: 'courseTypeManage',
                    component: () => import('../../components/functions/tools/educationManage/courseTypeManage/CourseTypeManage')
                },
                {
                    path: '/console/tools/educationManage/courseManage',
                    name: 'courseManage',
                    component: () => import('../../components/functions/tools/educationManage/courseManage/CourseManage')
                },
                {
                    path: '/console/tools/educationManage/lecturerManage',
                    name: 'lecturerManage',
                    component: () => import('../../components/functions/tools/educationManage/lecturerManage/LecturerManage')
                },
                {
                    path: '/console/tools/educationManage/courseOrderManage',
                    name: 'courseOrderManage',
                    component: () => import('../../components/functions/tools/educationManage/courseOrderManage/CourseOrderManage')
                }
            ]
        },
        {
            path: '/console/tools/album',
            name: 'album',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/tools/album/examine',
                    name: 'pictureExamine',
                    component: () => import('../../components/functions/tools/album/pictureExamine/PictureExamine')
                },
                {
                    path: '/console/tools/album/manage',
                    name: 'albumManage',
                    component: () => import('../../components/functions/tools/album/albumManage/AlbumManage')
                }
            ]
        },
        {
            path: '/console/tools/trendManage',
            name: 'trendManage',
            component: () => import('../../components/functions/tools/trends/trendManage/TrendManage')
        },
        {
            path: '/console/tools/informationExchange',
            name: 'informationExchange',
            component: () => import('../../components/functions/tools/trends/informationExchange/InformationExchange')
        },
        {
            path: '/console/tools/onlineMall',
            name: 'onlineMall',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/tools/onlineMall/goodsManage',
                    name: 'goodsManage',
                    component: () => import('../../components/functions/tools/onlineMall/goodsManage/GoodsManage')
                },
                {
                    path: '/console/tools/onlineMall/goodsClassManage',
                    name: 'goodsClassManage',
                    component: () => import('../../components/functions/tools/onlineMall/goodsClassManage/GoodsClassManage')
                },
                {
                    path: '/console/tools/onlineMall/goodsOrderManage',
                    name: 'goodsOrderManage',
                    component: () => import('../../components/functions/tools/onlineMall/goodsOrderManage/GoodsOrderManage')
                }
            ]
        },
        {
            path: '/console/tools/onlineCounsel',
            name: 'onlineCounsel',
            component: {render: h => h('router-view')},
            children:[
                {
                    path: '/console/tools/onlineCounsel/typeManage',
                    name: 'typeManage',
                    component: () => import('../../components/functions/tools/onlineCounsel/typeManage/TypeManage')
                },
                {
                    path: '/console/tools/onlineCounsel/listManage',
                    name: 'listManage',
                    component: () => import('../../components/functions/tools/onlineCounsel/listManage/ListManage')
                },
                {
                    path: '/console/tools/onlineCounsel/listManage/:formId',
                    name: 'listManageForOne',
                    component: () => import('../../components/functions/tools/onlineCounsel/listManage/ListManage')
                },
                {
                    path: '/console/tools/onlineCounsel/commentList',
                    name: 'commentList',
                    component: () => import('../../components/functions/tools/onlineCounsel/listManage/commentList')
                },
                {
                    path: '/console/tools/onlineCounsel/chatList',
                    name: 'chatList',
                    component: () => import('../../components/functions/tools/onlineCounsel/chatList/chatList')
                },
                {
                    path: '/console/tools/onlineCounsel/QuestionBank',
                    name: 'QuestionBank',
                    component: () => import('../../components/functions/tools/onlineCounsel/QuestionBank/QuestionBank')
                },
                {
                    path: '/console/tools/onlineCounsel/trainLearning',
                    name: 'trainLearning',
                    component: () => import('../../components/functions/tools/onlineCounsel/trainLearning/trainLearning')
                },
            ]
        },
    ]
}
