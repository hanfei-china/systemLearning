<template>
    <el-container class="absolute-fill-parent drilling-member-table">
        <el-aside width="200px" class="border-right position-relative">
            <vue-scroll>
                <ul class="border-right-unset custom-el-menu el-menu">
                    <li class="el-menu-item" @click="valueChange(null)" :class="{'is-active': !queryValue}">
                        全部
                    </li>
                    <li class="el-menu-item" v-for="(option,index) of options" :index="option.key" :key="index"
                                  :class="{'is-active': option.key === queryValue}"  @click="valueChange(option.key)">
                        <div class="flex">
                            <div class="flex-fill-in-the-remaining-space text-overflow" >
                                {{option.title}}
                            </div>
                        </div>
                    </li>
                </ul>
            </vue-scroll>
        </el-aside>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent" style="padding: 16px 16px 0 16px;">
                <el-main class="unset-padding position-relative" v-loading="loading">
                    <el-table class="custom-el-table header-gray lrd-el-table" height="100%" ref="memberTable" stripe
                              highlight-current-row :data="memberList" v-show="loaded || memberList.length > 0" v-if="reloaded" size="small" border>
                        <el-table-column label="序号" type="index" width="55" align="center" fixed/>
                        <el-table-column v-for="field of showFieldList" :key="field.code" show-overflow-tooltip
                                         :label="field.name" :prop="field.code"
                                         :min-width="field.width">
                            <template slot-scope="{row}">
                                <temp-var :value="row[field.alias]">
                                    <template slot-scope="{value}">
                                        <member-info-table-preview-field :field="field" :value="value" :label-list="labelList"/>
                                    </template>
                                </temp-var>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="unset-padding" height="auto">
                    <div class="flex" style="padding: 16px 0;">
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="memberTotal"
                                           :layout="layout"
                                           @current-change="pageChange"
                                           @size-change="sizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import TempVar from "../../../../util/TempVar";
    import {transferData} from "../../../../../js/util/utilFunction";
    import MemberInfoTablePreviewField from "../../member/common/MemberInfoTablePreviewField";

    export default {
        name: "DrillingMemberTable",
        components: {MemberInfoTablePreviewField, TempVar},
        props: {
            condition: Array,
            queryId: String,
            chartItems: Array,
            labelList: Array
        },
        data(){
            return {
                loading: false,

                memberList: [],
                memberFieldList: [],
                showFieldList:[],

                page: {
                    currentPage: 1,
                    pageSize: 10
                },
                memberTotal:0,
                loaded: false,
                reloaded: true,
                queryValue: null,
            }
        },
        computed: {
            field(){
                return this.condition[this.condition.length - 1];
            },
            options(){
                if(!this.field || this.chartItems.length < 1){
                    return [];
                }
                let options = [];
                for(let item of this.chartItems){
                    options.push({
                        key: item.code,
                        title: item.name,
                    })
                }

                return options;
            },
            queryCondition() {
                if(!this.condition || this.condition.length < 1){
                    return null;
                }
                let condition = {};

                condition.queryConditionEntities = this.condition;
                condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
                condition.limit = this.page.pageSize;
                condition.queryValue = this.queryValue;
                return condition;
            },
            layout(){
                return "total, sizes, prev, pager, next, jumper";
            },
        },
        methods:{
            transferData(field, value) {
                return transferData(field, value);
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.loadMembers();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.loadMembers();
            },
            refreshMembers(){
                this.memberInfo = null;
                this.page.currentPage = 1;
                this.loadMembers();
            },
            advancedSearch(){
                if (this.searchType === 'advanced') {
                    this.loading = true;
                    this.page.currentPage = 1;
                    this.loadMembers();
                }
            },
            getMemberFields(callback){
                Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo'),
                    this.$request.get('/api/admin/memberType/getMemberTypes')])
                    .then(([fields, memberTypes])=>{
                        let _memberTypes = [];
                        memberTypes.data.map(memberType=>{
                            _memberTypes.push({
                                key: memberType.id,
                                title: memberType.typeName
                            })
                        });

                        let tempMemberFields = [
                            {
                                code: 'memberTypeId',
                                alias: 'memberTypeId',
                                name: '会员类型',
                                topicType: 2,
                                advancedWidth: '200px',
                                parameter: {
                                    options: _memberTypes
                                },
                                tableName: 'main',
                                width: "200px",
                                value: null
                            },{
                                code: 'createTime',
                                alias: 'createTime',
                                name: '注册时间',
                                topicType: 5,
                                tableName: 'main',
                                width: "200px",
                                advancedWidth: '250px',
                                value: null,
                                parameter:{
                                    dateType: 'datetime'
                                }
                            },{
                                code: 'status',
                                alias: 'status',
                                name: '激活状态',
                                topicType: 2,
                                parameter: {
                                    options: [
                                        {key: '1', title: '已激活'},
                                        {key: '0', title: '未激活'}
                                    ]
                                },
                                tableName: 'main',
                                width: "80px",
                                advancedWidth: '150px',
                                value: null
                            },{
                                code: 'registerMode',
                                alias: 'registerMode',
                                name: '注册方式',
                                topicType: 2,
                                advancedWidth: '150px',
                                parameter: {
                                    options: [
                                        {key: '0', title: '用户注册'},
                                        {key: '1', title: '后台导入'},
                                        {key: '2', title: '活动导入'}
                                    ]
                                },
                                tableName: 'main',
                                width: "80px",
                                value: null
                            }
                        ];

                        let tempFields = fields.data.filter((field) => {
                            return field.topicType !== 9;
                        });

                        this.memberFieldList = [].concat(
                            tempFields.map((field) => {
                                let {code, parameter, topicType,tableName,alias} = field;
                                if(!tableName){
                                    field.tableName = 'main';
                                }
                                field.width = "200px";
                                field.advancedWidth = '200px';
                                field.value = null;

                                if (typeof parameter === 'string' && parameter && parameter.trim()) {
                                    parameter = JSON.parse(parameter);
                                } else {
                                    parameter = {};
                                }

                                if (topicType === 5) {
                                    //日期
                                    field.advancedWidth = "250px";
                                }

                                if(!alias){
                                    field.alias = code;
                                }

                                field.parameter = parameter;
                                return field;
                            })
                            ,tempMemberFields);

                        this.showFieldList = JSON.parse(JSON.stringify(this.memberFieldList));

                        callback && callback();
                    })
            },
            loadMembers() {
                if(this.queryCondition){
                    this.loading = true;
                    this.$request.post('/api/admin/member/statistics/result/detail',this.queryCondition).then(members=>{
                        this.memberList = members.data.list;
                        this.memberTotal = members.data.total;
                        this.$nextTick(()=>{ this.loading = false; })
                        if(!this.loaded) this.loaded = true;
                        this.reloaded = true;
                    });
                }
            },
            valueChange(value){
                this.queryValue = value;
                this.page.currentPage = 1;
                this.loadMembers();
            }
        },
        created() {
            this.getMemberFields(()=>{
                this.loadMembers();
            });
        },
        watch: {
            condition(){
                this.page.currentPage = 1;
                this.reloaded = false;
                this.loadMembers();
            },
            field(old,now){
                if(!old || !now || old.code !== now.code){
                    this.queryValue = null;
                }
            },
            options(){
                this.valueChange(null);
            },
            queryId(){
                this.valueChange(null);
            }
        }
    }
</script>
