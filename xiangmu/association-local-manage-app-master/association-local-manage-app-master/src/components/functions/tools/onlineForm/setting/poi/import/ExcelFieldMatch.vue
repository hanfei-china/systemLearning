<template>
    <el-container style="height: 400px" v-loading="loading" element-loading-text="数据导入中，请耐心等待....">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-main class="unset-padding position-relative">
                    <el-container class="absolute-fill-parent">
                        <el-header class="unset-padding" height="auto">
                            <div class="flex border-bottom" style="padding: 0 16px 16px 16px;">
                                <div class="flex-fill-in-the-remaining-space text-align-center">excel表头字段</div>
                                <div class="text-align-center" style="width: 100px;"><i class="el-icon-sort rotate-90"></i></div>
                                <div class="flex-fill-in-the-remaining-space text-align-center">系统已有字段</div>
                                <div class="flex-fill-in-the-remaining-space text-align-center">
                                    <el-popover width="200"
                                                trigger="hover">
                                        <div>
                                            唯一项为导入和更新时的依据，不设置唯一项时导入数据只能作为新数据进行插入
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
                                        <div v-for="(excelField,index) in excelFieldTree" :key="index" >
                                            <excel-field :unique="unique" :excel-tree="excelFieldTree"
                                                         :member-fields="memberFields" :excel-field="excelField"
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
                        <div style="padding: 10px 0;">唯一项为空时：</div>
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
    import ExcelField from './ExcelField';
    export default {
        name: "ExcelFieldMatch",
        components: {ExcelField},
        props: {
            excelFields: Array,
            memberFields: Array,
            fileUrl: {
                type: String,
                required: true,
            },
            dataRow:Number
        },
        data() {
            return {
                privacySetting: 1,
                unique: '',
                loading: false,
                repeatForUpdate: false,
                nullUniqueCodeForInsert: false,
                excelFieldTree: []
            }
        },
        computed:{
            formId() {
                return this.$route.params.formId;
            },
            batchUrl(){
                return `/api/admin/onlineForm/poi/batchImport/${this.formId}`;
            }
        },
        methods: {
            import(){
                let resultFields = {};
                for(let node of this.excelFieldTree){
                    let {titleColumn, targetField, topicType, parameter} = node;
                        //非明细表字段
                    if(targetField){
                        resultFields[targetField] = {
                            excelColumn: titleColumn,
                            topicType:topicType,
                            parameter: parameter,
                            code: targetField,
                        };
                    }
                }
                let postData = {
                    url: this.fileUrl,
                    fieldRelation: resultFields,
                    uniqueCode: this.unique,
                    repeatForUpdate: this.repeatForUpdate,
                    nullUniqueCodeForInsert: this.nullUniqueCodeForInsert
                };

                this.loading = true;

                this.$request.post(this.batchUrl,postData,{timeout:1000*60*60}).then(resp=>{
                    this.$emit('import-success',resp);
                    this.$nextTick(()=>{ this.loading = false; })
                });
            },
            save() {
                if(this.nullUniqueCodeForInsert){
                    this.$msgbox.confirm('唯一项为空时，将作为新数据插入，该操作存在风险，是否继续导入？','提示',{type: 'warning',confirmButtonText:'继续导入'}).then(()=>{
                       this.import();
                    }).catch(()=>{});
                }else{
                    this.import();
                }
            },
            transferExcelFieldsToTree(parents, children) {
                //遍历父节点数据
                parents.forEach(parent => {
                    //遍历子节点数据
                    children.forEach((current, index) => {
                        //若该节点是对应的父级节点的子节点
                        if (current.parentColumn === parent.titleColumn) {
                            //深拷贝一份子节点数组
                            let temp = JSON.parse(JSON.stringify(children));
                            //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                            temp.splice(index, 1);
                            //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                            this.transferExcelFieldsToTree([current], temp);
                            //把找到子节点放入父节点的children属性中
                            parent.children ? parent.children.push(current) : parent.children = [current];
                        }
                    });
                });
            },
            uniqueChange(unique){
                this.unique = unique;
            }
        },
        mounted() {
            let fields = JSON.parse(JSON.stringify(this.excelFields));

            for (let field of fields) {
                field.targetField = '';
                if (field['parentColumn'] === -1) {
                    //主表字段
                    for(let option of this.memberFields){
                        if(field.name.indexOf(option.title) > -1){
                            field.targetField = option.code;
                            field.topicType = option.type;
                            field.parameter = JSON.stringify(option.typeConfig);
                            break;
                        }
                    }
                }
            }

            this.excelFieldTree = fields;
        },
    }
</script>
