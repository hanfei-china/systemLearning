<template>
    <el-container class="absolute-fill-parent">
        <el-main class="unset-padding">
            <el-alert style="margin-bottom: 10px;" type="info" :closable="false">
                <span style="font-size: 14px;"><i class="el-icon-info" style="margin-right: 4px;"></i>新增同年同月的台账将覆盖上次增加的台账</span>
            </el-alert>
            <el-form label-width="80px" style="padding-right: 16px;" size="small">
                <el-form-item label="分会: " required>
                    {{branch.name}}
                </el-form-item>
                <el-form-item label="年份: " required>
                    <el-date-picker style="width: 100%;" v-model="entity.billYear" :clearable="false" type="year" size="small" value-format="yyyy"/>
                </el-form-item>
                <el-form-item label="月份: " required>
                    <el-select style="width: 100%;" v-model="entity.billMonth" size="small" placeholder="下拉选择年份">
                        <el-option :key="month.value" clearable v-for="month of monthOptions" :value="month.value" :label="month.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="附件: " required>
                    <a v-show="entity.billUrl" :href="`${entity.billUrl}?attname=${encodeURI(entity.fileName)}`" target="_blank"
                       class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{entity.fileName}}</a>
                    <el-upload with-credentials :action="action" :on-success="uploadSuccess" :show-file-list="false">
                        <el-button type="primary" size="small">上传附件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-column flex-center border-top">
            <div class="text-align-right">
                <el-button type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button type="primary" size="small" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";

    export default {
        name: "LedgerForm",
        props:{
            originalEntity: Object,
            branchId: {
                type: String,
                required: true
            },
            branch: Object,
            monthOptions: Array
        },
        data(){
            let now = new Date();
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                entity:{
                    billMonth: now.getMonth()+1,
                    billUrl: "",
                    billYear: now.getFullYear()+'',
                    branchId: this.branchId,
                    fileName: ""
                }
            }
        },
        methods:{
            uploadSuccess(response, file){
                this.fileList = [];
                this.entity.fileName = file.name;
                this.entity.billUrl = response.data;
            },
            save(){
                this.$request.post('/api/admin/branch/bill/uploadBranchBill',this.entity).then(()=>{
                    this.$message.success("台账新增成功");
                    this.$emit('refresh');
                    this.$emit('close');
                })
            }
        }
    }
</script>
