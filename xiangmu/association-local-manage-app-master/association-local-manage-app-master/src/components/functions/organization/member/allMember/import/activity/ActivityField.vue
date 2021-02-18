<template>
    <div class="flex border-bottom" style="padding: 10px 16px;line-height: 28px;">
        <div class="flex-fill-in-the-remaining-space text-align-center">{{activityField.name}}</div>
        <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-select v-model="activityField.targetField" size="mini" clearable>
                <el-option v-for="option of memberFields" :key="option.code" :value="option.code"
                           :label="(memberAccountRules.accountField === option.code ? '账号字段｜' : '') + option.name"/>
            </el-select>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-checkbox v-show="canAsUnique" @change="change" v-model="isUnique"></el-checkbox>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActivityField",
        props: {
            activityField: {
                type: Object,
                default() {
                    return {};
                }
            },
            memberFields: Array,
            activityFields: Array,
            unique: String
        },
        data() {
            return {
                isUnique: false
            }
        },
        computed: {
            chosenField() {
                for (let field of this.memberFields) {
                    if (this.activityField.targetField === field.code) {
                        return field;
                    }
                }

                return null;
            },
            canAsUnique() {
                for (let field of this.memberFields) {
                    if (this.activityField.targetField === field.code) {
                        let {topicType} = field;
                        return topicType === 0 || topicType === 1;
                    }
                }
                return false;
            },
            memberAccountRules(){
                return this.$store.state.memberAccountRules;
            }
        },
        methods: {
            change(value) {
                if(value){
                    this.$emit('unique-change',this.activityField.targetField);
                }else{
                    this.$emit('unique-change','');
                }
            }
        },
        watch: {
            'activityField.targetField': {
                deep: true,
                handler(value,oldValue) {
                    if (value) {
                        for (let node of this.activityFields) {
                            if (node.targetField && node.targetField === this.activityField.targetField
                                && !(node.id === this.activityField.id)) {
                                this.$message.warning('该字段已被选择');
                                this.activityField.targetField = '';
                                break;
                            }
                        }
                        this.isUnique = this.unique && value && this.unique === value;
                        this.change(this.isUnique);
                    }else{
                        if(oldValue === this.unique){
                            this.isUnique = this.unique && value && this.unique === value;
                            this.change(this.isUnique);
                        }else{
                            this.isUnique = false;
                        }
                    }
                }
            },
            chosenField:{
                deep:true,
                handler(value){
                    if(value){
                        this.activityField.topicType = value.topicType;
                        this.activityField.parameter = value.parameter;
                    }else{
                        this.activityField.topicType = null;
                        this.activityField.parameter = "";
                    }
                }
            },
            unique(value) {
                this.isUnique = value === this.activityField.targetField;
            },
            canAsUnique(){
                if(this.isUnique){
                    this.$emit('unique-change','');
                }
            }
        },
        created() {
            this.isUnique = this.unique === this.activityField.targetField;
        },
    }
</script>

