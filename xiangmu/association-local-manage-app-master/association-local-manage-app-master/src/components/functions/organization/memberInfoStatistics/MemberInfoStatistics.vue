<template>
    <el-container class="absolute-fill-parent background-color-white"
                  v-loading="loading" element-loading-text="数据统计中......"
                  element-loading-spinner="el-icon-loading">
        <el-aside class="unset-padding position-relative border-right" width="200px">
            <statistics-query-list @select="setChosenQuery"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent" v-if="chosenQuery">
                <el-header class="border-bottom flex flex-column flex-center">
                    <div class="flex">
                        <div class="flex flex-center flex-column">当前查询条件：&nbsp;&nbsp;&nbsp;</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <block-breadcrumb>
                                <block-breadcrumb-item v-for="(field,index) of showFields" :key="field.code"
                                                       :active="index <= fieldsIndex"
                                                       :class="{'cursor-pointer': index <= fieldsIndex}"
                                                       @click.native="setFieldsIndex(index)">
                                    <template v-slot>
                                        <div class="flex">
                                            <div>{{field.name}}</div>
                                            <template
                                                    v-if="index < fieldsIndex || (index === fieldsIndex && Array.isArray(field.valueName)) ">
                                                <template v-if="Array.isArray(field.valueName)">
                                                    <div class="flex" v-if="field.valueName.length > 0">：
                                                        <block-breadcrumb-sub-item
                                                                v-for="(value, level) of field.valueName" :key="level"
                                                                @click.native.stop="setLevel(index,level)">
                                                            {{value}}
                                                        </block-breadcrumb-sub-item>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    ：{{field.valueName}}
                                                </template>
                                            </template>
                                        </div>
                                    </template>
                                </block-breadcrumb-item>
                            </block-breadcrumb>
                        </div>
                        <div class="flex flex-column flex-center">
                            <div>
                                <el-checkbox v-show="chartType !== 'geo'" v-model="showZero">显示空值</el-checkbox>
                                <el-checkbox v-show="chartType === 'geo'" v-model="showDetail">数据视图</el-checkbox>
                            </div>
                        </div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <el-container class="absolute-fill-parent flex flex-column">
                        <el-main class="unset-padding position-relative drilling-member-chart-container"
                                 v-show="showChart" :class="{full: !showTable}">
                            <drilling-chart :data="data" :fields="queryCondition" :hidden-zero-data="!showZero"
                                            @drilling-down="drillingDown" @type-change="chartTypeChange"
                                            @item-change="itemChange" @items-change="itemsChange"/>
                        </el-main>
                        <el-main class="position-relative unset-padding drilling-member-table-container"
                                 :class="{full:showDetail,'border-top':!showDetail}" v-show="showTable">
                            <drilling-member-table ref="table" :condition="queryCondition" :query-id="chosenQuery.id"
                                                   :chart-items="chartItems" :label-list="labelList"/>
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import StatisticsQueryList from "./statisticsQuery/StatisticsQueryList";
    import DrillingChart from "./statisticsQuery/DrillingChart";
    import BlockBreadcrumb from "../../../util/blockBreadcrumb/BlockBreadcrumb";
    import BlockBreadcrumbItem from "../../../util/blockBreadcrumb/BlockBreadcrumbItem";
    import BlockBreadcrumbSubItem from "../../../util/blockBreadcrumb/BlockBreadcrumbSubItem";
    import DrillingMemberTable from "./statisticsQuery/DrillingMemberTable";

    export default {
        name: "MemberInfoStatistics",
        components: {
            DrillingMemberTable,
            BlockBreadcrumbSubItem, BlockBreadcrumbItem, BlockBreadcrumb, DrillingChart, StatisticsQueryList
        },
        data() {
            return {
                chosenQuery: null,
                fields: [],
                fieldsIndex: 0,
                data: {},
                showFields: [],
                chartType: 'geo',
                showDetail: false,
                loading: false,

                showZero: true,
                chartItems: [],
                labelList: []
            }
        },
        computed: {
            showChart() {
                return !this.showDetail;
            },
            showTable() {
                return this.chartType !== 'geo' || this.showDetail;
            },
            formatFields() {
                if (this.fields.length < 1) {
                    return null;
                }

                let fields = {};
                this.fields.map(field => {
                    fields[field.code] = field;
                });

                return fields;
            },
            maxFieldsIndex() {
                let length = this.showFields.length;
                return length > 0 ? length - 1 : 0;
            },
            queryCondition() {
                if (this.showFields.length > 0) {
                    let conditions = [];

                    for (let i = 0; i <= this.fieldsIndex; i++) {
                        let {topicType, code, parameter, name, value, level, items} = this.showFields[i];
                        let condition = {
                            topicType, code, parameter, name, value, level, items
                        };
                        conditions.push(condition);
                    }

                    return conditions;
                }

                return [];
            }
        },
        methods: {
            setChosenQuery(query) {
                this.chosenQuery = query;
            },
            chartTypeChange(type) {
                this.chartType = type;
            },
            getFields() {

                Promise.all([this.$request.get('/api/common/associator/getFieldsInfoByWeChat', {params: {topicTypes: [2, 3, 6, 8]}}),
                    this.$request.get('/api/admin/memberType/getMemberTypes'),
                    this.$request.get('/api/common/branch/branchList', {params: {needMain: true, sort: 'seq asc'}}),
                    this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params: {type: 0}})
                ]).then(([fields, memberTypes, branchList, labels]) => {
                    let labelList = JSON.parse(JSON.stringify(labels.data));
                    for (let item of labelList) {
                        for (let label of item.labels) {
                            label.color = item.color;
                            label.isMultiple = item.isMultiple;
                        }
                    }

                    for(let item of labelList){
                        for (let label of item.labels) {
                            this.labelList.push(label);
                        }
                    }

                    let result = fields.data;

                    let _memberTypes = [];
                    memberTypes.data.map(memberType => {
                        _memberTypes.push({
                            key: memberType.id,
                            title: memberType.typeName
                        })
                    });

                    let _branchList = [];
                    branchList.data.list.map(branch => {
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

                    result.push({
                        code: 'label',
                        name: '标签',
                        topicType: 8,
                        parameter: JSON.stringify(labels.data),
                    });


                    this.fields = result;

                })
            },
            setFieldsIndex(index) {
                if (index < this.fieldsIndex) {

                    for (let i = index; i < this.fieldsIndex; i++) {
                        let field = this.showFields[i];

                        let {topicType, parameter} = field;
                        if (topicType === 8 || topicType === 6) {
                            field.value = [];
                            field.valueName = [];
                            field.level = 0;
                            field.items = parameter;
                            field.itemsList = [parameter];
                        }
                    }

                    this.fieldsIndex = index;
                }
            },
            setLevel(fieldIndex, level) {
                if (fieldIndex === this.fieldsIndex) {
                    let field = this.showFields[fieldIndex];

                    let {topicType, valueName, itemsList} = field;
                    if (topicType === 8) {
                        let size = valueName.length - level;
                        field.level = level;
                        field.valueName.splice(level, size);
                        field.value.splice(level, size);
                        field.items = itemsList[level];
                        field.itemsList.splice(level + 1, size);
                    }

                    if (topicType === 6) {
                        field.value = [];
                        field.valueName = [];
                        field.level = 0;
                    }
                }

                if (fieldIndex < this.fieldsIndex) {
                    for (let i = fieldIndex; i < this.fieldsIndex; i++) {
                        let field = this.showFields[i];

                        let {topicType, parameter, valueName, itemsList} = field;
                        if (topicType === 8) {
                            if (fieldIndex === i) {
                                let size = valueName.length - level;
                                field.level = level;
                                field.valueName.splice(level, size);
                                field.value.splice(level, size);
                                field.items = itemsList[level];
                                field.itemsList.splice(level + 1, size);
                            } else {
                                field.value = [];
                                field.valueName = [];
                                field.level = 0;
                                field.items = parameter;
                                field.itemsList = [parameter];
                            }
                        }

                        if (topicType === 6) {
                            field.value = [];
                            field.valueName = [];
                            field.level = 0;
                            field.items = parameter;
                            field.itemsList = [parameter];
                        }
                    }
                }

                this.fieldsIndex = fieldIndex;
            },
            drillingDown(data) {
                let {field, enumIndex} = data;
                let {topicType, enumItems, code, labelItems} = field;
                if(code === 'label'){
                    let labelType = labelItems[enumIndex];
                    let {labels} = labelType;
                    if(labels && labels.length > 0){
                        let condition = this.showFields[this.fieldsIndex];
                        let {value, valueName, level} = condition;

                        value.push(data.code);
                        valueName.push(data.name);

                        condition.value = value;
                        condition.valueName = valueName;
                        condition.level = level + 1;
                        let items = JSON.stringify(labels);
                        condition.items = items;
                        condition.itemsList.push(items);
                    }else{
                        if (this.fieldsIndex < this.maxFieldsIndex) {
                            //可以下钻
                            let condition = this.showFields[this.fieldsIndex];
                            let {value, valueName, level} = condition;

                            value.push(data.code);
                            valueName.push(data.name);

                            condition.value = value;
                            condition.valueName = valueName;
                            condition.level = level + 1;
                            this.fieldsIndex += 1;
                        } else {
                            this.$refs.table.valueChange(data.code);
                        }
                    }
                }else{
                    if (topicType === 8) {
                        let enumItem = enumItems[enumIndex];
                        let {subLayer} = enumItem;
                        if (subLayer && subLayer.length > 0) {
                            let condition = this.showFields[this.fieldsIndex];
                            let {value, valueName, level} = condition;

                            value.push(data.code);
                            valueName.push(data.name);

                            condition.value = value;
                            condition.valueName = valueName;
                            condition.level = level + 1;
                            let items = JSON.stringify(subLayer);
                            condition.items = items;
                            condition.itemsList.push(items);
                        } else {
                            if (this.fieldsIndex < this.maxFieldsIndex) {
                                //可以下钻
                                let condition = this.showFields[this.fieldsIndex];
                                let {value, valueName, level} = condition;

                                value.push(data.code);
                                valueName.push(data.name);

                                condition.value = value;
                                condition.valueName = valueName;
                                condition.level = level + 1;
                                this.fieldsIndex += 1;
                            } else {
                                this.$refs.table.valueChange(data.code);
                            }
                        }


                    } else if (topicType === 6) {
                        if (this.fieldsIndex < this.maxFieldsIndex) {
                            //可以下钻
                            let condition = this.showFields[this.fieldsIndex];
                            let {value, valueName} = condition;

                            value.push(data.code);
                            valueName.push(data.name);
                            this.fieldsIndex += 1;
                        } else {
                            this.$refs.table.valueChange(data.code);
                        }
                    } else {
                        if (this.fieldsIndex < this.maxFieldsIndex) {
                            //可以下钻
                            let condition = this.showFields[this.fieldsIndex];
                            condition.value = data.code;
                            condition.valueName = data.name;
                            this.fieldsIndex += 1;
                        } else {
                            this.$refs.table.valueChange(data.code);
                        }
                    }
                }



            },
            buildShowFields() {
                if (this.formatFields && this.chosenQuery) {
                    let fields = [];
                    let queryConfig = JSON.parse(this.chosenQuery.queryConfig);

                    for (let code of queryConfig) {
                        let field = this.formatFields[code];

                        if (field) {
                            let {topicType, parameter} = field;
                            let condition = {
                                ...field,
                                value: null,
                                level: 0,
                                valueName: null
                            };

                            if (topicType === 8 || topicType === 6) {
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
            itemChange(item) {
                this.$refs.table.valueChange(item.code);
            },
            itemsChange(items) {
                this.chartItems = items;
            }
        },
        created() {
            this.getFields();
        },
        watch: {
            chosenQuery() {
                this.showDetail = false;
                this.fieldsIndex = 0;
                this.showFields = this.buildShowFields();
            },
            queryCondition(val) {
                if (val && val.length > 0) {
                    this.loading = true;
                    this.$request.post('/api/admin/member/statistics/result/query', {queryConditionEntities: val}).then(res => {
                        this.data = res.data;
                        setTimeout(() => {
                            this.$nextTick(()=>{ this.loading = false; })
                        }, 1000);
                    });
                }
            },
            formatFields() {
                this.showFields = this.buildShowFields();
            },
            width() {
                if (this.chartType !== 'geo' && this.width >= 800) {
                    this.showDetail = false;
                }
            },
            chartType(val) {
                if (val === 'geo') {
                    this.showZero = true;
                }
            }
        }
    }
</script>
<style lang="less">

    .drilling-member-chart-container {
        &:not(.full) {
            max-height: 300px;
        }
    }

    .drilling-member-table-container {

    }
</style>
