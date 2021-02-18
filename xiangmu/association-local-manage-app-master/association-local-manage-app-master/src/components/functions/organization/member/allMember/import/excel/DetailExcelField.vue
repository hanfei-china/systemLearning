<template>
    <div class="flex border-bottom-white" style="padding: 10px 16px;line-height: 28px;">
        <div class="flex-fill-in-the-remaining-space text-align-center">{{excelField.name}}</div>
        <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-select v-model="excelField.targetField" size="mini" clearable>
                <el-option-group  v-for="option of memberDetailFields" :key="option.code" :label="option.name">
                    <el-option v-for="item in option.detailList"
                               :key="item.code" :label="item.name" :value="item.code"/>
                </el-option-group>
            </el-select>
        </div>
<!--        <div class="flex-fill-in-the-remaining-space text-align-center"></div>-->
    </div>
</template>

<script>

    export default {
        name: "DetailExcelField",
        props: {
            parent: Object,
            excelField: Object,
            memberDetailFields: Array
        },
        computed:{
            chosenField() {
                for (let field of this.memberDetailFields) {
                    for(let child of field.detailList){
                        if (this.excelField.targetField === child.code) {
                            return field;
                        }
                    }

                }

                return null;
            },
        },
        watch: {
            excelField: {
                deep: true,
                handler(value) {
                    if (value) {
                        for (let node of this.parent.children) {
                            if (node.targetField && node.targetField === value.targetField
                                && !(node.titleColumn === value.titleColumn && node.parentColumn === value.parentColumn)) {
                                this.$message.warning('该明细表字段已被选择');
                                this.excelField.targetField = '';
                                break;
                            }
                        }

                    }
                }
            },
            chosenField:{
                deep:true,
                handler(value){
                    if(value){
                        this.excelField.topicType = value.topicType;
                    }else{
                        this.excelField.topicType = null;
                    }
                }
            },
        },
    }
</script>
