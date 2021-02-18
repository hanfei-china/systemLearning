<template>
    <div class="flex">
        <div class="body-sort">
            <el-tooltip v-if="!canSort" content="保存字段变更后才可排序">
                <span class="iconfont icon-Icon_drag cursor-not-allowed"/>
            </el-tooltip>
            <span v-else class="iconfont icon-Icon_drag item-sort"/>
        </div>
        <div class="body-name">
            <el-input placeholder="请输入字段名称" size="small" clearable v-model="field.name"/>
            <div v-if="field.topicType === 0">
                <el-form size="small" label-width="100px">
                    <el-form-item label="数据检验规则:">
                        <el-select v-model="field.regularType" placeholder="请选择数据校验规则">
                            <el-option v-for="regularType of regularTypes" :key="regularType.code" :value="regularType.code" :label="regularType.title"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="自定义表达式:" v-show="field.regularType === 'custom'">
                        <el-input placeholder="请输入自定义正则表达式" v-model="field.regularString"/>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="field.topicType === 2 || field.topicType === 3">
                <radio-field :itemList="field.itemList"/>
            </div>
            <div class="uploadImg" v-if="field.topicType === 4">
                <i class="el-icon-plus"/>
            </div>
        </div>
        <div class="body-tian">
            <el-checkbox @change="matchItemChange"  :disabled="field.topicType !== 0" v-model="field.matchItem">唯一项</el-checkbox>
            <el-checkbox :disabled="field.matchItem" v-model="field.necessary">必填</el-checkbox>
        </div>
        <div class="body-set">
            <el-tooltip effect="dark" content="删除字段" placement="top">
                <el-button type="text" icon="iconfont icon-delete"
                           :disabled="field.code === 'name'||field.code === 'phone'"
                           @click="deleteField"/>
            </el-tooltip>
            <el-tooltip v-show="canSave" effect="dark" content="保存字段" placement="top">
                <el-button type="text" icon="iconfont icon-save"
                           @click="save"/>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    import RadioField from "./RadioField"

    export default {
        name: "ItemFields",
        props: {
            field: Object,
            isCreate: {
                type: Boolean,
                default: false
            },
            activityId: String,
            canSort: {
                type: Boolean,
                default: true
            },
        },
        components: {RadioField},
        data() {
            return {
                newList: [],
                regularTypes: [
                    {code: 'unset', title: '不校验'},
                    {code: 'email', title: '电子邮箱'},
                    {code: 'chinaMobile', title: '中国大陆手机号'},
                    {code: 'chinaIdCard', title: '中国大陆身份证号'},
                    {code: 'custom', title: '自定义校验规则'}
                ],
                canSave: false
            }
        },
        created(){
            if(!this.field.id && !this.isCreate){
                this.canSave = true;
            }
        },
        methods: {
            deleteField() {
                if(this.field.matchItem){
                    this.$message.warning('唯一项不可删除！！！');
                    return;
                }
                this.$confirm("此操作将永久删除该项，是否继续？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(this.field.id){
                        this.$request.delete('/api/admin/activity/field/deleteField', {
                            params: {
                                fieldId: this.field.id,
                            }
                        }).then(res => {
                            if (res.success) {
                                this.$message.success("字段已删除");
                                this.$emit('delete-field');
                            }
                        })
                    }else{
                        this.$emit('delete-field');
                    }
                }).catch(()=>{})
            },
            save(callback) {
                if(this.field.id){
                    this.$request.put('/api/admin/activity/field/updateField', {...this.field,activityId:this.activityId}).then(res => {
                        if (res.success) {
                            this.$message.closeAll();
                            if(callback){
                                callback();
                            }else{
                                this.$message.success("字段修改成功");
                            }
                            this.canSave = false;
                        }
                    })

                }else{
                    this.$request.post('/api/admin/activity/field/addField', {...this.field,activityId:this.activityId}).then(res => {
                        if (res.success) {
                            this.$message.closeAll();
                            this.$message.success("字段新增成功");
                            this.field.id = res.data;
                            this.$nextTick(()=>{
                                this.canSave = false;
                            })
                        }
                    })
                }


            },
            matchItemChange(val){
                if(!val){
                    this.$message.warning('需有一个字段设置为唯一项');
                    this.field.matchItem = true;
                }
            }
        },
        watch:{
            field:{
                deep: true,
                handler(){
                    this.canSave = !this.isCreate;
                }
            },
            canSave(){
                this.$emit('save-change');
            },
            'field.matchItem'(val){
                if(val){
                    this.$emit('match-item');
                    this.field.necessary = true;
                }
                if(!this.isCreate){
                    this.save(()=>{
                        this.$message.success("唯一项已变更");
                    });
                }
            }
        }
    }
</script>
