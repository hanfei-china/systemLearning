<template>
    <div class="absolute-fill-parent" style="z-index: 3000;background-color: #ffffff;min-width: 800px;" v-show="visible">
        <el-container class="absolute-fill-parent" style="padding: 0px;">
            <el-main class="position-relative unset-padding">
                <div class="absolute-fill-parent">
                    <vue-scroll>
                        <div style="padding: 16px;">
                            <el-card>
                                <div slot="header">
                                    <el-button class="unset-padding" style="height: 22px;line-height: 22px;font-size: 14px;padding-right: 6px !important;"
                                               type="text" size="small" icon="iconfont icon-back"
                                               @click="$emit('update:visible',false)"/>
                                    <i class="el-icon-upload"
                                       style="font-size: 19px;padding-right: 8px;height: 22px;line-height: 22px;"></i>
                                    <span>批量导入</span>
                                </div>
                                <div style="padding: 24px;" class="flex">
                                    <el-upload v-loading="uploading" with-credentials
                                               element-loading-text="拼命上传中" element-loading-spinner="el-icon-loading"
                                               element-loading-background="rgba(0, 0, 0, 0.8)"
                                               class="lrd-file-el-upload" :show-file-list="false"
                                               accept="application/vnd.sealed-xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                               style="width: 70%;" :before-upload="beforeUpload"
                                               :on-success="uploadSuccess" drag
                                               :action="uploadUrl">
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    </el-upload>
                                    <a class="member-import-template-download-container" :href="downloadUrl">
                                        <div>
                                            <i class="el-icon-download"></i>
                                            <div class="el-download__text">下载excel导入模版<span>(强烈推荐)</span></div>
                                        </div>
                                    </a>
                                </div>
                            </el-card>

                            <el-card style="margin-top: 16px;">
                                <div slot="header">
                                    <i class="el-icon-warning"
                                       style="font-size: 19px;padding-right: 8px;height: 22px;line-height: 22px;"></i>
                                    <span>导入说明<span class="danger-tip">(非常重要)</span></span>
                                </div>
                                <div>
                                    <div class="member-import-tip-detail">
                                        <div class="member-import-tip-detail-item"><span>1、<span class="danger-tip">强烈建议您使用模板导入；</span></span>
                                        </div>
                                        <div class="member-import-tip-detail-item">
                                            <div>2、请勿对表格进行(<span class="danger-tip">合并表格、空行、空列、隐藏行、隐藏列</span>)操作，否则将影响导入结果；</div>
                                        </div>
                                        <div class="member-import-tip-detail-item">
                                            <div>3、名单重复时的处理：</div>
                                            <div class="member-import-tip-detail-second-item">1)
                                                导入表格内有重复的数据时，如：表里有三条手机号码为18800000001的数据。选择“跳过不导入”，则仅第一条会导入，二三条不会导入；选择“覆盖已有字段”，后一条将依次覆盖前一条数据。
                                            </div>
                                            <div class="member-import-tip-detail-second-item">2)
                                                导入表格与后台已有数据重复时，选择“跳过不导入”，则不会导入该条；选择“覆盖已有字段”，会使用表格内数据覆盖该条数据对应字段信息。
                                            </div>
                                        </div>
                                        <div class="member-import-tip-detail-item">
                                            <div>4、<span class="danger-tip">单次批量新增数据建议不超过10000条，单次批量更新数据建议不超过2000条</span>;</div>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </vue-scroll>
                </div>
            </el-main>
        </el-container>
        <el-dialog title="字段调整" :visible.sync="dialogShow" append-to-body width="800px" :close-on-click-modal="false">
            <excel-field-match v-if="dialogShow" :file-url="excelData.url" :data-row="excelData.dataRow"
                               :excel-fields="excelData.excelColumnEntities" :member-fields="excelData.parentList"
                               @close="dialogShow = false" @import-success="importSuccess"/>
        </el-dialog>
        <el-dialog title="导入结果" :visible.sync="importDetailDialogShow" :close-on-click-modal="false" append-to-body width="800px">
            <div style="padding-bottom: 16px;">
                <div style="padding-bottom: 8px;font-size: 16px;">总览</div>
                <div class="flex">
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">表格总数</div>
                        <div class="member-import-result-item-content">{{importResult.cellNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title danger">系统重复</div>
                        <div class="member-import-result-item-content danger">{{importResult.repeatInTable}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title success">新增条数</div>
                        <div class="member-import-result-item-content success">{{importResult.hasAdded}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">更新条数</div>
                        <div class="member-import-result-item-content success">{{importResult.updateNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">系统原有条数</div>
                        <div class="member-import-result-item-content success">{{importResult.originalNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">导入后条数</div>
                        <div class="member-import-result-item-content success">{{importResult.currentNum}}</div>
                    </div>
                </div>
            </div>
            <div v-show="importResult.failureInfos.length > 0">
                <div style="padding-bottom: 8px;font-size: 16px;">错误详情</div>
                <el-table :data="importResult.failureInfos" size="mini" max-height="200px" border stripe>
                    <el-table-column prop="rowNum" label="行号" width="100px" show-overflow-tooltip/>
                    <el-table-column prop="uniqueValue" label="唯一项" width="150px" show-overflow-tooltip/>
                    <el-table-column prop="reason" label="失败原因"/>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ExcelFieldMatch from './ExcelFieldMatch';
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";

    export default {
        name: "BatchImport",
        components: {ExcelFieldMatch},
        props: ['visible'],
        data() {
            return {
                dialogShow: false,
                importDetailDialogShow: false,
                uploading: false,
                excelData: {
                    excelColumnEntities: [],
                    parentList: [],
                    url: '',
                    dataRow: 0
                },
                importResult: {
                    cellNum: 0,
                    repeatInTable: 0,
                    hasAdded: 0,
                    updateNum: 0,
                    originalNum: 0,
                    currentNum: 0,
                    failureInfos: []
                }
            }
        },
        computed:{
            formId() {
                return this.$route.params.formId;
            },
            downloadUrl(){
                return requestBaseUrl + `/api/admin/onlineForm/poi/importTemplate/${this.formId}`;
            },
            uploadUrl(){
                return requestBaseUrl + `/api/admin/onlineForm/poi/analyticalTemplate/${this.formId}`;
            }
        },
        methods: {
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
                this.excelData = Object.assign(this.excelData, data);
                setTimeout(() => {
                    this.uploading = false;
                    this.dialogShow = true;
                }, 500)
            },
            importSuccess(res) {
                this.importResult = Object.assign(this.importResult,res.data);
                this.dialogShow = false;
                this.importDetailDialogShow = true;
                this.$emit('refresh');
            }
        }
    }
</script>
