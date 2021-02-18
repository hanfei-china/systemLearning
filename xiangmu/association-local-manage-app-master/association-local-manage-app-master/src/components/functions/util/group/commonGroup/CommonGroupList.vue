<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">{{title}}</div>
                <div class="flex flex-column flex-center" v-if="operable">
                    <div>
                        <el-dropdown @command="handleCommand">
                            <el-button icon="el-icon-plus" type="text"
                                       class="custom-el-button unset-padding" size="small">
                                新增
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in createItems" :key="item.id" :command="item">
                                    <div>
                                        <i :class="item.icon" style="margin-right: 5px;line-height: 32px;"></i>
                                        <span>{{item.title}}</span>
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-loading="loading">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel : {scrollingX : true}, bar : {keepShow : true}}">
                    <div style="padding: 10px 0;">
                        <el-tree ref="tree" highlight-current :props="treeProps"
                                 @current-change="currentChange" :data="groupList"
                                 node-key="id" :expand-on-click-node="false"
                                 @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag">
                            <div class="flex flex-fill-in-the-remaining-space" slot-scope="{data}">
                                <i :class="data.icon"  style="margin-right: 5px;line-height: 19px;"></i>
                                <div class="flex-fill-in-the-remaining-space"
                                     @mouseover="setTreeNodeVisible(data,true)" @mouseout="setTreeNodeVisible(data,false)">
                                    {{ data.name }}
                                </div>
                                <div v-if="data.id !== '0' && !data.unRealEntity"  style="padding:0 10px;"
                                     :style="{display: treeNodeVisibleId === data.localId || chosenKey === data.localId ?'block':'none'}">
                                    <el-button type="text" class="custom-el-button unset-padding"
                                               size="small" icon="el-icon-edit" @click="editGroup(data.id, data.groupType)"/>
                                    <el-button style="margin-left: 6px;" type="text"
                                               @click="deleteGroup(data.id)"
                                               class="custom-el-button unset-padding danger" size="small"
                                               icon="el-icon-delete"/>
                                </div>
                            </div>
                        </el-tree>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body width="800px"
                   :close-on-click-modal="false">
            <common-group-form v-if="formVisible" :id="formId" @refresh="refreshList" :options-data="optionsData"
                               @close="formVisible = false" :type-name="typeName" :parent-id="formParentId" :seq="formSeq"
                               :groupType="groupType" :isFolder="isFolder" :groupInfoType="groupInfoType"/>
        </el-dialog>
    </el-container>
</template>

<script>

    import {treeFormingVirtualGroup} from "../memberGroup/js/memberGroupTools";
    import CommonGroupForm from "./CommonGroupForm";

    export default {
        name: "CommonGroupList",
        components: {CommonGroupForm},
        props: {
            chosenGroup: Object,
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
            }
        },
        data() {
            return {
                rootId: '0',
                chosenKey: '0',

                groupList: [],
                treeProps: {
                    label: 'name'
                },

                formTitle: '',
                formVisible: false,
                formId: '',
                formParentId: null,
                formSeq: 0,

                nodeIds: [],

                chosenNode: null,
                loading: true,

                isFolder: null,//创建文件夹或分组
                parentFolder: null,//创建分组或文件夹的上一级是否是文件夹

                createItems: [
                    {
                        id: -1,
                        title: '文件夹',
                        icon: 'el-icon-folder',
                    },
                    {
                        id: 0,
                        title: '静态分组',
                        icon: 'el-icon-video-pause',
                    },
                ],

                groupInfoType: null,//创建的分组类型

                treeNodeVisibleId: '',

                optionsData: {
                    enumFields: [],
                    conditionFields: [],
                    labels: [],
                    originalGroups:[]
                },
                defaultExpandedKeys:[]
            }
        },
        methods: {
            setTreeNodeVisible(data,isShow){
                if(data && isShow){
                    this.treeNodeVisibleId = data.id;
                }else {
                    this.treeNodeVisibleId = '';
                }
            },
            allowDrop(draggingNode, dropNode, type) {
                if (dropNode.data.id === this.rootId) {
                    if (draggingNode.data.parentId === null || draggingNode.data.parentId === undefined) {
                        return type !== 'inner' && type !== 'prev';
                    } else {
                        return false;
                    }
                } else {
                    if (draggingNode.data.parentId === dropNode.data.parentId) {
                        return type !== 'inner';
                    } else {
                        return false;
                    }
                }
            },
            allowDrag(draggingNode) {
                return draggingNode.data.id !== this.rootId;
            },
            handleDrop() {
                if (this.nodeIds && this.nodeIds.length === 0) {
                    this.getNodeId(this.groupList);
                } else {
                    this.nodeIds = [];
                    this.getNodeId(this.groupList);
                }

                this.$request.post('/api/admin/group/orderGroup', null, {params: {ids: this.nodeIds}}).then(res => {
                    if (res.success) {
                        this.getGroupList()
                    }
                })
            },
            getNodeId(list) {
                for (let item of list) {
                    this.nodeIds.push(item.id);
                    if (item.children && item.children.length > 0) {
                        this.getNodeId(item.children);
                    }
                }
            },

            getGroupList(sortable) {
                this.loading = true;
                this.$request.get('/api/admin/group/getGroup', {params: {type: this.groupType}}).then(res => {
                    this.optionsData.originalGroups = res.data;
                    this.groupList = treeFormingVirtualGroup(this.allNode.concat(res.data),null);
                    setTimeout(() => {
                        this.$refs.tree.setCurrentKey(this.rootId);
                        this.$nextTick(()=>{ this.loading = false; })
                    }, 10)
                });
                if (sortable) {
                    this.handleDrop();
                }
            },
            refreshList() {
                this.getGroupList(true);
            },

            //获取选中分组信息
            getGroupInfo(val) {
                if (this.formParentId) {
                    this.$request.get('/api/admin/group/getGroup', {
                        params: {id: this.formParentId, operate: 0, type: this.groupType}
                    }).then(resp => {
                        let data = resp.data[0];
                        this.parentFolder = data.isFolder;
                        this.handleCreate(val);
                    })
                } else {
                    this.parentFolder = true;
                    this.handleCreate(val);
                }
            },
            //新建分组或文件夹
            handleCreate(val){
                if (this.parentFolder) {
                    if (this.groupInfoType === -1) {
                        this.isFolder = true;
                        this.formTitle = '新增文件夹';
                    } else {
                        this.isFolder = false;
                        this.formTitle = `新增${val.title}`;
                    }
                    this.formId = '';
                    this.formVisible = true;
                } else {
                    this.isFolder = this.groupInfoType === -1;
                    this.formTitle = `新增${val.title}`;
                    this.formId = '';
                    this.formVisible = true;
                }
            },
            handleCommand(val) {
                this.groupInfoType = val.id;
                this.getGroupInfo(val);
            },
            editGroup(formId,groupType) {
                let groupTypeName = null;
                if(groupType === 0){
                    groupTypeName = '静态分组'
                }else{
                    groupTypeName = '文件夹'
                }
                this.formTitle = `编辑${this.typeName}信息-${groupTypeName}`;
                this.formId = formId;
                this.formParentId = '';
                this.formVisible = true;
            },
            deleteGroup(formId) {
                this.$confirm(`此操作将永久删除该${this.typeName}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/group/deleteGroup', {
                        params: {
                            id: formId
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
            currentChange(data, node) {
                this.chosenNode = node;
                let {id} = data;
                this.chosenKey = data.id;
                if (!data.memberNum || data.memberNum < 1) {
                    this.formParentId = id === this.rootId ? null : id;
                } else {
                    this.formParentId = null;
                }

                this.$emit('change', data);
            }
        },
        mounted() {
            this.groupList = this.allNode;
            this.$refs.tree.setCurrentKey(this.chosenKey);
            this.getGroupList();
        },
    }
</script>

