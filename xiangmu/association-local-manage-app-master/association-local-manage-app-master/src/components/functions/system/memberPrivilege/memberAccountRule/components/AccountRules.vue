<template>
    <el-container>
        <el-main v-show="value.length>0" style="margin-bottom: 16px;" class="unset-padding">
            <div class="flex account-rule" v-for="(item,index) of value" :key="index">
                <div class="flex flex-column flex-center" style="margin-right: 8px;">
                    <el-button @click="deleteItem(index)" style="font-size: 16px;" size="medium" class="custom-el-button unset-padding danger" icon="el-icon-remove-outline" type="text"></el-button>
                </div>
                <div class="flex flex-fill-in-the-remaining-space">
                    <div class="flex flex-fill-in-the-remaining-space">
                        <div style="margin-right: 8px;">账号后缀:</div>
                        <el-input placeholder="请输入账号后缀" class="flex-fill-in-the-remaining-space" v-model="item.suffix"/>
                    </div>
                    <div class="flex flex-fill-in-the-remaining-space" style="margin-left: 16px;">
                        <div style="margin-right: 8px;">账号角色:</div>
                        <member-role-choose :props-roles="roles" class="flex-fill-in-the-remaining-space" v-model="item.roleId"/>
                    </div>
                </div>
            </div>
        </el-main>
        <el-footer height="auto" class="flex flex-column flex-center unset-padding">
            <div>
                <el-button icon="el-icon-plus" type="primary" @click="addItem">新增规则</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import MemberRoleChoose from "../../memberRole/components/MemberRoleChoose";
    export default {
        name: "AccountRules",
        components: {MemberRoleChoose},
        props:{
            value: Array
        },
        data(){
            return {
                roles: []
            }
        },
        methods:{
            getRoles(){
                this.$request.get('/api/admin/group/getGroup', {params: {type: '8'}}).then(res => {
                    this.roles = res.data;
                });
            },
            addItem(){
                this.value.push({suffix:'',roleId:''})
            },
            deleteItem(index){
                this.value.splice(index,1);
            }
        },
        created() {
            this.getRoles();
        }
    }
</script>
<style lang="less">
    .account-rule{
        &:not(:last-child){
            margin-bottom: 16px;
        }
    }
</style>
