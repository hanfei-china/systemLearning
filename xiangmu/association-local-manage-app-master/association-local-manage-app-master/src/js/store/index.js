import mutations from './mutations';
import $request from '../../js/config/requestConfig';

//转换方法，不具有通用性
let translator = (parents, children) => {

    //遍历父节点数据
    parents.forEach(parent => {
        //遍历子节点数据
        children.forEach((current, index) => {
            //若该节点是对应的父级节点的子节点
            if (current.parentId === parent.id) {
                //深拷贝一份子节点数组
                let temp = JSON.parse(JSON.stringify(children));
                //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                temp.splice(index, 1);
                //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                translator([current], temp);
                //把找到子节点放入父节点的children属性中
                parent.children ? parent.children.push(current) : parent.children = [current];
            }
        });
    });

};

let translator2 = (parents, children, result) => {

    //遍历父节点数据
    parents.forEach(parent => {
        result.push(parent);
        //遍历子节点数据
        children.forEach((current, index) => {
            //若该节点是对应的父级节点的子节点
            if (current.parentId === parent.id) {
                //深拷贝一份子节点数组
                let temp = JSON.parse(JSON.stringify(children));
                //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                temp.splice(index, 1);
                //把找到子节点放入设置父级放入result
                current.parentId = parent.id;
                parent.children ? parent.children.push(current) : parent.children = [current];
                //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                translator2([current], temp, result);
            }
        });
    });

};

let getPrivilegeByParentId = (parentId, privileges, privilegeTree) => {
    let targetId = parentId;
    let target = privileges.find(privilege => privilege.id === parentId);

    if (target) {
        let targetParentId = target.parentId;
        if (!targetParentId) {
            return privilegeTree.find(privilege => privilege.id === targetId);
        } else {

            return getPrivilegeByParentId(target.parentId, privileges, privilegeTree);
        }
    } else {
        return null;
    }

};

let compare = (src, target) => {
    let { menuSort: srcMenuSort } = src;
    let { menuSort: targetMenuSort } = target;
    if (srcMenuSort < targetMenuSort) {
        return -1;
    } else if (srcMenuSort > targetMenuSort) {
        return 1;
    } else {
        return 0;
    }
};

export default {
    state: {
        loginUser: {
            phone: '',
            name: '',
            headImg: null,
            adminType: null,
            adminId: '',
            lastLoginTime: ''
        },
        currentCollege: null,
        privileges: [],
        OPprivileges: [],
        FIELDprivileges: [],
        branchId: '',
        adminBranchList: [],

        systemSetting: {
            systemName: "系统加载中...",
            systemLogo: "",
            systemFavicon: "",
            welcomeSpeech: "",
            organizationName: "",
            loginLogo: "",
            loginBackground: "",
            systemIntroduce: ""
        },

        vodAppId: '1258290975',
        menuId: '',

        systemVersion: '1.0.0',

        allPrivileges: [],

        memberAccountRules: {
            accountField: null,
            registerRules: [],
            importRules: []
        },
        areaList: [],
        fromHomePageType: "",
        nowChat: ''
    },
    mutations,
    actions: {
        updateAllPrivilege({ commit }) {
            $request.get('/api/admin/menuSetting/anon/menuList').then(res => {
                let allPrivilege = res.data;
                commit('SET_ALL_PRIVILEGES', allPrivilege);
            })
        },
        setMemberAccountRules({ commit }) {
            $request.get('/api/admin/settings/manage/getCommonSetting', { params: { type: 16 } }).then(res => {
                commit('SET_MEMBER_ACCOUNT_RULES', res.data);
            })
        },
    },
    getters: {
        privileges(state) {
            if (state.privileges && state.privileges.length > 0) {
                let allPrivilege = JSON.parse(JSON.stringify(state.privileges));
                allPrivilege.sort(compare);
                allPrivilege.map(privilege => {
                    let { modulePath, moduleParam } = privilege;

                    if (moduleParam) {
                        privilege.modulePath = modulePath + '/' + moduleParam;
                    }
                });
                return allPrivilege;
            } else {
                return [];
            }
        },
        //获取权限树
        privilegeTree(state) {
            if (state.privileges && state.privileges.length > 0) {
                let allPrivilege = JSON.parse(JSON.stringify(state.privileges));
                allPrivilege.sort(compare);
                allPrivilege.map(privilege => {
                    let { modulePath, moduleParam } = privilege;

                    if (moduleParam) {
                        privilege.modulePath = modulePath + '/' + moduleParam;
                    }
                });

                let parents = allPrivilege.filter(privilege => {
                    return !privilege.parentId;
                });

                let children = allPrivilege.filter(privilege => {
                    return privilege.parentId;
                });

                translator(parents, children);
                return parents;
            } else {
                return [];
            }
        },
        privilegeNodes(state) {
            if (state.privileges && state.privileges.length > 0) {
                let allPrivilege = JSON.parse(JSON.stringify(state.privileges));
                allPrivilege.sort(compare);
                allPrivilege.map(privilege => {
                    let { modulePath, moduleParam } = privilege;

                    if (moduleParam) {
                        privilege.modulePath = modulePath + '/' + moduleParam;
                    }
                });

                let parents = allPrivilege.filter(privilege => {
                    return !privilege.parentId;
                });

                let children = allPrivilege.filter(privilege => {
                    return privilege.parentId;
                });

                let results = [];
                translator2(parents, children, results);
                return results;
            } else {
                return [];
            }
        },
        getPrivilegeById: () => (id, privileges) => {
            return privileges.find(privilege => privilege.id === id);
        },
        getPrivilegeByParentId: () => (parentId, privileges, privilegeTree) => {
            return getPrivilegeByParentId(parentId, privileges, privilegeTree);
        },
        getPrivilegeByMenuPath: () => (path, privileges) => {
            return privileges.find(privilege => privilege.modulePath === path);
        },
        getFirstAvailableMenu: (state, getters) => {
            let privilegeTree = getters.privilegeTree;
            for (let privilege of privilegeTree) {
                let { modulePath, children } = privilege;
                if (modulePath && modulePath !== '') {
                    return privilege;
                } else {
                    if (children) {
                        for (let _privilege of children) {
                            let { modulePath: _modulePath } = _privilege;
                            if (_modulePath && _modulePath !== '') {
                                return privilege;
                            }
                        }
                    }
                }
            }
            return null;
        }
    }
}