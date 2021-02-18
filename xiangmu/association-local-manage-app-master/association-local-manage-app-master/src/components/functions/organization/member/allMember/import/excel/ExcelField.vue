<template>
    <div class="flex border-bottom" style="padding: 10px 16px;line-height: 28px;">
        <div class="flex-fill-in-the-remaining-space text-align-center">{{excelField.name}}</div>
        <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-select v-model="excelField.targetField" size="mini" clearable>
                <el-option v-for="option of memberFields" :key="option.code" :value="option.code"
                           :label="(memberAccountRules.accountField === option.code ? '账号字段｜' : '') + option.name "/>
            </el-select>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-checkbox v-show="canAsUnique" v-model="asUnique" @change="changeUnique"/>
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
            accountFieldCode: String,
            autoRegister: Boolean
        },
        data(){
            return {
                asUnique: false
            }
        },
        methods:{
            changeUnique(val){
                if (val) {
                    this.$emit('unique-change',this.excelField.targetField);
                } else {
                    this.$emit('unique-change','');
                }
            },
        },
        computed: {
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
                        let {topicType} = field;
                        if(this.accountFieldCode && this.autoRegister){
                            return this.excelField.targetField === this.accountFieldCode;
                        }else{
                            return topicType === 0 || topicType === 1;
                        }
                    }
                }
                return false;
            },
            memberAccountRules(){
                return this.$store.state.memberAccountRules;
            }
        },
        watch: {
            'excelField.targetField': {
                deep: true,
                handler(value,oldValue) {
                    if (value) {
                        for (let node of this.excelTree) {
                            if (node.targetField && node.targetField === this.excelField.targetField
                                && !(node.titleColumn === this.excelField.titleColumn && node.parentColumn === this.excelField.parentColumn)) {
                                this.$message.warning('该字段已被选择');
                                this.excelField.targetField = '';
                                break;
                            }
                        }

                        this.asUnique = this.unique && value && this.unique === value;
                        this.changeUnique(this.asUnique);
                    }else{
                        if(oldValue === this.unique){
                            this.asUnique = this.unique && value && this.unique === value;
                            this.changeUnique(this.asUnique);
                        }else{
                            this.asUnique = false;
                        }
                    }
                }
            },
            chosenField:{
                deep:true,
                handler(value){
                    if(value){
                        this.excelField.topicType = value.topicType;
                        this.excelField.parameter = value.parameter;
                    }else{
                        this.excelField.topicType = null;
                        this.excelField.parameter = "";
                    }
                }
            },
            unique(val){
                if(this.excelField.targetField && val){
                    if(val === this.excelField.targetField){
                        this.asUnique = true;
                        return;
                    }
                }
                this.asUnique = false;

            }
        },
    }
</script>

