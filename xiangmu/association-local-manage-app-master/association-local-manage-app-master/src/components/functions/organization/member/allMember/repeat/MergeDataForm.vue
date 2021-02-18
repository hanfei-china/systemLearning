<template>
    <el-container>
        <el-main class="unset-padding" style="height: 400px;">
            <vue-scroll>
                <el-form size="small" class="custom-el-form column">
                    <el-form-item v-for="field in fieldList" :key="field.id">
                        <template v-slot:label>
                            <span class="custom-el-form-item-label">
                                {{field.name}}：
                            </span>
                        </template>
                        <edit-field :code="field.code" :config="field" :repeatForm="repeatForm" v-model="field.value"/>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" class="unset-padding">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('closePage')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="mergeData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import EditField from "./EditField";

    export default {
        name: "MergeDataForm",
        components: {EditField},
        props: ['repeatForm', 'id', 'ids', 'mergeDataInfo'],
        data() {
            return {
                fieldList: [],
                memberInfo: {}
            }
        },
        created(){
            this.getFieldList();
        },
        methods: {
            getFieldList() {
                let unitParams = {
                    orderWay: 1,
                    limit: 10000000,
                    offset: 0,
                };
                Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo'),
                    this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams})])
                    .then(([fields, units]) => {
                        let unitOptions = [];
                        units.data.list.map(unit => {
                            unitOptions.push({
                                key: unit.id,
                                title: unit.organizationName
                            })
                        });

                        let tempFields = fields.data.filter((field) => {
                            return field.topicType !== 9;
                        });

                        this.fieldList = [].concat(
                            tempFields.map((field) => {
                                let {code, parameter, topicType, alias} = field;

                                if(topicType === 5){
                                    let date = new Date(this.mergeDataInfo[code]);
                                    this.$set(field, 'value', JSON.stringify(date));
                                }else {
                                    this.$set(field, 'value', this.mergeDataInfo[code]);
                                }

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

                                if (!alias) {
                                    field.alias = code;
                                }

                                field.parameter = parameter;
                                return field;
                            }));
                    })
            },
            mergeData() {
                for (let field of this.fieldList) {
                    if(field.topicType === 5){
                        this.$set(this.memberInfo, field.code, {'value': JSON.parse(field.value), 'topicType': field.topicType})
                    }else {
                        this.$set(this.memberInfo, field.code, {'value': field.value, 'topicType': field.topicType})
                    }
                }
                this.$request.post('/api/admin/member/mergeMemberData', {
                    id: this.id,
                    ids: this.ids,
                    memberInfo: this.memberInfo
                }).then(res => {
                    if(res.success){
                        this.$message.success('数据合并成功');
                        this.$emit("close")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
