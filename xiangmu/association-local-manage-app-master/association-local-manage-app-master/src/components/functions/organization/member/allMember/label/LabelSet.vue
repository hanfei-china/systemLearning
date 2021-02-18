<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <!-- <el-form-item label="会员分组：" v-if="memberIds && memberIds.length === 0">
                    <member-virtual-group-multi-tree v-model="groupIds" :virtualGroup="virtualGroups" :conditions.sync='conditions'></member-virtual-group-multi-tree>
                </el-form-item> -->
                <el-form-item label="标签选择：" required>
                    <label-setting v-model="labelList" style="width: 100%;"></label-setting>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="setLabel">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import MemberVirtualGroupMultiTree from "../../../../util/group/memberGroup/MemberVirtualGroupMultiTree";
    import LabelSetting from "../../../../util/memberLabel/LabelSetting";
    export default {
        name: "LabelSet",
        components: {LabelSetting, MemberVirtualGroupMultiTree},
        props: {
            operate: Number,//0-撕标签；1-贴标签
            memberIds: Array,//会员id数组
            virtualGroups: Array,
        },
        data(){
            return {
                labelList: [],//选中的标签列表
                labelIds: [],//标签id列表
                conditions: '',
                assembleSql: '',//查询sql
                groupIds: []
            }
        },
        methods: {
            setLabel(){
                if (this.memberIds.length === 0 && this.groupIds && this.groupIds.length === 0) {
                    this.$message.warning('请选择标签设置者');
                    return;
                }

                if(this.labelList.length === 0){
                    this.$message.warning('请选择要设置的标签');
                    return;
                }
                this.labelIds = [];
                this.labelIds = this.labelList.map(item=>{
                    return item.labelId
                })

                if(this.conditions){
                    this.conditions = ` and ${this.conditions}`;
                }

                if(this.memberIds.length === 0 && !this.conditions){
                    this.conditions = ' 1=1 ';
                }

                this.$request.post('/api/admin/label/manage/labelMemberBinding',{
                    labelIds: this.labelIds,
                    memberIds: this.memberIds,
                    operate: this.operate,
                    assembleSql: this.conditions
                }).then(res=>{
                    if(res.success){
                        this.$message.success('标签设置成功');
                        this.$emit('close');
                        this.$emit('refresh')
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
