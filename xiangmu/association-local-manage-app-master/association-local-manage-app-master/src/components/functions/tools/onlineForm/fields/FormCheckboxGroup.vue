<template>
    <form-field ref="container" v-model="field.title" @delete="$emit('delete')" :field="field">
        <template>
            <el-form class="custom-el-form set-item-small-margin" size="mini" label-width="110px">
                <el-form-item label="字段必填：">
                    <el-checkbox v-model="field.isRequire">字段必填</el-checkbox>
                </el-form-item>
                <el-form-item label="选项设置：">
                    <div v-for="(item,index) of field.typeConfig.list" class="flex" :key="item.code">
                        <div v-if="!item.isDelete" class="flex" style="padding-bottom: 10px;">
                            <checkbox-icon/>
                            <el-input v-model="item.content" placeholder="请输入选项内容"/>
                            <div style="padding-left: 16px;">
                                <el-tooltip class="item" effect="dark" content="删除选项" placement="top">
                                    <el-button type="text" size="small" @click="deleteItem(index)" class="custom-el-button danger unset-padding">
                                        <i class="el-icon-remove" style="font-size: 16px;"></i>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div>
                        <el-button type="primary" @click="addItem">新增多选项</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import FormField from "./FormField";
    import CheckboxIcon from "../util/CheckboxIcon";
    export default {
        name: "FormCheckboxGroup",
        components: {CheckboxIcon, FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        },
        methods:{
            deleteItem(index){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.field.typeConfig.deleteItem(index);
                }).catch(()=>{});
            },
            addItem(){
                this.field.typeConfig.addItem();
            }
        }
    }
</script>
