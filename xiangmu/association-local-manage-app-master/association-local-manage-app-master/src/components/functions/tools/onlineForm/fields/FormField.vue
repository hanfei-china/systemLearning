<template>
    <div class="form-field flex flex-column border-bottom">
        <div class="flex">
            <div class="cursor-move flex flex-column flex-center item-sort">
                <i class="iconfont icon-Icon_drag"/>
            </div>
            <div class="flex-fill-in-the-remaining-space" style="padding-left: 20px;">
                <slot name="field-title">
                    <el-input placeholder="请输入字段名称" v-model="title" size="small"/>
                </slot>
            </div>
            <div style="width: 100px;padding-left: 20px;" class="flex flex-column flex-center">
                <div class="text-align-right">
                    <el-tooltip class="item" effect="dark" content="字段设置" placement="top">
                        <el-button type="text" size="small" @click="settingsIn=!settingsIn" class="custom-el-button unset-padding">
                            <i class="el-icon-setting" style="font-size: 16px;"/>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除字段" placement="top" v-if="(field&&field.isFixed)?false:true">
                        <el-button type="text" size="small" @click="deleteField" class="custom-el-button danger unset-padding">
                            <i class="el-icon-delete" style="font-size: 16px;"/>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="form-field-setting-panel" :class="{show:settingsIn}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FormField",
        props:{
            value: String,
            field:Object
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        data(){
            return {
                settingsIn: false,
                title: this.value
            }
        },
        methods:{
            deleteField(){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$emit('delete');
                }).catch(()=>{});
            }
        },
        watch:{
            title(val){
                this.$emit('change',val);
            }
        }
    }
</script>
