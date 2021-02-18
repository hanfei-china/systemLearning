<template>
    <div class="flex border-bottom" style="padding: 10px 16px;line-height: 28px;">
        <div class="flex-fill-in-the-remaining-space text-align-center">{{excelField.name}}</div>
        <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-select v-model="excelField.targetField" size="mini" clearable>
                <el-option v-for="option of activityFields" :key="option.code" :value="option.code"
                           :label="(option.matchItem === true ? '（唯一项）' : '') + option.name "/>
            </el-select>
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
            activityFields: Array,
            excelTree: Array,
            unique: String,
        },
        data() {
            return {
                isUnique: false
            }
        },
        computed: {
            chosenField() {
                for (let field of this.activityFields) {
                    if (this.excelField.targetField === field.code) {
                        return field;
                    }
                }
                return null;
            },
            canAsUnique() {
                return this.chosenField && this.chosenField.matchItem === true;
            },
        },
        watch: {
            unique(value) {
                this.isUnique = value === this.excelField.targetField;
            },
            canAsUnique() {
                if (this.isUnique) {
                    this.$emit('unique-change', '');
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

                        this.isUnique = this.unique && value.targetField && this.unique === value.targetField;
                    }
                }
            },
            chosenField: {
                deep: true,
                handler(value) {
                    if (value) {
                        this.excelField.topicType = value.topicType;
                        this.excelField.parameter = value.parameter;
                    } else {
                        this.excelField.topicType = null;
                        this.excelField.parameter = "";
                    }
                }
            },
        },
        created() {
            this.isUnique = this.unique === this.excelField.targetField;
        },
    }
</script>

