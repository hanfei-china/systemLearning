export default {
  path: "/console/examine",
  name: "examine",
  component: { render: h => h("router-view") },
  children: [
    {
      path: "/console/examine/memberInfoExamine",
      name: "memberInfoExamine",
      component: () =>
        import("../../components/functions/examine/memberExamine/MemberExamine")
    },
    {
      path: "/console/examine/memberCardExamine",
      name: "memberCardExamine",
      component: () =>
        import("../../components/functions/examine/memberCardExamine/MemberExamine")
    },
    {
      path: "/console/examine/memberMerge",
      name: "memberInfoExamine",
      component: () =>
        import("../../components/functions/examine/memberMerge/memberMerge")
    },
    {
      path: "/console/examine/branchApplyExamine",
      name: "branchApplyExamine",
      component: () =>
        import("../../components/functions/examine/branchApply/BranchApply")
    },
    {
      path: "/console/examine/multiProcessMemberInfoExamine",
      name: "multiProcessMemberInfoExamine",
      component: () =>
        import(
          "../../components/functions/examine/multiProcessMemberInfoExamine/MultiProcessMemberInfoExamine"
        )
    },
    {
      path: "/console/examine/membershipChangeExamine",
      name: "membershipChangeExamine",
      component: () =>
        import(
          "../../components/functions/examine/membershipChange/MembershipChange"
        )
    },
    {
      path: "/console/examine/branchQuitExamine",
      name: "branchQuitExamine",
      component: () =>
        import("../../components/functions/examine/branchQuit/BranchQuit")
    },
    {
      path: "/console/examine/allBranchQuitExamine",
      name: "allBranchQuitExamine",
      component: () =>
        import("../../components/functions/examine/allBranchQuit/AllBranchQuit")
    },
    {
      path: "/console/examine/createBranchApplyExamine",
      name: "createBranchApplyExamine",
      component: () =>
        import("../../components/functions/examine/createBranchApplyExamine/CreateBranchApplyExamine")
    }
  ]
};
