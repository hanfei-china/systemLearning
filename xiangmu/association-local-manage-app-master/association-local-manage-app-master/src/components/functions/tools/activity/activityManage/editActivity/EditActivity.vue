<template>
    <div class="editActivity-wrap addActive-wrap">
        <div class="editActivity-inner">
            <div class="header">
                <span v-for="item in navList" :key="item.label" class="nav-item" @click="navTab(item.label)"
                      :class="{active:navItem === item.label}">{{item.value}}</span>
            </div>
            <div class="body container-background">
                <div class="addActive" v-show="navItem === 'baseInfo'">
                    <vue-scroll>
                        <div class="setting-wrap">
                            <div class="basic-setting setting">
                                <basic-form :activity-base-info="activityBaseInfo" :branchId="branchId"/>
                            </div>
                            <div class="richtext-setting setting">
                                <div class="editor">
                                    <editor v-model="activityBaseInfo.details"/>
                                </div>
                            </div>
                        </div>
                    </vue-scroll>
                    <div class="saveBtn">
                        <el-button type="primary" size="small" @click="updateActivityInfo">保存基本信息</el-button>
                    </div>
                </div>
                <div class="addActive" v-show="navItem === 'activityFields'">
                    <vue-scroll>
                        <div class="setting-wrap">
                            <div class="form-setting setting">
                                <div class="container">
                                    <div class="table-header">
                                        <span class="name">报名项名称</span>
                                        <el-divider direction="vertical"/>
                                        <span class="necessary">是否必填</span>
                                        <el-divider direction="vertical"/>
                                        <span class="set">操作</span>
                                    </div>
                                    <div class="table-body">
                                        <ul ref="sortList">
                                            <li class="clearfix" v-for="(field,index) in activityFields" :key="field.localId"
                                                style="border-bottom: 1px solid #d7dde4">
                                                <item-fields :ref="field.localId" :field="field"
                                                             :activity-id="activityId" :can-sort="canSort"
                                                             @delete-field="deleteField(index)" @match-item="matchItem(index)"
                                                             @save-change="updateCanSort"/>
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
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BasicForm from '../../util/BasicForm'
    import Editor from "../../../../../util/editor/Editor"
    import Sortable from 'sortablejs';

    import ItemFields from '../../util/ItemFields';
    const uuidTimestamp = require('uuid/v1');
    export default {
        name: "EditActivity",
        components: {Editor, BasicForm, ItemFields},
        data() {
            return {
                activityId: '',//活动id
                navList: [
                    {
                        label: "baseInfo",
                        value: "基本信息"
                    }, {
                        label: "activityFields",
                        value: "报名表单"
                    }
                ],
                navItem: 'baseInfo',

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
                    //报名限制
                    signUpLimit: '0',
                    //报名截止时间
                    signUpEndTime: null,
                    //是否需要审核
                    verify: true,
                    postUrl: '',
                    activityTimes: [new Date(),new Date()],
                    details: '',
                    addressConfig: {
                        lng: 0,
                        lat: 0,
                        province: '',
                        city: ''
                    },
                    signUpOnSite: false,
                    addIntegral: false,
                    integralRuleId: null
                },

                //报名表单
                defaultFields: [], //报名项默认字段
                activityFields: [], //活动已有字段
                addItems: false,//添加报名项显示隐藏

                //是否可排序
                canSort: true,
                branchId:'',
            }
        },
        watch:{
            activityFields:{
                deep: true,
                immediate: true,
                handler(){
                    this.updateCanSort();
                }
            }
        },
        created() {
            this.activityId = this.$route.params.activityId;
            if (this.activityId) {
                this.getActivityInfo();
                this.getActivityFieldsInfo();
            }
        },
        mounted() {
            this.getDefaultFields();//获取系统默认字段
            this.drag();
        },
        methods: {
            updateCanSort(){
                for(let field of this.activityFields){
                    let ref = this.$refs[field.localId];
                    if(ref && Array.isArray(ref)){
                        let _field = ref[0];
                        if(_field && _field.hasOwnProperty('canSave') && _field.canSave){
                            this.canSort = false;
                            return;
                        }
                    }
                }
                this.canSort = true;
            },
            //头部导航切换
            navTab(label) {
                if(this.navItem === label){
                    return;
                }

                if (label === 'baseInfo') {
                    if (!this.canSort) {
                        this.$message.closeAll();
                        this.$message.warning("有未保存的字段变更，请先保存！");
                        return;
                    }
                }

                this.navItem = label;
            },
            //获取活动基本信息
            getActivityInfo() {
                this.$request.get('/api/common/activityCommonInfo/getActivityInfoById', {
                    params: {
                        activityId: this.activityId,
                        userId: ''
                    }
                }).then(
                    res => {
                        if (res.success) {
                            this.activityBaseInfo.address = res.data.address;
                            this.activityBaseInfo.activityTimes = [res.data.beginTime,res.data.endTime];
                            this.activityBaseInfo.details = res.data.details;
                            this.activityBaseInfo.posterUrl = res.data.posterUrl;
                            this.activityBaseInfo.signUpEndTime = res.data.signUpEndTime;
                            this.activityBaseInfo.signUpLimit = res.data.signUpLimit;
                            this.activityBaseInfo.theme = res.data.theme;
                            this.activityBaseInfo.activityCategoryId = res.data.activityCategoryId;
                            this.activityBaseInfo.verify = res.data.verify;
                            this.activityBaseInfo.signUpOnSite = res.data.signUpOnSite;
                            this.activityBaseInfo.addIntegral = res.data.addIntegral;
                            this.activityBaseInfo.integralRuleId = res.data.integralRuleId;
                            if(res.data.addressConfig){
                                this.activityBaseInfo.addressConfig = Object.assign(this.activityBaseInfo.addressConfig,JSON.parse(res.data.addressConfig));
                            }
                            this.branchId = res.data.branchId
                        }
                    }
                )
            },
            //获取活动字段
            getActivityFieldsInfo() {
                this.activityFields = [];
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        for (let field of res.data) {
                            let {parameter,topicType,id,code,name,necessary,matchItem} = field;

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

                            this.activityFields.push({
                                localId: uuidTimestamp(),
                                id,code,name,necessary,topicType,
                                itemList,regularType,regularString,matchItem
                            });
                        }
                    }
                })
            },
            //更新活动基本信息
            updateActivityInfo() {
                this.$request.put('/api/admin/activityInfo/updateActivityInfo', {
                    ...this.activityBaseInfo,
                    activityId:this.activityId,
                    addressConfig: JSON.stringify(this.activityBaseInfo.addressConfig),
                    endTime: this.activityBaseInfo.activityTimes[1],
                    beginTime: this.activityBaseInfo.activityTimes[0]
                }).then(res => {
                    if (res.success) {
                        this.$message.success("保存成功")
                    }
                })
            },

            //获取系统默认字段
            getDefaultFields() {
                this.$request.get('/api/admin/activity/field/getDefaultFields', {}).then(res => {
                    if (res.success) {
                        for (let field of res.data) {
                            let {parameter,topicType,name, code} = field;

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
            //添加新的默认字段
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
                let table = this.$refs.sortList;
                Sortable.create(table, {
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
                if (!fieldList) {
                    fieldList = this.activityFields;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                this.$request.post('/api/admin/activity/field/orderFields', null, {
                    params: {idList: orderList}
                }).then(data => {
                    if (data.success) {
                        this.$message.success("修改顺序成功");
                        this.activityFields = [];
                        setTimeout(() => {
                            this.activityFields = fieldList;
                        }, 1);

                    }
                })
            },
        }
    }
</script>
