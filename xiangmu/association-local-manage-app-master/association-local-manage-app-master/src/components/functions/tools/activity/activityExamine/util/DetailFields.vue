<template>
    <div class="flex" style="height: 100%;">
        <div class="flex-fill-in-the-remaining-space">
            <div style="height: 32px;line-height: 32px;overflow: hidden">{{field.name}}</div>
            <div v-if="field.topicType === 0">
                <el-form size="small" label-width="100px">
                    <el-form-item label="数据检验规则:">
                        {{parameter.regularType | regularTypeFilter}}
                    </el-form-item>
                    <el-form-item label="自定义表达式:"
                                  v-show="field.regularType === 'custom'">
                        {{parameter.regularString}}
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="field.topicType === 2 || field.topicType === 3">
                <div class="singleList">
                    <div class="zu" v-for="(item,index) in parameter.options" :key="index">
                        <i class="iconfont icon-danxuan danxuan"/>
                        <p>{{item.title}}</p>
                    </div>
                </div>
            </div>
            <div class="uploadImg" v-if="field.topicType === 4">
                <i class="el-icon-plus"/>
            </div>
        </div>
        <div class="text-align-center flex flex-column flex-center" style="flex: 0 0 165px;height: 100%;">
            <span v-if="field.necessary">必填</span>
            <span v-else>非必填</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailFields",
        props: {
            field: Object
        },
        computed:{
            parameter: function () {
                return JSON.parse(this.field.parameter)
            }
        },
        filters: {
            regularTypeFilter(val) {
                const regularTypes = [
                    {code: 'unset', title: '不校验'},
                    {code: 'email', title: '电子邮箱'},
                    {code: 'chinaMobile', title: '中国大陆手机号'},
                    {code: 'chinaIdCard', title: '中国大陆身份证号'},
                    {code: 'custom', title: '自定义校验规则'}
                ];

                for (let i = 0; i < regularTypes.length; i++) {
                    if (regularTypes[i].code === val) {
                        return regularTypes[i].title;
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>
