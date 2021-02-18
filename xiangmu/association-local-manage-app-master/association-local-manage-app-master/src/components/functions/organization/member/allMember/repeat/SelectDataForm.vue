<template>
    <el-container>
        <el-main class="unset-padding">
            <el-table class="custom-el-table header-gray lrd-el-table" height="440px"
                      stripe :data="selectList" size="small" border>
                <el-table-column label="序号" type="index" width="55" align="center" fixed/>
                <el-table-column v-for="field of memberFieldList" :key="field.code" show-overflow-tooltip
                                 :label="field.name" :prop="field.code" :min-width="field.width">
                    <template slot-scope="{row}">
                        <temp-var :value="row[field.alias]">
                            <template slot-scope="{value}">
                                <member-field v-if="value && value.code" @click.native.stop
                                              style="width: 100%;"
                                              v-model="advancedCondition[field.code].value"
                                              :config="advancedCondition[field.code]"/>
                                <member-info-table-preview-field v-else :field="field" :value="value"/>
                            </template>
                        </temp-var>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" fixed="right" align="center">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" class="unset-padding"
                                   :disabled="isDisable?(!row.userId):isDisable"
                                   @click="manualMerge(row,row.id)">
                            合并到当前
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog title="合并后数据确认" append-to-body :close-on-click-modal="false"
                   :visible.sync="mergeDataVisible" width="800px">
            <merge-data-form v-if="mergeDataVisible" :repeatForm="repeatForm"
                             :id="mergeDataId" :ids="mergeDataIds" :mergeDataInfo="mergeDataInfo"
                             @closePage="mergeDataVisible = false" @close="close"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import MergeDataForm from "./MergeDataForm";
    import TempVar from "../../../../../util/TempVar";
    import MemberField from "../MemberField";
    import MemberInfoTablePreviewField from "../../common/MemberInfoTablePreviewField";
    import {formatDate} from "../../../../../../js/util/utilFunction";
    export default {
        name: "SelectDataForm",
        props: ['selectList','memberFieldList'],
        components: {MergeDataForm, MemberInfoTablePreviewField, MemberField, TempVar},
        data() {
            return {
                isDisable: false,
                repeatForm: {},
                mergeDataVisible: false,
                mergeDataId: '',
                mergeDataIds: [],
                mergeDataInfo: {},
                repeatIds: []
            }
        },
        created(){
            for (let item of this.selectList){
                this.repeatIds.push(item.id);
            }
        },
        methods: {
            getDataList(field) {
                let arr = [];
                let {code, topicType, parameter} = field;

                if (topicType === 2 || topicType === 3) {
                    for (let item of this.selectList) {
                        if (topicType === 3) {
                            let selectdItems = JSON.parse(item[code]);
                            if (selectdItems && selectdItems.length > 0) {
                                let selectdArr = [];
                                for (let selectItem of selectdItems) {
                                    for (let option of parameter.options) {
                                        if (option.key === selectItem) {
                                            selectdArr.push(option.title)
                                        }
                                    }
                                }
                                arr.push({'value': JSON.stringify(selectdArr), 'key': item[code]});
                            }
                        } else {
                            for (let option of parameter.options) {
                                if (item[code] === option.key) {
                                    arr.push({'value': option.title, 'key': option.key});
                                }
                            }
                        }

                        let obj = {};
                        arr = arr.reduce(function (item, next) {
                            obj[next.key] ? '' : obj[next.key] = true && item.push(next);
                            return item;
                        }, []);
                        this.$set(this.repeatForm, code, arr);
                    }
                } else if (topicType === 5) {
                    //日期
                    for (let item of this.selectList) {
                        if (item[code] !== null) {
                            if (parameter.dateType === "year") {
                                arr.push({
                                    'value': formatDate(new Date(item[code]), 'yyyy'),
                                    'key': JSON.stringify(new Date(item[code]))
                                });
                            } else {
                                arr.push({
                                    'value': formatDate(new Date(item[code]), 'yyyy-MM-dd'),
                                    'key': JSON.stringify(new Date(item[code]))
                                });
                            }
                        }

                        let obj = {};
                        arr = arr.reduce(function (item, next) {
                            obj[next.value] ? '' : obj[next.value] = true && item.push(next);
                            return item;
                        }, []);
                        this.$set(this.repeatForm, code, arr);
                    }
                } else {
                    for (let item of this.selectList) {
                        if (item[code] !== null) {
                            arr.push({'value': item[code], 'key': item[code]});
                        }

                        let obj = {};
                        arr = arr.reduce(function (item, next) {
                            obj[next.key] ? '' : obj[next.key] = true && item.push(next);
                            return item;
                        }, []);
                        this.$set(this.repeatForm, code, arr);
                    }
                }
            },
            manualMerge(row,id) {
                this.mergeDataInfo = row;
                this.mergeDataId = id;
                this.mergeDataIds = JSON.parse(JSON.stringify(this.repeatIds));
                for (let i = 0; i < this.mergeDataIds.length; i++) {
                    if (id === this.mergeDataIds[i]) {
                        this.mergeDataIds.splice(i, 1)
                    }
                }
                this.mergeDataVisible = true;

                for (let field of this.memberFieldList) {
                    this.getDataList(field);
                }
            },
            close(){
                this.mergeDataVisible = false;
                this.$emit("closePage");
                this.$emit("close")
            }
        }
    }
</script>

<style scoped>

</style>
