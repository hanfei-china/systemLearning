<template>
    <el-container class="absolute-fill-parent background-color-white"
                  v-loading="loading" element-loading-text="数据加载中......" element-loading-spinner="el-icon-loading">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center"
                     style="font-size: 16px;color: #333333;">
                    <div><i class="el-icon-s-help" style="padding-right: 4px;font-size: 18px;"/>字段设计</div>
                </div>
                <div>
                    <el-button type="primary" size="small" @click="submitData">保存表单字段</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-if="formInfo">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="margin: 20px auto;width: 880px;" class="box-shadow">
                        <div ref="sort">
                            <component v-for="(field,index) of formInfo.fields" :ref="field.id"  @delete="deleteField(index)"
                                       :is="field.moduleName" :key="field.id" :field="field" :allInfoList="formInfo" @updataInfo="updataFormInfo"/>
                        </div>
                        <div>
                            <div style="background-color: #F9FAFC;padding: 20px;" class="position-relative" v-show="adding">
                                <el-alert show-icon style="margin-bottom: 16px;" title="点击下列按钮快速创建字段" type="warning" center :closable="false" v-show="!hasFields"/>
                                <div class="position-absolute" style="top:10px;right: 10px;" v-show="hasFields" @click.stop="adding = false">
                                    <a style="font-size: 18px;" class="el-icon-close lrd-a hover-scale-bigger"/>
                                </div>
                                <div class="flex">
                                    <div class="flex flex-column flex-center text-align-right" style="width: 90px;">常用字段：</div>
                                    <div class="flex-fill-in-the-remaining-space">
                                        <el-button v-for="(field,index) of commonFields" @click="addField(field)"
                                                   :key="index" :icon="field.icon" size="mini" plain>{{field.title}}</el-button>
                                    </div>
                                </div>
                                <div class="flex" style="margin-top: 20px;">
                                    <div class="flex flex-column flex-center text-align-right" style="width: 90px;">自定义字段：</div>
                                    <div class="flex-fill-in-the-remaining-space">
                                        <el-button size="mini" @click="addField({type:1,moduleName:'formInput'})" plain style="margin-bottom:10px;">+单行文本</el-button>
                                        <el-button size="mini" @click="addField({type:2,moduleName:'formTextarea'})" plain style="margin-bottom:10px;">+多行文本</el-button>
                                        <el-button size="mini" @click="addField({type:3,moduleName:'formDatePicker'})" plain style="margin-bottom:10px;">+日期时间</el-button>
                                        <el-button size="mini" @click="addField({type:4,moduleName:'formRadioGroup'})" plain style="margin-bottom:10px;">+单选</el-button>
                                        <el-button size="mini" @click="addField({type:5,moduleName:'formCheckboxGroup'})" plain style="margin-bottom:10px;">+多选</el-button>
                                        <el-button size="mini" @click="addField({type:6,moduleName:'formImageUpload'})" plain style="margin-bottom:10px;">+图片上传</el-button>
                                        <el-button size="mini" @click="addField({type:7,moduleName:'formFileUpload'})" plain style="margin-bottom:10px;">+文件上传</el-button>
                                        <el-button size="mini" @click="addField({type:8,moduleName:'formRichText'})" plain style="margin-bottom:10px;">+富文本展示</el-button>
                                        <el-button size="mini" @click="addField({type:10,moduleName:'linkText'})" plain style="margin-bottom:10px;">+关联字段</el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="text-align-center" style="padding: 20px;" v-show="!adding">
                                <el-button type="primary" size="small" @click="adding = true" plain>+新增字段</el-button>
                            </div>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import FormBuilder from '../js/formBuilder';
    import FormInput from "../fields/FormInput";
    import FormTextarea from "../fields/FormTextarea";
    import FormDatePicker from "../fields/FormDatePicker";
    import FormRadioGroup from "../fields/FormRadioGroup";
    import FormCheckboxGroup from "../fields/FormCheckboxGroup";
    import FormImageUpload from "../fields/FormImageUpload";
    import FormRichText from "../fields/FormRichText";
    import linkText from "../fields/linkText";

    import {commonFields} from "../js/fieldType";
    import Sortable from 'sortablejs';
    import FormFileUpload from "../fields/FormFileUpload";

    export default {
        name: "OnlineFormDesign",
        components: {
            FormFileUpload,
            FormInput,FormTextarea,FormDatePicker,FormRadioGroup,FormCheckboxGroup,FormImageUpload,FormRichText,linkText},
        data() {
            return {
                formInfo: {},
                loading: true,
                adding: false,
                commonFields
            }
        },
        computed: {
            formId() {
                return this.$route.params.formId;
            },
            hasFields(){
                return  this.formInfo && this.formInfo.fields && this.formInfo.fields.length > 0;
            }
        },
        methods: {
            drag() {
                let el = this.$refs.sort;
                Sortable.create(el, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.formInfo.fields));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue);
                        }
                    }
                });
            },
            sortFields(fieldList) {
                this.formInfo.fields = fieldList;
            },
            getFormInfo(callback) {
                this.$request.get('/api/admin/onlineForm', {
                    params: {id: this.formId}
                }).then(res => {
                    this.formInfo = new FormBuilder(res.data);
                    // console.log(res.data);
                    // console.log(this.formInfo);
                    this.$nextTick(()=>{ this.loading = false; })
                    this.drag();
                    if(this.formInfo.fields.length < 1){
                        this.adding = true;
                    }
                    //对固定字段进行处理
                    this.formInfo.fields.forEach(item=>{
                        if (item.code==='donationName'||item.code==='groupName'||item.code==='donationTime'||item.code==='donationAmount'||item.code==='donationPhone'||item.code==='title') {
                            item.isFixed=true;
                        }
                    })
                    callback && callback();
                })
            },
            submitData() {
                let data = {
                    fields: JSON.stringify(this.formInfo.fields),
                    id: this.formInfo.id,
                    formTitle: this.formInfo.formTitle
                };
                this.$request.put('/api/admin/onlineForm/fields', data).then(() => {
                    this.getFormInfo(() => {
                        this.$message.success({duration: 1000, message: '字段信息已更新'});
                    });
                })
            },
            addField(field){
                let entity = this.formInfo.addField(field);
                setTimeout(()=>{
                    let {id} = entity;
                    this.$refs[id][0].$refs.container.settingsIn = true;
                },20);
            },
            deleteField(index){
                this.formInfo.deleteField(index);
                if(this.formInfo.fields.length < 1){
                    this.adding = true;
                }
            },
            updataFormInfo(newVal){
                console.log(newVal)
                this.formInfo=JSON.parse(JSON.stringify(newVal));
                console.log(this.formInfo)
            }
        },
        mounted() {
            this.getFormInfo();
        }

    }
</script>
