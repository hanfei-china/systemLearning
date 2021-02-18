<template>
    <el-container style="overflow: hidden;">
        <el-main class="unset-padding">
            <el-form size="small" label-width="140px">
                <el-form-item label="匹配的唯一项：" required>
                    <el-select style="width: 100%;" v-model="uniqueCode">
                        <el-option v-for="item of fieldList" :key="item.code"
                                   :value="item.code" :label="item.name"/>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="unset-padding">
            <div class="text-align-right">
                <el-button size="small" type="danger" @click="cancelOperate">取消</el-button>
                <el-button size="small" type="primary" @click="saveData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "MemberFaceFieldMatch",
        data() {
            return {
                fieldList: [],
                uniqueCode: '',//唯一项
                conflictDealType: 0,//唯一项为空时
                errorFaceList: [],//上传错误的列表
            }
        },
        created() {
            this.getFieldList();
        },
        methods: {
            getFieldList() {
                this.$request.get('/api/common/associator/getFieldsInfo').then(res => {
                    this.fieldList = res.data.filter((field) => {
                        return field.topicType !== 9;
                    });
                })
            },
            //确定
            saveData() {
                if (!this.uniqueCode) {
                    this.$message.warning('请选择匹配的唯一项');
                    return;
                }

                this.$request.post('/api/admin/baidu/faceIdentification/cancelOrConfirmImportRepository', {
                    conflictDealType: this.conflictDealType,
                    operate: 1,
                    uniqueCode: this.uniqueCode
                }).then(res => {
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            this.$emit("getList", res.data);
                        } else {
                            this.$message.success('上传成功');
                        }
                        this.$emit("close");
                    }
                })
            },
            //取消
            cancelOperate() {
                this.$request.post('/api/admin/baidu/faceIdentification/cancelOrConfirmImportRepository', {
                    operate: 0,
                }).then(() => {
                    this.$emit("close")
                })
            },
        }
    }
</script>

<style scoped>
    .el-select__input {
        vertical-align: baseline;
    }
</style>
