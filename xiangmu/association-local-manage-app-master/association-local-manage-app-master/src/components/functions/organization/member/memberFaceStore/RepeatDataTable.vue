<template>
    <el-container>
        <el-main class="unset-padding">
            <el-table :data="list" height="400px" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="index" label="序号" width="55" align="center"/>
                <el-table-column v-for="field of showFieldList" :key="field.code" show-overflow-tooltip
                                 :label="field.name" :prop="field.code" :min-width="field.width">
                    <template v-slot="{row}">
                        <temp-var :value="row[field.alias]">
                            <template slot-scope="{value}">
                                <member-info-table-preview-field :field="field" :value="value"></member-info-table-preview-field>
                            </template>
                        </temp-var>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import MemberInfoTablePreviewField from "../common/MemberInfoTablePreviewField";
    import TempVar from "../../../../util/TempVar";
    export default {
        name: "RepeatDataTable",
        components: {TempVar, MemberInfoTablePreviewField},
        props: {
            list: Array
        },
        data(){
            return {
                memberFieldList: [],
                showFieldList: []
            }
        },
        created() {
            this.getMemberFields();
        },
        methods: {
            getMemberFields() {
                let unitParams = {
                    orderWay: 1,
                    limit: 10000000,
                    offset: 0,
                };
                let labelParams = {
                    type: 0
                };
                Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo'),
                    this.$request.get('/api/admin/memberType/getMemberTypes'),
                    this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams}),
                    this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params: labelParams})])
                    .then(([fields, memberTypes, units, labels]) => {
                        let _memberTypes = [];
                        memberTypes.data.map(memberType => {
                            _memberTypes.push({
                                key: memberType.id,
                                title: memberType.typeName
                            })
                        });

                        let unitOptions = [];
                        units.data.list.map(unit => {
                            unitOptions.push({
                                key: unit.id,
                                title: unit.organizationName
                            })
                        });

                        let labelOptions = [];
                        labels.data.map(label => {
                            labelOptions.push({
                                key: label.id,
                                title: label.title
                            })
                        });

                        let tempFields = fields.data.filter((field) => {
                            return field.topicType !== 9;
                        });

                        this.memberFieldList = [].concat(
                            tempFields.map((field) => {
                                let {code, parameter, topicType, tableName, alias} = field;
                                if (!tableName) {
                                    field.tableName = 'main';
                                }
                                field.width = "200px";
                                field.value = null;

                                if (typeof parameter === 'string' && parameter && parameter.trim()) {
                                    parameter = JSON.parse(parameter);
                                } else {
                                    parameter = {};
                                }

                                if (topicType === 10) {
                                    field.topicType = 2;
                                    parameter = {
                                        options: unitOptions
                                    };
                                }

                                if (topicType === 12) {
                                    parameter = {
                                        options: labelOptions
                                    };
                                }

                                if (!alias) {
                                    field.alias = code;
                                }

                                field.parameter = parameter;
                                return field;
                            }));

                        this.showFieldList = JSON.parse(JSON.stringify(this.memberFieldList));
                    })
            },
        }
    }
</script>

<style scoped>

</style>