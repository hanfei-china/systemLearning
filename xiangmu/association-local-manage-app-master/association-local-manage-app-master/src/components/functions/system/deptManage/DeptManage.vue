<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">
                    所有{{typeName}}
                </div>
                <div class="flex flex-column flex-center">
                    <div>
                        <el-button icon="el-icon-plus" @click="newDept" type="text" class="custom-el-button unset-padding" size="small">
                            新增
                        </el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: true}}">
                    <div style="padding: 10px 0px 10px 0; ">
                        <el-input class="filterinp" size="mini" placeholder="请输入关键字" v-model="filterText"></el-input>
                        <el-tree ref="tree" highlight-current default-expand-all :props="treeProps" @current-change="currentChange" :data="deptList" node-key="id" :expand-on-click-node="false" :filter-node-method="filterNode">
                            <div class="flex flex-fill-in-the-remaining-space" slot-scope="{ node, data }">
                                <div class="flex-fill-in-the-remaining-space">{{ node.label }}</div>
                                <div v-if="data.id !== '0'" style="padding-right: 6px;">
                                    <el-button type="text" class="custom-el-button unset-padding"
                                               size="small" icon="el-icon-edit" @click="editDept(data.id)"/>
                                    <el-button style="margin-left: 6px;"
                                               :disabled="data.children.length > 0 || data.personNum > 0" type="text" @click="deleteDept(data.id)" class="custom-el-button unset-padding danger"  size="small" icon="el-icon-delete"/>
                                </div>
                            </div>
                        </el-tree>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body width="600px" :close-on-click-modal="false">
            <dept-form v-if="formVisible" :id="formId" @refresh="refreshList"
                       @close="formVisible = false" :type-name="typeName" :parent-id="formParentId" :seq="formSeq"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import DeptForm from "./DeptForm";
    export default {
        name: "DeptManage",
        components: {DeptForm},
        props: {
            chosenDept: Object,
            typeName: String
        },
        model: {
            prop: 'chosenDept',
            event: 'change',
        },
        data() {
            return {
                deptList: [],
                treeProps: {
                    label: 'deptName'
                },

                formTitle: '',
                formVisible: false,
                formId: '',
                formParentId: '',
                formSeq: 0,

                chosenKey: '0',
                filterText:""
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.deptName.indexOf(value) !== -1;
            },
            getDeptList() {
                this.$request.get('/api/admin/dept/manage/getDeptInfo').then(res => {
                    this.deptList = [{
                        children: [],
                        createTime: 1573110741000,
                        deptName: "所有账号",
                        id: "0",
                        parentId: null,
                        seq: -1,
                        personNum: 1
                    }].concat(res.data);

                    setTimeout(()=>{
                        this.$refs.tree.setCurrentKey(this.chosenKey);
                    },10)
                })
            },
            refreshList(){
                this.getDeptList();
            },
            newDept(){
                this.formTitle = `新增${this.typeName}`;
                this.formId = '';
                this.formVisible = true;
            },
            editDept(formId){
                this.formTitle = `编辑${this.typeName}信息`;
                this.formId = formId;
                this.formParentId = '';
                this.formVisible = true;
            },
            deleteDept(formId){
                this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/dept/manage/deleteDept',{params: {
                            deptId: formId
                        }}).then(res => {
                        if(res.success){
                            this.$message.success("删除成功");
                            this.getDeptList();
                        }
                    })
                }).catch(()=>{})
            },
            currentChange(data) {
                let {id} = data;
                this.chosenKey = data.id;
                this.formParentId = id === '0' ? null : id;
                this.$emit('change', data);
            }
        },
        mounted() {
            this.getDeptList();
        }
    }
</script>

<style lang="less" scoped>
.filterinp{
    margin: 10px;
    width: initial;
}
</style>
