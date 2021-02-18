<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="100px" size="small">
                <el-form-item label="页签名称：" required>
                    <el-input placeholder="请输入页签名称" v-model="copyItem.title"/>
                </el-form-item>
                <el-form-item label="查询条件：" required>
                    <div style="height: 300px;">
                        <vue-scroll>
                            <member-group-condition :fields="fields" :item="copyItem.condition"/>
                        </vue-scroll>
                    </div>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="unset-padding flex flex-column flex-center">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="change">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import QueryBuilder from "./js/queryBuilder";
    import MemberGroupCondition from "./MemberGroupCondition";
    export default {
        name: "MemberQueryBuilderSetting",
        components: {MemberGroupCondition},
        props:{
            item: Object,
            fields: {
                type: Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return {
                copyItem: {}
            }
        },
        methods:{
            change(){
                this.$emit('change',this.copyItem);
            }
        },
        created() {
            this.copyItem = new QueryBuilder(this.item);
        }
    }
</script>
