export default [
  {
    path: "/branchEditView/:mpId",
    component: () =>
      import(
        "../../components/functions/organization/branchEditView/branchEditView.vue"
      ),
    name: "branchEditView",
    children: [
      {
        path: "/branchEditView/joinApplication/:branchId",
        name: "/branchEditView/joinApplication",
        component: () =>
          import(
            "../../components/functions/organization/joinApplication/joinApplication.vue"
          )
      },
      {
        path: "/branchEditView/memberManage",
        name: "/branchEditView/memberManage",
        component: () =>
          import(
            "../../components/functions/organization/memberManage/memberManage.vue"
          )
      },
      {
        path: "/branchEditView/branchInfoEdit",
        name: "/branchEditView/branchInfoEdit",
        component: () =>
          import(
            "../../components/functions/organization/branchInfoEdit/branchInfoEdit.vue"
          )
      },
      {
        path: "/branchEditView/informationExchange",
        name: "BranchInformationExchange",
        component: () =>
          import(
            "../../components/functions/tools/trends/informationExchange/BranchInformationExchange"
          )
      },
      {
        path: "/branchEditView/BranchContentManage",
        name: "BranchContentManage",
        component: () =>
          import(
            "../../components/functions/tools/content/contentManage/BranchContentManage"
          )
      },
      {
        path: "/branchEditView/activityExamine",
        name: "/branchEditView/activityExamine",
        component: () => import( "../../components/functions/tools/activity/activityExamine/BranchActivityExamine.vue" )
      },
      {
        path: "/branchEditView/activityList/:branchId",
        name: "/branchEditView/activityList",
        component: () =>
          import(
            "../../components/functions/organization/activityList/activityList.vue"
          )
      },
      {
        path: "/branchEditView/activityType/:branchId",
        name: "/branchEditView/activityType",
        component: () =>
          import(
            "../../components/functions/organization/activityType/activityType.vue"
          )
      },
      {
        path: "/branchEditView/guestManage/:branchId",
        name: "/branchEditView/guestManage",
        component: () =>
          import(
            "../../components/functions/organization/guestManage/guestManage.vue"
          )
      }
    ]
  }
];
