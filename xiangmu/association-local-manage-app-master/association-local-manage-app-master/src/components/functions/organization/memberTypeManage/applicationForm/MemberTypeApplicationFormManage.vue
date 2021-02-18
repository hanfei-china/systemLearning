<template>
    <el-container class="absolute-fill-parent" style="padding: 0 16px;top:15px;">
        <el-header class="flex flex-column flex-center unset-padding" height="auto" style="padding-bottom: 16px !important;">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">

                </div>
                <el-button size="small" type="primary" @click="newApplicationForm">新增申请表</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-table class="custom-el-table header-gray" height="100%" :data="formList" border stripe size="small">
                <el-table-column label="序号" width="50" align="center" type="index"/>
                <el-table-column label="申请单名称" prop="applicationFormName"/>
                <el-table-column label="申请单描述" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.applicationFormDescription}" />
                    </template>
                </el-table-column>

                <el-table-column label="是否开启审核">
                    <template v-slot="{row}">
                        <span>{{row.isNeedExamine?"是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否开启匹配">
                    <template v-slot="{row}">
                        <span>{{row.isMatchingModes?"是":"否"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请表创建时间">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text" @click="modApplicationForm(row.id)">修改</el-button>
                        <el-button class="custom-el-button unset-padding danger" type="text" @click="deleteApplicationForm(row.id)">删除</el-button>
                        <el-button class="custom-el-button unset-padding" type="text" @click="fieldManage(row.id)">字段管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body :close-on-click-modal="false" width="800px">
            <application-form-form v-if="formVisible" :member-type="memberType" :form-id="formId"
                                   @close="formVisible =false" @refresh="getFormList"/>
        </el-dialog>
        <el-dialog title="申请表字段管理" :visible.sync="fieldFormVisible" append-to-body :close-on-click-modal="false" width="800px">
            <application-form-field-manage :form-id="fieldFormId" v-if="fieldFormVisible"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import ApplicationFormForm from "./ApplicationFormForm";
    import ApplicationFormFieldManage from "./ApplicationFormFieldManage";
    export default {
        name: "MemberTypeApplicationFormManage",
        components: {ApplicationFormFieldManage, ApplicationFormForm},
        props:{
            memberType:{
                type: Object,
                default(){
                    return {};
                }
            }
        },
        data(){
            return {
                formId: null,
                formVisible: false,
                formTitle: '新增申请表',

                formList: [],

                fieldFormId: null,
                fieldFormVisible: false,
            }
        },
        methods:{
            newApplicationForm(){
                this.formId = null;
                this.formTitle = '新增申请表';
                this.formVisible = true;
            },
            modApplicationForm(id){
                this.formId = id;
                this.formTitle = '修改申请表';
                this.formVisible = true;
            },
            deleteApplicationForm(applicationFormId){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/applicationForm/deleteApplicationForm',{
                        params:{applicationFormId}
                    }).then(()=>{
                        this.getFormList();
                        this.$message.success('申请单已删除');
                    })

                }).catch(()=>{});
            },
            getFormList(){
                this.$request.get('/api/admin/applicationForm/getAllApplicationForm').then(res=>{
                    this.formList = res.data;
                })
            },
            fieldManage(id){
                window.open(this.$router.resolve(`/applyFieldManage/${id}`).href)
            }
        },
        created() {
            this.getFormList();
        },
        watch:{
            'memberType.id'(){
                this.getFormList();
            }
        }
    }
</script>

