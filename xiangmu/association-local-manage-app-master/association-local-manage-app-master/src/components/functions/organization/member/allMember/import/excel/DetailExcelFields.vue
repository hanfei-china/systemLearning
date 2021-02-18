<template>
    <div class="border-bottom">
        <div class="flex" style="padding: 10px;">
            <div style="color: #409eff;height: 28px;line-height: 28px;">
                <i class="el-icon-s-operation"></i>
                <span style="padding-left: 4px;">{{excelField.name}}</span>
            </div>
            <div style="padding-left: 10px;" class="flex-fill-in-the-remaining-space">
                <el-select placeholder="请选择明细表" v-model="excelField.targetField" size="mini" style="width: 100%;" clearable>
                    <el-option v-for="detailField of memberDetailFields" :key="detailField.code"
                               :value="detailField.code" :label="detailField.name"/>
                </el-select>
            </div>
        </div>
        <div style="background-color: rgba(240,245,248,.8);" v-show="excelField.targetField">
            <detail-excel-field :parent="excelField" v-for="(childField,childIndex) in excelField.children" :key="childIndex"
                                :excel-field="childField" :member-detail-fields="childrenMemberDetailFields"/>
        </div>
    </div>
</template>

<script>
    import DetailExcelField from './DetailExcelField';

    export default {
        name: "DetailExcelFields",
        components: {
            DetailExcelField
        },
        props: {
            excelField: Object,
            memberDetailFields: Array
        },
        computed: {
            childrenMemberDetailFields() {
                if (this.excelField.targetField) {
                    for(let detailField of this.memberDetailFields){
                        if(detailField.code === this.excelField.targetField){
                            return [detailField];
                        }
                    }
                }
                return [];
            }
        },
    }
</script>
