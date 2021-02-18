<template>
    <el-container style="height: 400px" v-loading="loading" element-loading-text="数据导入中，请耐心等待....">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-main class="unset-padding position-relative">
                    <el-container class="absolute-fill-parent">
                        <el-header class="unset-padding" height="auto">
                            <div class="flex border-bottom" style="padding: 0 16px 16px 16px;">
                                <div class="flex-fill-in-the-remaining-space text-align-center">活动已有字段</div>
                                <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
                                <div class="flex-fill-in-the-remaining-space text-align-center">系统已有字段</div>
                                <div class="flex-fill-in-the-remaining-space text-align-center">
                                    <el-popover width="200" trigger="hover">
                                        <div>
                                            明细表字段、单选字段、多选字段、多级下拉字段以及图片字段不能作为导入时的唯一项
                                        </div>
                                        <span style="cursor: pointer;" slot="reference">
                                            <span>唯一项</span>
                                            <i class="el-icon-question"></i>
                                        </span>
                                    </el-popover>
                                </div>
                            </div>
                        </el-header>
                        <el-main class="unset-padding position-relative">
                            <div class="absolute-fill-parent">
                                <vue-scroll>
                                    <div >
                                        <div v-for="(activityField,parentIndex) in activityFields2" :key="parentIndex" >
                                            <activity-field :unique="unique" :activity-fields="activityFields2"
                                                            :member-fields="memberFields" :activity-field="activityField"
                                                            @unique-change="uniqueChange"/>
                                        </div>
                                    </div>
                                </vue-scroll>
                            </div>
                        </el-main>
                    </el-container>
                </el-main>
                <el-aside width="200px" class="border-left" style="padding: 0 16px;margin-left: 16px;">
                    <div class="flex flex-column" style="padding-bottom: 10px">
                        <div style="padding-bottom: 10px">名单重复时：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select v-model="repeatForUpdate" size="small">
                                <el-option label="跳过不导入" :value="false"/>
                                <el-option label="覆盖已有数据" :value="true"/>
                            </el-select>
                        </div>
                    </div>
                    <div class="flex flex-column">
                        <div style="padding-bottom: 10px">唯一项为空时：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select v-model="nullUniqueCodeForInsert" size="small">
                                <el-option label="跳过不导入" :value="false"/>
                                <el-option label="作为新数据插入" :value="true"/>
                            </el-select>
                        </div>
                    </div>
                </el-aside>
            </el-container>
        </el-main>
        <el-footer height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button size="small" @click="$emit('close')">取消</el-button>
                <el-button size="small" type="primary" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import ActivityField from './ActivityField';

    export default {
        name: "ActivityFieldMatch",
        components: {ActivityField},
        props: {
            activityFields: Array,
            memberFields: Array,
            taskId: {
                type: [String,Number],
                required: true,
            },
        },
        data(){
            return {
                repeatForUpdate: false,
                nullUniqueCodeForInsert: false,
                unique: '',
                activityFields2:[],
                loading:false
            }
        },
        methods:{
            uniqueChange(unique){
                this.unique = unique;
            },

            save(){
                if(!this.unique){
                    this.$message.warning('请选择一个唯一项');
                    return;
                }

                if(this.nullUniqueCodeForInsert){
                    this.$msgbox.confirm('唯一项为空时，将作为新数据插入，该操作存在风险，是否继续导入？','提示',{type: 'warning',confirmButtonText:'继续导入'}).then(()=>{
                        this.import();
                    }).catch(()=>{});
                }else{
                    this.import();
                }
            },
            import(){
                let resultFields = {};
                for(let node of this.activityFields2){
                    let {targetField,topicType, parameter,self,code} = node;
                    if(targetField){
                        resultFields[targetField] = {
                            self,topicType,parameter,
                            code:targetField,
                            activityId:code
                        };
                    }
                }

                let params = {
                    activityId: this.taskId,
                    nullUniqueCodeForInsert: this.nullUniqueCodeForInsert,
                    repeatForUpdate: this.repeatForUpdate,
                    uniqueCode: this.unique,
                    fieldRelation: resultFields,
                };

                this.loading = true;

                this.$request.post('/api/admin/member/poi/activityBatchImport',params).then(res => {
                    if(res.success){
                        this.$nextTick(()=>{ this.loading = false; })
                        this.$emit('import-success',res);
                    }
                })
            }
        },
        created() {
            let fields = JSON.parse(JSON.stringify(this.activityFields));
            for (let field of fields) {
                field.targetField = '';
                for(let option of this.memberFields){
                    if(field.name.indexOf(option.name) > -1){
                        field.targetField = option.code;
                        field.parameter = option.parameter;
                        break;
                    }
                }
            }

            this.activityFields2 = fields;
        },

    }
</script>
