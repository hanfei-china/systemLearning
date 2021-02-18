<template>
    <el-popover placement="bottom-start" width="420" trigger="manual" v-model="visible">
        <el-input slot="reference" :disabled="!editable" :size="size" readonly clearable :value="name" :placeholder="placeholder" :suffix-icon="suffixIcon"
                  @click.native.stop="valueClick"
                  @blur="blur"/>
        <div class="organization-choose-tree-panel" v-show="visible">
            <div class="position-relative" style="height: 100%;">
                <el-container class="absolute-fill-parent">
                    <el-header class="unset-padding" height="38px">
                        <el-input style="margin-bottom: 3px" ref="search" :id="searchId"
                                  :placeholder="placeholder" size="mini" prefix-icon="el-icon-search" clearable
                                  v-model="keyword"/>
                    </el-header>
                    <el-main class="unset-padding position-relative">
                        <div class="absolute-fill-parent">
                            <vue-scroll>
                                <el-tree ref="tree" class="lrd-organization-choose-custom-tree" highlight-current
                                         :props="nodeProps" :data="fileTreeData" default-expand-all
                                         :default-checked-keys="nodeRange" node-key="id"
                                         check-strictly :show-checkbox="isMultiple" :filter-node-method="filterNode"
                                         @node-click="handleNodeClick" @check="handleCheck">
                                    <div class="el-custom-tree-node flex-fill-in-the-remaining-space"
                                         :class="{disabled: data.disabled}" slot-scope="{ node, data }">
                                        <i v-if="data.isFolder" class="el-icon-folder" style="margin-right: 5px;"></i>
                                        {{ node.label }}
                                    </div>
                                </el-tree>
<!--                                <el-tree v-else ref="tree" class="lrd-organization-choose-custom-tree" highlight-current-->
<!--                                         :props="nodeProps" :data="treeData" default-expand-all-->
<!--                                         :default-checked-keys="nodeRange" node-key="id"-->
<!--                                         check-strictly :show-checkbox="isMultiple" :filter-node-method="filterNode"-->
<!--                                         @node-click="handleNodeClick" @check="handleCheck">-->
<!--                                    <div class="el-custom-tree-node flex-fill-in-the-remaining-space"-->
<!--                                         :class="{disabled: data.disabled || (isFolder&&!data.isFolder)}" slot-scope="{ node, data }">-->
<!--                                        <i v-if="data.isFolder" class="el-icon-folder" style="margin-right: 5px;"></i>-->
<!--                                        <i v-if="data.groupType === 0" class="el-icon-video-pause"-->
<!--                                           style="margin-right: 5px;line-height: 19px;"></i>-->
<!--                                        <i v-if="data.groupType === 1" class="el-icon-s-operation"-->
<!--                                           style="margin-right: 5px;line-height: 19px;"></i>-->
<!--                                        <i v-if="data.groupType === 2" class="el-icon-s-promotion"-->
<!--                                           style="margin-right: 5px;line-height: 19px;"></i>-->
<!--                                        <i v-if="data.groupType === 3" class="el-icon-price-tag"-->
<!--                                           style="margin-right: 5px;line-height: 19px;"></i>-->
<!--                                        {{ node.label }}-->
<!--                                    </div>-->
<!--                                </el-tree>-->
                            </vue-scroll>
                        </div>
                    </el-main>
                    <el-footer class="unset-padding text-align-right" height="auto" v-if="isMultiple || clearable">
                        <el-button size="small" v-if="isMultiple" :id="searchId+'_cancel'" type="danger" @click="visible = false">取消</el-button>
                        <el-button size="small" v-if="isMultiple" :id="searchId+'_sure'" type="primary" @click="getCheckedNode">确定</el-button>
                        <el-button size="small" v-if="clearable" :id="searchId+'_clean'" type="primary" @click="cleanNodes">清除</el-button>
                    </el-footer>
                </el-container>
            </div>
        </div>
    </el-popover>
</template>

<script>
    export default {
        name: "GroupTree",
        props: {
            nodeRange: {
                type: Array,
                default() {
                    return [];
                }
            },
            disabledNodes: Function,
            placeholder: {
                type: String,
                default: '搜索分组'
            },
            isMultiple: Boolean,
            groupType: String,
            maxLevel:{
                type: Number,
                default: null
            },
            size: String,
            clearable: Boolean,
            onlySaveActivity: Boolean,
            editable: {
                type: Boolean,
                default: true
            },
            isFolder: Boolean,
            groupInfoType: Number
        },
        data() {
            return {
                searchId: `ocs_${new Date().getMilliseconds()}`,
                keyword: '',//过滤树
                treeData: [],
                fileTreeData: [],
                selectedOrg: null,//选择树节点
                visible: false,
                isNodeClick: false,
                nodeProps: {
                    label: 'name'
                },
                checkedNodes: [],//选中的项
            };
        },
        model: {
            prop: 'nodeRange',
            event: 'checked'
        },
        computed: {
            suffixIcon() {
                if (this.visible) {
                    return 'el-icon-arrow-up';
                } else {
                    return 'el-icon-arrow-down';
                }
            },
            name: {
                get: function () {
                    if (this.isMultiple) {
                        let nodeArr = [];
                        let nameArr = [];
                        for (let id of this.nodeRange) {
                            nodeArr.push(this.findNode(this.treeData, id));
                        }
                        for (let item of nodeArr) {
                            if (item) {
                                nameArr.push(item.name);
                            }
                        }
                        if (nameArr && nameArr.length > 0) {
                            return nameArr.join(',');
                        } else {
                            return ''
                        }
                    } else {
                        let node = {};
                        if (this.nodeRange) {
                            node = this.findNode(this.treeData, this.nodeRange[0]);
                        }
                        if (node) {
                            return node.name
                        } else {
                            return ''
                        }

                    }
                }
            },
            domIds(){
                return [this.searchId, this.searchId+'_cancel', this.searchId+'_sure', this.searchId+'_clean']
            }
        },
        methods: {
            blur(event) {
                let {relatedTarget} = event;
                if (relatedTarget) {
                    let {id, classList} = relatedTarget;
                    if (this.domIds.indexOf(id) <= -1 && classList.contains('el-tree-node') !== true) {
                        this.visible = false;
                    }

                } else {
                    this.visible = false;
                }
            },
            filterNode(value, data) {
                if (value) {
                    return data.name.indexOf(value) !== -1;
                }
                return true;
            },
            valueClick() {
                if(this.editable){
                    this.visible = !this.visible;
                }
            },
            handleNodeClick(data) {
                if (!this.isMultiple) {
                    if(data.disabled){
                        return;
                    }
                    this.checkedNodes = [];
                    this.checkedNodes.push(data.id);
                    this.visible = false;
                    this.$emit('checked', this.checkedNodes);
                }
            },
            handleCheck(data, dataObj) {
                this.checkedNodes = dataObj.checkedKeys
            },
            getCheckedNode() {
                this.visible = false;
                this.$emit('checked', this.checkedNodes);
            },
            loadTree() {
                this.$request.get('/api/admin/group/getGroup', {params: {type: this.groupType, maxLevel: this.maxLevel}}).then(res => {
                    let nodes = res.data;

                    if(this.onlySaveActivity){
                        nodes = nodes.filter(node => {
                            return node.otherType === 0;
                        });
                    }else{
                        nodes = nodes.filter(node => {
                            return node.otherType !== 0;
                        });
                        this.deleteDisabledNodes(nodes);
                        let copyNodes =JSON.parse(JSON.stringify(nodes));
                        this.getFileFolderNodes(copyNodes);
                        this.fileTreeData = copyNodes;
                    }

                    if (this.disabledNodes) {
                        this.disabledNodes(nodes);
                    }
                    if (this.isMultiple) {
                        this.setTreeDisabledNodes(nodes);
                    }
                    this.treeData = nodes;
                    setTimeout(() => {
                        this.$refs.tree && this.$refs.tree.setCurrentKey(this.nodeRange);
                    }, 10)
                });
            },
            deleteDisabledNodes(nodes){
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].groupType === 2) {
                        nodes.splice(i--,1)
                    }else if (nodes[i].groupType === 3) {
                        nodes.splice(i--,1)
                    }else{
                        this.deleteDisabledNodes(nodes[i].children);
                    }
                }
            },
            getFileFolderNodes(nodes){
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].isFolder) {
                        this.getFileFolderNodes(nodes[i].children);
                    }else {
                        nodes.splice(i--,1);
                    }
                }
            },
            setTreeDisabledNodes(nodes) {
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].children && nodes[i].children.length > 0 || nodes[i].groupType !== 0) {
                        this.$set(nodes[i], "disabled", true);
                        this.setTreeDisabledNodes(nodes[i].children);
                    }
                }
            },
            findNode(arr, id) {
                for (let item of arr) {
                    if (item.id === id) {
                        return item;
                    } else if (item.children && item.children.length > 0) {
                        let temp = this.findNode(item.children, id);
                        if (temp) {
                            return temp;
                        }
                    }
                }
            },
            cleanNodes(){
                this.checkedNodes = [];
                this.visible = false;
                this.$emit('checked', this.checkedNodes);
            }
        },
        created() {
            this.loadTree();
        },
        watch: {
            keyword(val) {
                this.$refs['tree'].filter(val);
            }
        }
    }
</script>

<style scoped>
    .organization-choose-tree-panel {
        height: 300px;
        background-color: #fff;
        padding: 10px;
        overflow: hidden;
    }
</style>
<style>
    .el-custom-tree-node.disabled {
        color: #A7A8AA;
    }

    .el-custom-tree-node.disabled:hover {
        background: transparent;
        cursor: not-allowed;
        color: #A7A8AA;
    }
</style>
