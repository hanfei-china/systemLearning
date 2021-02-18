<template>
    <el-container class="absolute-fill-parent" style="padding: 20px;">
        <el-header height="auto" class="flex border-bottom-dashed" style="padding-bottom: 20px;">
            <div class="flex-fill-in-the-remaining-space" style="line-height: 32px;">
                提示:请导入已编辑好下载的模板excel表格文件
            </div>
            <div>
                <el-button size="small" type="primary" @click="downloadTemplate">下载模板</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding border-bottom-dashed">
            <div style="padding-top: 50px;" v-if="!importListVisible">
                <el-upload v-loading="uploading" with-credentials :action="action"
                           element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
                           element-loading-background="rgba(0, 0, 0, 0.8)"
                           class="lrd-file-el-upload" :show-file-list="false"
                           accept="application/vnd.sealed-xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                           style="width: 70%;margin: auto;" :before-upload="beforeUpload"
                           :on-success="uploadSuccess" drag>
                    <i class="el-icon-upload"/>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
            <el-table :data="importList" height="100%" class="custom-el-table header-gray" size="small" border stripe
                      v-else>
                <el-table-column fixed type="index" width="55" align="center" label="序号"/>
                <el-table-column v-for="(field,index) of tableHeader" :key="index" show-overflow-tooltip
                                 :label="field">
                    <template slot-scope="{row}">
                        <span>{{row[index]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" class="text-align-right" style="padding: 20px 0 0;">
            共有 {{importList.length}} 名联系人导入
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
    import {exportExcel} from "../../../../../js/util/exportFile";

    export default {
        name: "TemplateExport",
        props: {
            value: {
                type: String
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                uploading: false,
                excelUrl: '',
                importListVisible: false,
                tableHeader: [],
                importList: [],//导入的表格
            }
        },
        methods: {
            //下载模板
            downloadTemplate() {
                this.$request.post('/api/admin/message/exportMessageTemplateFile', {
                    templateType: 0
                }, {
                    responseType: 'blob',
                }).then(resp => {
                    exportExcel(resp);
                });
            },
            beforeUpload(file) {
                let {size} = file;
                if (size > 20 * 1024 * 1024) {
                    this.$message.warning('上传文件大小应小于20M');
                    return false;
                }
                this.uploading = true;
                return true;
            },
            uploadSuccess(res) {
                let {data, success, msg} = res;
                if (!success) {
                    this.$message.error(msg);
                    this.uploading = false;
                    return;
                }
                this.$emit("change", data);
                this.getImportTable(data);
            },
            getImportTable(url) {
                this.$request.post('/api/admin/message/getExcelContent', {url: url}).then(res => {
                    if (res.success) {
                        if(res.data && res.data.length > 0){
                            this.tableHeader = res.data[0];
                            this.importList = res.data.splice(1);
                        }
                        this.importListVisible = true;
                        this.uploading = false;
                    }
                }).catch(()=>{
                    this.uploading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>
