<template>
    <el-container>
        <el-main class="unset-padding" style="height:400px;">
            <el-table v-if="!loading" class="custom-el-table header-gray lrd-el-table" height="400px"
                      stripe :data="repeatList" size="small" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" fixed/>
                <el-table-column label="序号" type="index" width="55" align="center" fixed/>
                <el-table-column v-for="field of memberFieldList" :key="field.code" show-overflow-tooltip
                                 :label="field.name" :prop="field.code" :min-width="field.width">
                    <template slot-scope="{row}">
                        <temp-var :value="row[field.alias]">
                            <template slot-scope="{value}">
                                <member-info-table-preview-field :field="field" :value="value"/>
                            </template>
                        </temp-var>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="text-align-right" height="auto" style="padding: 10px 0 0;">
            <el-button size="small" type="danger" @click="cancelPage">取消</el-button>
            <el-button size="small" type="primary" @click="selectDataVisible = true" :disabled="selectList.length<2">
                数据合并
            </el-button>
        </el-footer>
        <el-dialog title="确定基准数据" append-to-body :close-on-click-modal="false"
                   :visible.sync="selectDataVisible" width="800px">
            <select-data-form v-if="selectDataVisible" :selectList="selectList"
                              :memberFieldList="memberFieldList" @closePage="selectDataVisible = false" @close="close"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import TempVar from "../../../../../util/TempVar";
    import MemberInfoTablePreviewField from "../../common/MemberInfoTablePreviewField";
    import SelectDataForm from "./SelectDataForm";

    export default {
        name: "RepeatList",
        components: {SelectDataForm, MemberInfoTablePreviewField, TempVar},
        props: ['repeatInfo', 'memberFieldList'],
        data() {
            return {
                repeatList: [],
                selectList: [],
                selectDataVisible: false,//选择合并数据
                loading: true
            }
        },
        created() {
            this.getDetailData();
        },
        methods: {
            getDetailData() {
                if (this.repeatInfo.count) {
                    delete this.repeatInfo.count;
                }
                this.$request.get('/api/admin/member/getRepeatMemberDetailsByRepeatInfo', {
                    params: {
                        repeatInfo: JSON.stringify(this.repeatInfo)
                    }
                }).then(res => {
                    if (res.success) {
                        this.repeatList = res.data;
                        this.$nextTick(()=>{ this.loading = false; })
                    }
                })
            },
            handleSelectionChange(val) {
                this.selectList = val;
            },
            close(){
                this.getDetailData();
            },
            cancelPage(){
                this.$emit("close");
                this.$emit("refresh")
            }
        }
    }
</script>
