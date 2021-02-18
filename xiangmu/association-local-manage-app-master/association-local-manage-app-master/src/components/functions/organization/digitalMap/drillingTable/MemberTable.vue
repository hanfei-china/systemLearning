<template>
    <el-container style="height: 500px;" v-loading="loading">
        <el-main class="unset-padding position-relative">
            <el-table class="custom-el-table header-gray lrd-el-table" height="100%" ref="memberTable" style="min-width: 400px;" stripe
                      highlight-current-row
                      :data="memberList" v-show="loaded || memberList.length > 0" v-if="reloaded" size="small" border>
                <el-table-column label="序号" type="index" width="55" align="center" fixed/>
                <el-table-column v-for="field of showFieldList" :key="field.code" show-overflow-tooltip
                                 :label="field.name" :prop="field.code"
                                 :min-width="field.width">
                    <template slot-scope="{row}">
                        <temp-var :value="row[field.alias]">
                            <template slot-scope="{value}">
                                <member-info-table-preview-field :field="field" :value="value" />
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
                                   layout="total, sizes, prev, pager, next, jumper"
                                   @current-change="pageChange"
                                   @size-change="sizeChange">
                    </el-pagination>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import TempVar from "../../../../util/TempVar";
    import {transferData} from "../../../../../js/util/utilFunction";
    import MemberInfoTablePreviewField from "../../member/common/MemberInfoTablePreviewField";

    export default {
        name: "MemberTable",
        components: {MemberInfoTablePreviewField, TempVar},
        props: ["condition"],
        data(){
            return {
                loading: false,

                memberList: [],
                memberFieldList: [],
                showFieldList:[],


                keyword: '',
                memberType: '',
                advancedCondition: {},
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                memberTotal:0,
                loaded: false,
                reloaded: true
            }
        },
        computed: {
            queryCondition() {
                let condition = {};

                let {code,topicType,value} = this.condition;

                let main = [{code,topicType,value}];
                condition.main = JSON.stringify(main);
                condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
                condition.limit = this.page.pageSize;
                return condition;
            }
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
                this.memberInfoVisible = false;
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
                                code: 'phone',
                                alias: 'phone',
                                name: '登录手机号',
                                topicType: 0,
                                advancedWidth: '200px',
                                tableName: 'main',
                                width: "200px",
                                value: null
                            },{
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
                this.loading = true;
                this.$request.get('/api/admin/member/list',{params:this.queryCondition}).then(members=>{
                    if (this.searchType === 'advanced') {
                        //遍历所有字段，将其拼凑为第一条数据
                        let condition = {};
                        for (let field of this.memberFieldList) {
                            condition[field.code] = field;
                            if (!this.advancedCondition[field.code]) {
                                this.$set(this.advancedCondition, field.code, field);
                            }
                        }
                        this.memberList = [condition];
                        this.memberList = this.memberList.concat(members.data.list);
                    } else {
                        this.memberList = members.data.list;
                    }

                    this.memberTotal = members.data.total;
                    this.$nextTick(()=>{ this.loading = false; })
                    if(!this.loaded) this.loaded = true;
                    this.reloaded = true;
                })

            }
        },
        created() {
            this.getMemberFields(()=>{
                this.loadMembers();
            });
        },
        watch: {
            keyword() {
                if (this.searchType === 'normal') {
                    this.page.currentPage = 1;
                    this.loadMembers();
                }
            },
            showFieldList:{
                deep:true,
                handler(){
                    this.page.currentPage = 1;
                    this.reloaded = false;
                    this.loadMembers();
                }
            }
        }
    }
</script>
