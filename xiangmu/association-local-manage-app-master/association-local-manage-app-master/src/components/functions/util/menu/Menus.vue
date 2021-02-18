<template>
    <el-menu v-if="parentPrivilege" class="console-menu ybcusmenu" @select="handleSelect" :default-active="defaultActive" text-color="#fff" active-text-color="#6DC9CD" background-color="#28394B" unique-opened>
      <menu-item :chatNum="chatNum" :orderNum="orderNum"  v-for="item of privilegeTree" :key="item.id" :item="item"/>
      <!-- <menu-item  v-for="item of parentPrivilege.children" :key="item.id" :item="item"/> -->
    </el-menu>
</template>

<script>
    import MenuItem from "./MenuItem";
    import socket from './mixins/stomp'

    export default {
        name: "Menus",
        components: {MenuItem},
        mixins:[socket],
        data(){
            return {
                defaultActive: '',
                orderNum:0,
                chatNum:0
            }
        },
        computed:{
            query(){
                return this.$route.query;
            },
            menuId(){
                return this.$store.state.menuId;
            },
            privilegeTree(){
                return this.$store.getters.privilegeTree;
            },
            privileges(){
                return this.$store.getters.privileges;
            },
            privilegeByPath(){
                return this.$store.getters.getPrivilegeByMenuPath(this.$route.path,this.privileges);
            },
            privilegeById(){
                return this.$store.getters.getPrivilegeById(this.menuId,this.privileges);
            },
            nowPrivilege(){
                return this.privilegeById || this.privilegeByPath;
            },
            parentPrivilege(){
                if(this.nowPrivilege){
                    if(this.nowPrivilege.parentId){
                        return this.$store.getters.getPrivilegeByParentId(this.nowPrivilege.parentId, this.privileges, this.privilegeTree);
                    }else{
                        return this.$store.getters.getPrivilegeByParentId(this.nowPrivilege.id, this.privileges, this.privilegeTree);
                    }

                }else{
                    return [];
                }
            }
        },
        methods:{
            handleSelect(id) {
                this.defaultActive = id;
                let privilege = this.$store.getters.getPrivilegeById(id,this.privileges);

                if(privilege){
                    let {modulePath,children} = privilege;
                    if(children){
                        for(let _privilege of children){
                            let {modulePath: _modulePath} = _privilege;
                            if(_modulePath && _modulePath !== ''){
                                this.$router.push(_modulePath);
                                this.defaultActive = _privilege.id;
                                break;
                            }
                        }
                    }else{
                        if(modulePath && modulePath !== ''){
                            this.$router.push(modulePath);
                            this.defaultActive = privilege.id;
                        }
                    }
                }
            },
            getSelectByPath(){
                if(this.privilegeTree && this.privilegeTree.length > 0){
                    let path = this.$route.path;
                    let privilege = this.$store.getters.getPrivilegeByMenuPath(path, this.privilegeTree);
                    if(privilege){
                        let {modulePath,children} = privilege;
                        if(children && children.length > 0){
                            for(let _privilege of children){
                                let {modulePath: _modulePath} = _privilege;
                                if(_modulePath && _modulePath !== ''){
                                    let location = {path:_modulePath,query: this.query};
                                    this.$router.push(location);
                                    this.defaultActive = _privilege.id;
                                    return;
                                }
                            }
                        }else{
                            if(modulePath && modulePath !== ''){
                                let location = {path:modulePath,query: this.query};
                                this.$router.push(location);
                                this.defaultActive = privilege.id;
                            }
                        }
                    }
                }
            },
            // 获取订单数量
            getOrderNum(){
                this.$request.get('/api/admin/homePage/getOrderNumAndOnlineNum').then(res=>{
                    this.orderNum=res.data.goodWaitSendNum;
                    this.chatNum=res.data.leavingMessage;
                })
            },
            //获取人工智能在线数量
            getChatNum(res){
                let adminId=this.$store.state.loginUser.adminId;
                let num=0;
                let nowChat=this.$store.state.nowChat;
                JSON.parse(res.msgData).forEach(item=>{
                    if (item.split('-')[0]==adminId&&item.split('-')[1]!=nowChat) {
                        num++;
                    }
                });
                this.chatNum=num;
            }
        },
        mounted(){
            this.getSelectByPath();
            this.getOrderNum();
            this.$request
            .put("/api/admin/message/updateOnlineCustomerStatus?status=1")
            .then(res => {
                // console.log(res);
            });
            this.stompInit();
        },
        watch:{
            privileges(){
                this.getSelectByPath();
            },
            nowPrivilege(val){
                if(val){
                    this.defaultActive = val.id;
                }
            },
            menuId(){
                this.getSelectByPath();
            },
        }
    }
</script>


<style>
.ybcusmenu .el-menu-item{
  border-left: 3px solid transparent;
}
.ybcusmenu .el-menu-item.is-active{
  border-left: 3px solid #4FB6CC;
  background: #1F323F!important;
}
.ybcusmenu>.el-menu-item{
  padding-left: 15px!important;
}
.ybcusmenu>.el-submenu>.el-submenu__title{
  padding-left: 15px!important;
}
.ybcusmenu>li:first-child{
  border-bottom: 1px solid #1F323F;
}
.ybcusmenu>li:first-child.is-active{
  border-left: 3px solid transparent;
}
.ybcusmenu .el-menu-item,.ybcusmenu .el-submenu__title{
  height: 46px;
  line-height: 46px;
}
</style>
