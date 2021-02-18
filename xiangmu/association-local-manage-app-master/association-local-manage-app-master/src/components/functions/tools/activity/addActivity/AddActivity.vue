<template>
    <div class="absolute-fill-parent addActive-wrap container-background">
        <vue-scroll>
            <div class="setting-wrap">
                <div class="basic-setting setting" style="padding-top: 60px;">
                    <div style="position: absolute;left: 0;top: 8px;">
                        <img src="../../../../../assets/label.png" class="title-area-img">
                        <div class="setting-title">基本信息</div>
                    </div>
                    <basic-form :activityBaseInfo="activityBaseInfo" :branchId="branchId"/>
                </div>
                <div class="richtext-setting setting" style="padding-top: 80px;">
                    <div style="position: absolute;left: 0;top: 8px;">
                        <img src="../../../../../assets/label.png" class="title-area-img">
                        <div class="setting-title">活动详情</div>
                    </div>
                    <div class="editor">
                        <editor v-model="activityBaseInfo.details"/>
                    </div>
                </div>
                <div class="form-setting setting" style="padding-top: 80px;">
                    <div style="position: absolute;left: 0;top: 8px;">
                        <img src="../../../../../assets/label.png" class="title-area-img">
                        <div class="setting-title">报名表单</div>
                    </div>
                    <div class="container">
                        <div class="table-header">
                            <span class="name">报名项名称</span>
                            <el-divider direction="vertical"/>
                            <span class="necessary">字段设置</span>
                            <el-divider direction="vertical"/>
                            <span class="set">操作</span>
                        </div>
                        <div class="table-body">
                            <ul ref="sortList">
                                <li v-for="(field,index) in activityFields" :key="index"
                                    style="border-bottom:1px solid #d7dde4">
                                    <item-fields :field="field" is-create @delete-field="deleteField(index)" @match-item="matchItem(index)"/>
                                </li>
                            </ul>
                            <div class="table-footer-area">
                                <el-form label-width="120px" class="addItems" :class="{active:addItems}">
                                    <el-form-item label="常用报名项：">
                                        <el-button icon="el-icon-plus" size="small"
                                                   v-for="field in defaultFields"
                                                   :key="field.id" @click="addDefaultField(field)">{{field.name}}
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item label="自定义报名项：">
                                        <el-button icon="el-icon-plus" size="small"
                                                   @click="addField(0)">
                                            单行文本
                                        </el-button>
                                        <el-button icon="el-icon-plus" size="small"
                                                   @click="addField(1)">
                                            多行文本
                                        </el-button>
                                        <el-button icon="el-icon-plus" size="small"
                                                   @click="addField(2)">
                                            单选题
                                        </el-button>
                                        <el-button icon="el-icon-plus" size="small"
                                                   @click="addField(3)">
                                            多选题
                                        </el-button>
                                        <el-button icon="el-icon-plus" size="small"
                                                   @click="addField(4)">图片
                                        </el-button>
                                    </el-form-item>
                                    <el-button type="text" class="closeBtn" icon="el-icon-close"
                                               @click="addItems=false"/>
                                </el-form>
                                <div class="addBtn" :class="{active:addItems}">
                                    <el-button icon="el-icon-plus" size="small" @click="addItems=true">新增报名项
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-container">
                    <el-button size="small" type="warning" @click="createActivity('0')">保存草稿</el-button>
                    <el-button size="small" type="primary" @click="createActivity('1')">发布</el-button>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    import BasicForm from '../util/BasicForm'
    import Editor from "../../../../util/editor/Editor"
    import ItemFields from '../util/ItemFields'
    import Sortable from 'sortablejs';
    import {requestBaseUrl} from '../../../../../js/config/serviceConfig';
    const uuidTimestamp = require('uuid/v1');

    export default {
        name: "AddActivity",
        components: {BasicForm, Editor, ItemFields},
        data() {
            return {
                //基本数据信息
               activityBaseInfo:{
                   //活动主题
                   theme: '',
                   //活动类型
                   activityCategoryId: '',
                   //输入的地图地点
                   address: '',
                   //发布到
                   publishAddress: '0',
                   //报名截止时间
                   signUpEndTime: new Date(),
                   signUpLimit: '0',
                   //是否需要审核
                   verify: true,
                   postUrl: '',
                   activityTimes: [new Date(),new Date(new Date().getTime()+24*60*60*1000)],
                   details:'',
                   addressConfig: {
                       lng: 0,
                       lat: 0,
                       province: '',
                       city: ''
                   },
                   signUpOnSite: false,
                   addIntegral:false

               },

                action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
                uploadDialog: false,

                //报名表单
                defaultFields: [],//报名项默认字段
                addItems: false,//添加报名项显示隐藏
                activityFields: [
                    {
                        name: '姓名',
                        code: 'name',
                        necessary: true,//是否必填
                        topicType: 0,//字段类型
                        itemList: [],
                        regularType: 'unset',
                        regularString: '',
                        matchItem: false
                    },
                    {
                        name: '手机号',
                        code: 'phone',
                        necessary: true,//是否必填
                        topicType: 0,//字段类型
                        itemList: [],
                        regularType: 'chinaMobile',
                        regularString: '',
                        matchItem: true
                    },
                    {
                        name: '身份证号',
                        code: 'idNumber',
                        necessary: true,//是否必填
                        topicType: 0,//字段类型
                        itemList: [],
                        regularType: 'chinaIdCard',
                        regularString: '',
                        matchItem: false
                    }
                ],
                branchId:'',
                isMain:true
            }
        },
        mounted() {
            this.getDefaultFields();//获取系统默认字段
            this.drag();
            this.branchId=this.$route.params.branchId;
            if (this.branchId!=='all') {
                this.isMain=false;
            }
        },
        methods: {
            //上传海报组件
            getUrls(data) {
                this.posterUrl = data;
            },
            getUploadDialog(data) {
                this.uploadDialog = data;
            },
            //获取系统默认字段
            getDefaultFields() {
                this.$request.get('/api/admin/activity/field/getDefaultFields', {}).then(res => {
                    if (res.success) {
                        for (let field of res.data) {
                            let {parameter,topicType,name,code} = field;

                            let regularType = "unset", regularString = "";
                            let itemList = [];
                            if (topicType === 2 || topicType === 3) {
                                parameter = JSON.parse(parameter);
                                if (parameter.options) {
                                    let options = parameter.options;
                                    for (let option of options) {
                                        itemList.push(option);
                                    }
                                }
                            }

                            if(topicType === 0){
                                if(parameter){
                                    parameter = JSON.parse(parameter);
                                    regularType = parameter.regularType;
                                    regularString = parameter.regularString;
                                }
                            }

                            this.defaultFields.push({
                                code,
                                name,
                                necessary: false,topicType,
                                itemList,regularType,regularString
                            });
                        }
                    }
                })
            },
            //添加新的报名项
            addDefaultField(item) {
                let code = item.code;
                if(code === 'email'){
                    for(let field of this.activityFields){
                        if(field.code === 'email'){
                            this.$message.warning('已添加邮箱字段');
                            return;
                        }
                    }
                }


                this.activityFields.push({localId: uuidTimestamp(),...item,id:'',matchItem:false});
            },
            addField(topicType) {
                let itemList = [];


                if(topicType === 2 || topicType === 3){
                    itemList = [
                        {key: 1, title: "选项1", type: 0},
                        {key: 2, title: "选项2", type: 0}
                    ];
                }

                this.activityFields.push({
                    id:'',
                    name: '',
                    necessary: false,
                    topicType,
                    itemList,
                    regularType: 'unset',
                    regularString: '',
                    matchItem: false
                });
            },
            //删除某一项
            deleteField(index) {
                this.activityFields.splice(index, 1);
            },
            matchItem(index){
                this.activityFields.map((field,_index)=>{
                    if(_index !== index){
                        field.matchItem = false;
                    }
                })
            },

            //排序
            drag() {
                let el = this.$refs.sortList;
                Sortable.create(el, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.activityFields));

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
                this.activityFields = [];
                setTimeout(() => {
                    this.activityFields = fieldList;
                }, 1);
            },

            //提交创建活动
            createActivity(val) {
                this.$request.post('/api/admin/activityInfo/createActivity', {
                    fieldsInfo: this.activityFields,
                    ...this.activityBaseInfo,
                    publishStatus: val,
                    addressConfig: JSON.stringify(this.activityBaseInfo.addressConfig),
                    endTime: this.activityBaseInfo.activityTimes[1],
                    beginTime: this.activityBaseInfo.activityTimes[0],
                    isMain:this.isMain
                }).then(res => {
                    console.log(res,'---------------------');
                    if (res.success) {
                        if (val === '0') {
                            this.$message.success('草稿保存成功')
                        } else {
                            this.$message.success('发布成功')
                        }
                        if (this.branchId==='all') {
                            this.$router.push("/console/tools/activityManage");
                        }else{
                            this.$router.push("/branchEditView/activityList/"+this.branchId);
                        }
                    }
                })
            },
        }
    }
</script>
