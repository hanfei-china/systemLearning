<template>
    <black-side-functions-layout @title-click="$router.push('/console/tools/onlineForm')" title-hover v-if="formInfo">
        <template v-slot:header>
            <div style="color: #ffffff;height: 100%;line-height: 40px;font-size: 16px;">{{`【${formInfo.formTitle}】表单管理`}}</div>
        </template>
        <template v-slot:sideFunctions>
            <el-menu :default-openeds="['/onlineForm']" class="console-menu" @select="handleSelect" :default-active="$route.name">
                <el-submenu index="/onlineForm">
                    <template slot="title">
                        <i class="console-menu-icon el-icon-s-management"/>
                        <span>表单设置</span>
                    </template>
                    <el-menu-item index="/onlineForm/:formId/setting">
                        <i class="console-menu-icon el-icon-setting"/>
                        <span>基础设置</span>
                    </el-menu-item>
                    <el-menu-item index="/onlineForm/:formId/design">
                        <i class="console-menu-icon el-icon-help"/>
                        <span>字段设计</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="/onlineForm/:formId/dataManage">
                    <i class="console-menu-icon el-icon-s-data"/>
                    <span>数据管理</span>
                </el-menu-item>
            </el-menu>
        </template>
        <template>
            <router-view/>
        </template>
    </black-side-functions-layout>
</template>

<script>
    import BlackSideFunctionsLayout from "../../../../layout/BlackSideFunctionsLayout";
    import FormBuilder from '../js/formBuilder';

    export default {
        name: "OnlineFormManage",
        components: {BlackSideFunctionsLayout},
        data() {
            return {
                formInfo: null,
            }
        },
        computed:{
            formId(){
                return this.$route.params.formId;
            },
            systemName(){
                return this.$store.state.systemSetting.systemName;
            }
        },
        methods: {
            handleSelect(index) {
                let path = index.replace(':formId',this.formId);
                this.$router.push(path);
            },
            getFormInfo() {
                this.$request.get('/api/admin/onlineForm', {
                    params: {id: this.formId}
                }).then(res => {
                    this.formInfo = new FormBuilder(res.data);
                })
            },
        },
        created() {
            this.getFormInfo();
        }
    }
</script>
