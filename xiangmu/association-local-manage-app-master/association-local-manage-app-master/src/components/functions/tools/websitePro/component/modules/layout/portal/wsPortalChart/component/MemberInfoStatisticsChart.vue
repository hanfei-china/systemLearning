<template>
    <div class="website-pro-absolute-fill-parent">
        <portal-statistics-chart-view :data="data" :fields="queryCondition"
                                      :show-bar="showBar" :show-pie="showPie"/>
    </div>
</template>

<script>
    import PortalStatisticsChartView from "../../../../../../../../organization/memberInfoStatistics/statisticsQuery/PortalStatisticsChartView";
    export default {
        name: "MemberInfoStatisticsChart",
        components: {PortalStatisticsChartView},
        props:{
            module: Object
        },
        data(){
            return {
                fields: [],
                queryEntity: null,
                showFields: [],
                data: {},
                fieldsIndex: 0,
            }
        },
        computed:{
            funcGroup(){
                return this.module.attributes.funcGroup.attributes;
            },
            showBar(){
                return this.funcGroup.showBar.value;
            },
            showPie(){
                return this.funcGroup.showPie.value;
            },
            queryId(){
                return this.funcGroup.memberInfoStatistics.value;
            },
            formatFields(){
                if(this.fields.length < 1){
                    return null;
                }

                let fields = {};
                this.fields.map(field => {
                    fields[field.code] = field;
                });

                return fields;
            },
            queryCondition(){
                if(this.showFields.length > 0){
                    let conditions = [];

                    for(let i=0; i<= this.fieldsIndex; i++){
                        let {topicType,code,parameter,name,value,level,items} = this.showFields[i];
                        let condition = {
                            topicType,code,parameter,name,value,level,items
                        };
                        conditions.push(condition);
                    }

                    return conditions;
                }

                return [];
            }
        },
        methods:{
            getFields(){
                Promise.all([this.$request.get('/api/common/associator/getFieldsInfoByWeChat',{params:{topicTypes:[2,3,6,8]}}),
                    this.$request.get('/api/admin/memberType/getMemberTypes'),
                    this.$request.get('/api/common/branch/branchList',{params:{needMain:true, sort: 'seq asc'}})]).then(([fields,memberTypes,branchList])=>{

                    let result = fields.data;

                    let _memberTypes = [];
                    memberTypes.data.map(memberType=>{
                        _memberTypes.push({
                            key: memberType.id,
                            title: memberType.typeName
                        })
                    });

                    let _branchList = [];
                    branchList.data.list.map(branch=>{
                        _branchList.push({
                            key: branch.id,
                            title: branch.name
                        })
                    });

                    result = result.concat([
                        {
                            code: "status",
                            name: "激活状态",
                            parameter: '{"options":[{"key":"1","title":"已激活","optionType":0},{"key":"0","title":"未激活","optionType":0}]}',
                            topicType: 2
                        },
                        {
                            code: "registerMode",
                            name: "注册方式",
                            parameter: '{"options":[{"key":"1","title":"后台导入","optionType":0},{"key":"0","title":"用户注册","optionType":0},{"key":"2","title":"活动导入","optionType":0}]}',
                            topicType: 2
                        }]);

                    result.push({
                        code: 'memberTypeId',
                        name: '会员类型',
                        topicType: 2,
                        parameter: JSON.stringify({
                            options: _memberTypes
                        }),
                    });

                    result.push({
                        code: 'branch',
                        name: '分会',
                        topicType: 2,
                        parameter: JSON.stringify({
                            options: _branchList
                        }),
                    });

                    this.fields = result;

                })
            },
            getQueryInfo(){
                if(this.queryId){
                    this.$request.get('/api/admin/member/statistics/query',{
                        params: {id: this.queryId}
                    }).then(res=>{
                        this.queryEntity = res.data
                        this.showFields = this.buildShowFields();
                    })
                }
            },
            buildShowFields(){
                if(this.formatFields && this.queryEntity){
                    let fields = [];
                    let queryConfig = JSON.parse(this.queryEntity.queryConfig);

                    for(let code of queryConfig){
                        let field = this.formatFields[code];

                        if(field){
                            let {topicType,parameter} = field;
                            let condition = {
                                ...field,
                                value: null,
                                level:0,
                                valueName: null
                            };

                            if(topicType === 8 || topicType === 6){
                                condition.items = parameter;
                                condition.itemsList = [parameter];
                                condition.value = [];
                                condition.valueName = [];
                            }
                            fields.push(condition);
                        }
                    }

                    return fields;
                }

                return [];
            },
        },
        created() {
            this.getFields();
            this.getQueryInfo();
        },
        watch:{
            formatFields(){
                this.showFields = this.buildShowFields();
            },
            queryId(){
                this.getQueryInfo();
            },
            queryCondition(val){
                if(val && val.length > 0){
                    this.loading = true;
                    this.$request.post('/api/admin/member/statistics/result/query',{queryConditionEntities:val}).then(res=>{
                        this.data = res.data;
                    });
                }
            }
        }
    }
</script>

