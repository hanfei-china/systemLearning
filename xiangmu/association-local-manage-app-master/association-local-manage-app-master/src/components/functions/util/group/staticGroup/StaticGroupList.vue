<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">{{title}}</div>
                <div class="flex flex-column flex-center">
                    <el-button v-if="editable" type="text" class="unset-padding" @click="createGroup" size="small" icon="el-icon-plus">新增</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-loading="loading">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <el-menu @select="setChosen" class="border-right-unset custom-el-menu" :default-active="chosenKey">
                        <el-menu-item v-for="group of groupList" :index="group.id" :key="group.id">
                            <div class="flex static-group">
                                <div class="flex-fill-in-the-remaining-space text-overflow" style="width: 160px;">{{group.name}}</div>
                                <div class="static-group-handle" v-if="group.id !== '0' && editable" :class="{'choose-group':chosenKey === group.id}">
                                    <i class="el-icon-edit primary-tip" style="font-size: 14px;width: 16px;"  @click.stop="editGroup(group)"></i>
                                    <i class="el-icon-delete danger-tip" style="font-size: 14px;width: 16px;margin-right: 0;" @click.stop="deleteGroup(group)" ></i>
                                </div>
                            </div>
                        </el-menu-item>
                    </el-menu>
                </vue-scroll>
            </div>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body width="600px"
                   :close-on-click-modal="false">
            <el-input :maxLength="20" size="small" :placeholder="`请输入${typeName}名称，20字以内`" v-model="formName"></el-input>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="formVisible=false">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>

    export default {
        name: "StaticGroupList",
        props: {
            chosenGroup: String,
            typeName: String,
            groupType: String,
            title: {
                type: String,
                default: '所有分组'
            },
            hasAll: {
                type: Boolean,
                default: true
            },
            allGroup: {
                type: String,
                default: '所有分组'
            },
            maxLevel: {
                type: Number,
                default: null
            },
            operable: {
                type: Boolean,
                default: true
            },
            describable: {
                type: Boolean,
                default: false
            },
            editable:{
                type: Boolean,
                default: true
            },
            groupName: String
        },
        model: {
            prop: 'chosenGroup',
            event: 'change',
        },
        computed: {
            allNode() {
                if (this.hasAll) {
                    return [
                        {
                            id: this.rootId,
                            localId: this.rootId,
                            name: this.allGroup,
                            parentId: null,
                            isFolder: true,
                            children: [],
                        }
                    ];
                } else {
                    return [];
                }
            },
            chosenNode(){
                if(this.chosenKey){
                    for(let group of this.groupList){
                        let {id} = group;
                        if(id === this.chosenKey) return group;
                    }
                }

                return null;
            }
        },
        data() {
            return {
                rootId: '0',
                chosenKey: '0',

                groupList: [],

                formTitle: '',
                formVisible: false,
                formSeq: 0,
                formId: null,
                formName: null,
                loading: true,


                groupInfoType: null,//创建的分组类型

            }
        },
        methods: {
            setChosen(chosenKey){
                this.chosenKey = chosenKey;
            },
            getGroupList() {
                this.loading = true;
                this.$request.get('/api/admin/group/getGroup', {params: {type: this.groupType}}).then(res => {
                    this.groupList = this.allNode.concat(res.data);
                    if(this.groupList.length>0){
                        this.chosenKey = this.groupList[0].id;
                    }
                    this.$nextTick(()=>{ this.loading = false; })
                });
            },
            refreshList() {
                this.formId = null;
                this.formName = null;
                this.formVisible = false;
                this.getGroupList();
            },

            //新建分组或文件夹
            createGroup(){
                this.formTitle = `新增${this.typeName}`;
                this.formId = null;
                this.formName = null;
                this.formVisible = true;
            },

            editGroup(group) {
                this.formTitle = `编辑${this.typeName}信息`;
                this.formId = group.id;
                this.formName = group.name;
                this.formVisible = true;
            },

            submitData(){
                if(!this.formName){
                    this.$message.warning(`请输入${this.typeName}名称`);
                    return;
                }

                let data = {
                    name: this.formName,
                    parentId: null,
                    seq: this.hasAll ? this.groupList.length - 1 : this.groupList.length,
                    type: this.groupType,
                    descriptions: '',
                    isFolder: false,//是否创建文件夹
                    groupType: 0,//分组类型
                };
                if (this.formId) {
                    data.id = this.formId;
                    this.$request.put('/api/admin/group/updateGroup', data).then(() => {
                        this.refreshList();
                        this.$message.success(`${this.typeName}信息修改成功`);
                    })
                } else {
                    this.$request.post('/api/admin/group/addGroup', data).then(() => {
                        this.refreshList();
                        this.$message.success(`${this.typeName}添加成功`);
                    })

                }
            },

            deleteGroup(group) {
                this.$confirm(`此操作将永久删除${group.name}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/group/deleteGroup', {
                        params: {
                            id: group.id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getGroupList(true);
                        }
                    })
                }).catch(() => {
                })
            },
        },
        mounted() {
            this.groupList = this.allNode;
            this.getGroupList();
        },
        watch:{
            chosenKey:{
                immediate: true,
                handler(value){
                    this.$emit('change',value === '0' ? null : value);
                }
            },
            chosenNode(chosenNode){
                if(chosenNode){
                    this.$emit('update:groupName',chosenNode.name);
                }
            }
        }
    }
</script>
<style lang="less">
    .static-group-handle:not(.choose-group){
        display: none;
    }
    .static-group:hover{

        .static-group-handle{
            display: block;
        }
    }
</style>
