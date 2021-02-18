export default {
    SET_LOGIN_USER_INFO(state, loginUser) {
        state.loginUser.phone = loginUser.phone;
        state.loginUser.name = loginUser.name;
        state.loginUser.headImg = loginUser.headImg;
        state.loginUser.adminType = loginUser.adminType;
        state.loginUser.adminId = loginUser.adminId;
        state.loginUser.lastLoginTime = loginUser.lastLoginTime;

        state.branchId = loginUser.branchId;
        state.privileges = loginUser.privileges.filter(item => item.menuType == "MENU");
        state.OPprivileges = loginUser.privileges.filter(item => item.menuType == "OP");
        state.FIELDprivileges = loginUser.privileges.filter(item => item.menuType == "FIELD");
        state.adminBranchList = loginUser.adminBranchList;
    },

    SET_SYSTEM_SETTING(state, setting) {
        state.systemSetting.systemName = setting.systemName;
        state.systemSetting.systemLogo = setting.systemLogo;
        state.systemSetting.systemFavicon = setting.systemFavicon;
        state.systemSetting.organizationName = setting.organizationName;
        state.systemSetting.welcomeSpeech = setting.welcomeSpeech;
        state.systemSetting.loginLogo = setting.loginLogo;
        state.systemSetting.loginBackground = setting.loginBackground;
        state.systemSetting.systemIntroduce = setting.systemIntroduce;
    },

    SET_SYSTEM_VERSION(state, version) {
        state.systemVersion = version;
    },

    SET_ALL_PRIVILEGES(state, allPrivileges) {
        state.allPrivileges = allPrivileges;
    },

    SET_MEMBER_ACCOUNT_RULES(state, rules) {
        state.memberAccountRules = rules;
    },

    SET_AREALIST(state, list) {
        state.areaList = list;
    },

    SET_FROMHOMEPAGE(state, type) {
        state.fromHomePageType = type;
    },

    SET_CURRENT_COLLEGE(state, college) {
        state.currentCollege = college;
    },

    SET_NOW_CHAT(state, data) {
        state.nowChat = data;
    }
};