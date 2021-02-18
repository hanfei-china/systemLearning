<template>
    <el-container style="height: 400px" v-loading="loading" element-loading-text="数据导入中，请耐心等待....">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-main class="unset-padding position-relative">
                    <el-container class="absolute-fill-parent">
                        <el-header class="unset-padding" height="auto">
                            <div class="flex border-bottom" style="padding: 0 16px 16px 16px;">
                                <div class="flex-fill-in-the-remaining-space text-align-center">excel表头字段</div>
                                <div class="text-align-center" style="width: 100px;"><i
                                        class="el-icon-sort rotate-90"/></div>
                                <div class="flex-fill-in-the-remaining-space text-align-center">系统已有字段</div>
<!--                                <div class="flex-fill-in-the-remaining-space text-align-center">-->
<!--                                    <el-popover width="200"-->
<!--                                                trigger="hover">-->
<!--                                        <div>-->
<!--                                            单选字段、多选字段以及图片字段不能作为导入时的唯一项-->
<!--                                        </div>-->
<!--                                        <span style="cursor: pointer;" slot="reference">-->
<!--                                            <span>唯一项</span>-->
<!--                                            <i class="el-icon-question"/>-->
<!--                                        </span>-->
<!--                                    </el-popover>-->
<!--                                </div>-->
                            </div>
                        </el-header>
                        <el-main class="unset-padding position-relative">
                            <div class="absolute-fill-parent">
                                <vue-scroll>
                                    <div>
                                        <div v-for="(excelField,excelIndex) in excelFieldsTree" :key="excelIndex">
                                            <template>
                                                <excel-field :unique="unique" :excel-tree="excelFieldsTree"
                                                             :activity-fields="activityFields" :excel-field="excelField"/>
                                            </template>
                                        </div>
                                    </div>
                                </vue-scroll>
                            </div>
                        </el-main>
                    </el-container>
                </el-main>
                <el-aside width="200px" class="border-left" style="padding: 0 16px;margin-left: 16px;">
                    <div class="flex flex-column" style="padding-bottom: 10px">
                        <div style="padding-bottom: 10px">名单重复时：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select v-model="repeatForUpdate" size="small">
                                <el-option label="跳过不导入" :value="false"/>
                                <el-option label="覆盖已有数据" :value="true"/>
                            </el-select>
                        </div>
<!--                        <div style="padding: 10px 0;">唯一项为空时：</div>-->
<!--                        <div class="flex-fill-in-the-remaining-space">-->
<!--                            <el-select v-model="nullUniqueCodeForInsert" size="small">-->
<!--                                <el-option label="跳过不导入" :value="false"/>-->
<!--                                <el-option label="作为新数据插入" :value="true"/>-->
<!--                            </el-select>-->
<!--                        </div>-->
                    </div>
                </el-aside>
            </el-container>
        </el-main>
        <el-footer height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button size="small" @click="$emit('close')">取消</el-button>
                <el-button size="small" type="primary" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import ExcelField from './ExcelField';

    export default {
        name: "ExcelFieldMatch",
        components: {ExcelField},
        props: {
            excelFields: Array,
            activityFields: Array,
            fileUrl: {
                type: String,
                required: true,
            },
            dataRow: Number,
            activityId: String
        },
        data() {
            return {
                excelFieldsTree: [],
                unique: 'phone',
                loading: false,
                repeatForUpdate: false,
                nullUniqueCodeForInsert: false
            }
        },
        methods: {
            import() {
                let hasUnique = false;
                let resultFields = {};
                for (let node of this.excelFieldsTree) {
                    let {titleColumn, targetField, topicType, parameter} = node;
                    if (targetField) {
                        resultFields[targetField] = {
                            excelColumn: titleColumn,
                            topicType: topicType,
                            parameter: parameter,
                            code: targetField,
                        };

                        if(targetField === this.unique){
                            hasUnique = true;
                        }
                    }
                }

                if(!hasUnique){
                    this.$message.error('请选择唯一项字段');
                    return;
                }

                let postData = {
                    url: this.fileUrl,
                    fieldRelation: resultFields,
                    uniqueCode: this.unique,
                    repeatForUpdate: this.repeatForUpdate,
                    nullUniqueCodeForInsert: this.nullUniqueCodeForInsert,
                    activityId: this.activityId
                };

                this.loading = true;

                this.$request.post('/api/admin/activityInfo/batchImport', postData, {timeout: 1000 * 60 * 60}).then(resp => {
                    this.$emit('import-success', resp);
                    this.$nextTick(()=>{ this.loading = false; })
                });
            },
            save() {
                if (!this.unique) {
                    this.$message.warning('请选择一个唯一项');
                    return;
                }

                if (this.nullUniqueCodeForInsert) {
                    this.$msgbox.confirm('唯一项为空时，将作为新数据插入，该操作存在风险，是否继续导入？', '提示', {
                        type: 'warning',
                        confirmButtonText: '继续导入'
                    }).then(() => {
                        this.import();
                    }).catch(() => {
                    });
                } else {
                    this.import();
                }
            },
        },
        mounted() {
            let parents = [];
            let options = JSON.parse(JSON.stringify(this.activityFields));
            let fields = JSON.parse(JSON.stringify(this.excelFields));
            for (let field of fields) {
                field.targetField = '';
                for (let option of options) {
                    if(option.matchItem === true){
                        this.unique = option.code;
                    }
                    if (field.name === option.name) {
                        field.targetField = option.code;
                        field.topicType = option.topicType;
                        field.parameter = option.parameter;
                        break;
                    }
                }
                parents.push(field);
            }
            this.excelFieldsTree = parents;
        },
    }
</script>
