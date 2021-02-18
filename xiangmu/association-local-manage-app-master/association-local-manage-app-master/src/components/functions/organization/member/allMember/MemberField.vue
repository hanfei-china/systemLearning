<template>
    <el-input v-if="fieldType === 0 || fieldType === 1" size="small" v-model="copyValue" placeholder="请输入" clearable/>
    <div v-else-if="fieldType === 2||fieldType === 15">
        <el-select v-if="config.code=='education'" size="small" v-model="copyValue" clearable>
            <el-option v-for="option of educationList" :key="option.key" :value="option.key" :label="option.title"/>
        </el-select>
        <el-select v-else-if="config.code=='college'" size="small" v-model="copyValue" clearable>
            <el-option v-for="option of collegeList" :key="option.key" :value="option.key" :label="option.title"/>
        </el-select>
        <el-select v-else-if="config.code=='major'" size="small" v-model="copyValue" clearable>
            <el-option v-for="option of majorList" :key="option.key" :value="option.key" :label="option.title"/>
        </el-select>
        <el-select v-else size="small" v-model="copyValue" clearable>
            <el-option v-for="option of parameter.options" :key="option.key" :value="option.key" :label="option.title"/>
        </el-select>
    </div>
    <el-select v-else-if="fieldType === 3" clearable size="small" multiple v-model="copyValue" collapse-tags>
        <el-option v-for="option of parameter.options" :key="option.key"
                   :value="option.key" :label="option.title"/>
    </el-select>
    <el-date-picker  v-else-if="fieldType === 5" clearable style="width: 230px;" size="small"
                     v-model="copyValue" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期"/>
    <city-choose size="small" v-model="copyValue" v-else-if="fieldType === 6" :show-city="parameter.cityType === 'city'"/>
    <el-cascader size="small" v-else-if="fieldType === 8" clearable v-model="copyValue" :options="options" :props="props" :show-all-levels="false"/>
    <el-rate v-else-if="fieldType === 11" v-model="copyValue"/>
<!--    <unit-choose v-else-if="fieldType === 10" v-model="copyValue"/>-->
    <advanced-label-choose v-else-if="fieldType === 12" v-model="copyValue"/>
    <span v-else style="color: #CBCBCB;">此项不支持搜索</span>
</template>

<script>
    import CityChoose from "../../../util/city/CityChoose";
    import AdvancedLabelChoose from "../../../util/memberLabel/AdvancedLabelChoose";
    export default {
        name: "MemberField",
        components: {AdvancedLabelChoose, CityChoose},
        props: ['value', 'config','educationList','collegeList','majorList'],
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                copyValue: null,
                options: [],
                props:{
                    label: "enumName",
                    value: "enumName",
                    children: "subLayer"
                },
            }
        },
        computed: {
            fieldType() {
                return this.config.topicType;
            },
            parameter() {
                return this.config.parameter;
            },
            enumId() {
                return this.config.parameter && this.config.parameter.enumId ? this.config.parameter.enumId : null;
            }
        },
        methods:{
            deleteSublayer(array){
                for (let i = 0; i < array.length; i++) {
                    if (array[i]['subLayer'].length === 0) {
                        delete array[i]['subLayer'];
                    } else {
                        this.deleteSublayer(array[i]['subLayer']);
                    }
                }
                return array;
            }
        },
        created() {
            if (this.value) {
                this.copyValue = JSON.parse(JSON.stringify(this.value));
            }
            if (this.enumId) {
                this.$request.get('/api/admin/associator/getEnumNodes',{
                    params: {enumId: this.enumId}
                }).then(data=>{
                    if(data.success){
                        let options = data.data;
                        this.options = this.deleteSublayer(options);
                    }
                })
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            },
        }
    }
</script>
