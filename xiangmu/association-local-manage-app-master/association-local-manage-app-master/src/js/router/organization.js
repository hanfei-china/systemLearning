export default {
    path: "/console/organization",
    name: "organization",
    component: { render: h => h("router-view") },
    children: [{
            path: "/console/organization/member",
            name: "member",
            component: { render: h => h("router-view") },
            children: [{
                    path: "/console/organization/member/allMember",
                    name: "allMember",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/allMember/AllMember"
                        )
                },
                {
                    path: "/console/organization/member/studentArchive",
                    name: "studentArchive",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/studentArchive/Index"
                        )
                },
                {
                    path: "/console/organization/member/studentArchiveMerge",
                    name: "studentArchiveMerge",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/studentArchive/studentArchiveMerge/studentArchiveMerge"
                        )
                },
                {
                    path: "/console/organization/member/teacherArchive",
                    name: "teacherArchive",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/teacherArchive/Index"
                        )
                },
                {
                    path: "/console/organization/member/teacherArchiveMerge",
                    name: "teacherArchiveMerge",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/teacherArchive/teacherArchiveMerge/teacherArchiveMerge"
                        )
                },
                {
                    path: "/console/organization/member/branchMember",
                    name: "memberManage",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberManage/MemberManage"
                        )
                },
                {
                    path: "/console/organization/member/memberFieldManage",
                    name: "memberFieldManage",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberField/MemberFieldManage"
                        )
                },
                {
                    path: "/console/organization/member/enumDictionaryManage",
                    name: "enumDictionaryManage",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberEnumDictionary/EnumDictionaryManage"
                        )
                },
                {
                    path: "/console/organization/member/memberInfoStatistics",
                    name: "memberInfoStatistics",
                    component: () =>
                        import (
                            "../../components/functions/organization/memberInfoStatistics/MemberInfoStatistics"
                        )
                },
                // {
                //     path: '/console/organization/member/memberMatch',
                //     name: 'memberMatch',
                //     component: () =>
                //         import ('../../components/functions/organization/member/memberMatch/MemberMatch')
                // },
                {
                    path: "/console/organization/member/memberMatch",
                    name: "memberMatch",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/alumniMatch/alumniMatch.vue"
                        )
                },
                {
                    path: "/console/organization/member/alumniConfirm",
                    name: "alumniConfirm",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/alumniConfirm/alumniConfirm.vue"
                        )
                },
                {
                    path: "/console/organization/member/alumniUpdata",
                    name: "alumniUpdata",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/alumniUpdata/alumniUpdata.vue"
                        )
                },
                {
                    path: "/console/organization/member/memberFaceStore",
                    name: "memberFaceStore",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberFaceStore/MemberFaceStore"
                        )
                },
                {
                    path: "/console/organization/member/memberAccount",
                    name: "memberAccount",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberAccount/MemberAccount"
                        )
                },
                {
                    path: "/console/organization/member/examineCenter",
                    name: "examineCenter",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/examineCenter/ExamineCenter"
                        )
                },
                {
                    path: "/console/organization/member/memberContacts",
                    name: "memberContacts",
                    component: () =>
                        import (
                            "../../components/functions/organization/member/memberContacts/MemberContacts"
                        )
                },
                {
                  path: "/console/organization/member/memberCard",
                  name: "memberCard",
                  component: () =>
                    import (
                      "../../components/functions/organization/member/memberCard/Index"
                      )
                }
            ]
        },

        {
            path: "/console/organization/notice",
            name: "notice",
            component: { render: h => h("router-view") },
            children: [{
                    path: "/console/organization/notice/emailNotice",
                    name: "emailNotice",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/emailNotice/EmailNotice"
                        )
                },
                {
                    path: "/console/organization/notice/sendEmail",
                    name: "sendEmail",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/sendEmail/sendEmail.vue"
                        )
                },
                {
                    path: "/console/organization/notice/sendSms",
                    name: "sendSms",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/sendSms/index.vue"
                        )
                },
                {
                    path: "/console/organization/notice/emailList",
                    name: "emailList",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/emailList/emailList.vue"
                        )
                },
                {
                    path: "/console/organization/notice/smsList",
                    name: "smsList",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/smsList/smsList.vue"
                        )
                },
                {
                    path: "/console/organization/notice/emailTemplate",
                    name: "emailTemplate",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/emailTemplate/EmailTemplate"
                        )
                },
                {
                    path: "/console/organization/notice/systemNotice",
                    name: "systemNotice",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/systemNotice/SystemNotice"
                        )
                },
                {
                    path: "/console/organization/notice/smsTemplate",
                    name: "smsTemplate",
                    component: () =>
                        import (
                            "../../components/functions/organization/notice/smsTemplate/SmsTemplate"
                            )
                },
            ]
        },
        //会议相关
        {
            path: "/console/organization/meetingManage",
            name: "meetingManage",
            component: () =>
                import (
                    "../../components/functions/organization/member/meeting/meetingManage/MeetingManage"
                )
        },
        {
            path: "/console/organization/meetingTypeManage",
            name: "meetingTypeManage",
            component: () =>
                import (
                    "../../components/functions/organization/member/meeting/meetingTypeManage/MeetingTypeManage"
                )
        },

        {
            path: "/console/organization/feedbackManage",
            name: "feedbackManage",
            component: () =>
                import (
                    "../../components/functions/organization/feedback/feedbackManage/FeedbackManage"
                )
        },
        {
            path: "/console/organization/branch",
            name: "branch",
            component: () =>
                import (
                    "../../components/functions/organization/branchManage/branchListManage.vue"
                )
        },
        {
            path: "/console/organization/branchApprove",
            name: "branchApprove",
            component: () =>
                import (
                    "../../components/functions/organization/branchApprove/branchApprove.vue"
                )
        },
        {
            path: "/console/organization/duesManage",
            name: "duesManage",
            component: () =>
                import ("../../components/functions/organization/duesSetting/DuesManage")
        },
        {
            path: "/console/organization/duesType",
            name: "duesType",
            component: () =>
                import (
                    "../../components/functions/organization/duesTypeManage/DuesTypeManage"
                )
        },
        {
            path: "/console/organization/certificateDesign",
            name: "certificateDesign",
            component: () =>
                import (
                    "../../components/functions/organization/certificateManage/certificateDesign/CertificateDesign"
                )
        },
        {
            path: "/console/organization/certificateQuery",
            name: "certificateQuery",
            component: () =>
                import (
                    "../../components/functions/organization/certificateManage/certificateQuery/CertificateQuery"
                )
        },
        {
            path: "/console/organization/postManage",
            name: "postManage",
            component: () =>
                import ("../../components/functions/organization/postManage/PostManage")
        },
        {
            path: "/console/organization/memberTypeManage",
            name: "memberTypeManage",
            component: () =>
                import (
                    "../../components/functions/organization/memberTypeManage/MemberTypeContainer"
                )
        },
        {
            path: "/console/organization/applicationManage",
            name: "applicationManage",
            component: () =>
                import (
                    "../../components/functions/organization/memberTypeManage/ApplicationContainer"
                )
        },
        {
            path: "/console/organization/historyDepartmentManage",
            name: "applicationManage",
            component: () =>
                import (
                    "../../components/functions/organization/historyDepartment/Index"
                )
        },
        {
            path: "/console/organization/flowManage",
            name: "flowManage",
            component: () =>
                import ("../../components/functions/organization/flowManage/FlowManage")
        },
        {
            path: "/console/organization/flowDesign",
            name: "flowDesign",
            component: () =>
                import ("../../components/functions/organization/flowDesign/FlowDesign")
        },
        {
            path: "/console/organization/industryManage",
            name: "industryManage",
            component: () =>
                import (
                    "../../components/functions/organization/industryUnit/industryManage/IndustryManage"
                )
        },
        {
            path: "/console/organization/unitManage",
            name: "unitManage",
            component: () =>
                import (
                    "../../components/functions/organization/industryUnit/unitManage/UnitManage"
                )
        },
        {
            path: "/console/organization/unitExamine",
            name: "unitExamine",
            component: () =>
                import (
                    "../../components/functions/organization/industryUnit/unitExamine/UnitExamine"
                )
        },
        {
            path: "/console/organization/unitSales",
            name: "unitSales",
            component: () =>
                import (
                    "../../components/functions/organization/industryUnit/unitSales/UnitSales"
                )
        },
        {
            path: "/console/organization/digitalMap",
            name: "digitalMap",
            component: () =>
                import ("../../components/functions/organization/digitalMap/DigitalMap")
        },
        {
            path: "/console/organization/visitManage",
            name: "visitManage",
            component: { render: h => h("router-view") },
            children: [{
                    path: "/console/organization/visitManage/visitRecord",
                    name: "visitRecord",
                    component: () =>
                        import (
                            "../../components/functions/organization/visitManage/visitRecord/VisitRecord"
                        )
                },
                {
                    path: "/console/organization/visitManage/visitType",
                    name: "visitType",
                    component: () =>
                        import (
                            "../../components/functions/organization/visitManage/visitType/VisitType"
                        )
                }
            ]
        },
        {
            path: "/console/organization/couponRecords",
            name: "couponRecords",
            component: () =>
                import (
                    "../../components/functions/organization/industryUnit/couponRecords/CouponRecords"
                )
        },
        {
            path: "/console/organization/ledgerManage",
            name: "ledgerManage",
            component: () =>
                import (
                    "../../components/functions/organization/ledger/ledgerManage/LedgerManage"
                )
        },
        {
            path: "/console/organization/ledgerQuery",
            name: "ledgerQuery",
            component: () =>
                import (
                    "../../components/functions/organization/ledger/ledgerQuery/LedgerQuery"
                )
        }
    ]
};
