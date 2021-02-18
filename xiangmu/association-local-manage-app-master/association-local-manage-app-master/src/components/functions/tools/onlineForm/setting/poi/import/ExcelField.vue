<template>
    <div class="flex border-bottom" style="padding: 10px 16px;line-height: 28px;">
        <div class="flex-fill-in-the-remaining-space text-align-center">{{excelField.name}}</div>
        <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-select v-model="excelField.targetField" size="mini" clearable>
                <el-option v-for="option of memberFields" :key="option.code" :value="option.code"
                           :label="option.title"/>
            </el-select>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-checkbox v-show="canAsUnique" v-model="asUnique"></el-checkbox>
        </div>
    </div>
</template>

<script>

    export default {
        name: "ExcelField",
        props: {
            excelField: {
                type: Object,
                default() {
                    return {};
                }
            },
            memberFields: Array,
            excelTree: Array,
            unique: String,
        },
        data(){
            return {
                asUnique: false
            }
        },
        computed: {
            isUnique(){
                return this.unique && this.excelField.targetField && this.unique === this.excelField.targetField;
            },
            chosenField() {
                for (let field of this.memberFields) {
                    if (this.excelField.targetField === field.code) {
                        return field;
                    }
                }

                return null;
            },
            canAsUnique() {
                for (let field of this.memberFields) {
                    if (this.excelField.targetField === field.code) {
                        let {type:topicType} = field;
                        return topicType === 1 || topicType === 2;
                    }
                }
                return false;
            },
        },
        watch: {
            asUnique(val){
                if (val) {
                    this.$emit('unique-change',this.excelField.targetField);
                } else {
                    this.$emit('unique-change','');
                }
            },
            excelField: {
                deep: true,
                handler(value) {
                    if (value) {
                        for (let node of this.excelTree) {
                            if (node.targetField && node.targetField === value.targetField
                                && !(node.titleColumn === value.titleColumn && node.parentColumn === value.parentColumn)) {
                                this.$message.warning('该字段已被选择');
                                this.excelField.targetField = '';
                                break;
                            }
                        }

                        this.asUnique = this.unique && value.targetField && this.unique === value.targetField;
                    }


                }
            },
            chosenField:{
                deep:true,
                handler(value){
                    if(value){
                        this.excelField.topicType = value.type;
                        this.excelField.parameter = JSON.stringify(value.typeConfig);
                    }else{
                        this.excelField.topicType = null;
                        this.excelField.parameter = "";
                    }
                }
            },
        },
    }
</script>

