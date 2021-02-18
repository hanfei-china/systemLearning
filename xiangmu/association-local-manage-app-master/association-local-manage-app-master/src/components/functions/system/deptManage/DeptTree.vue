<template>
    <el-popover placement="bottom-start" width="420" trigger="manual" v-model="visible">
        <el-input slot="reference" readonly clearable :value="deptName" :placeholder="placeholder" :suffix-icon="suffixIcon"
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
                                         :props="nodeProps" :data="treeData" :expand-on-click-node="false"
                                         default-expand-all node-key="id"
                                         :filter-node-method="filterNode"
                                         @node-click="handleNodeClick">
                                    <div class="el-custom-tree-node flex-fill-in-the-remaining-space" :class="{disabled: data.disabled}" slot-scope="{ node, data }">
                                        {{ node.label }}
                                    </div>
                                </el-tree>
                            </vue-scroll>
                        </div>
                    </el-main>
                </el-container>
            </div>
        </div>
    </el-popover>
</template>

<script>
    export default {
        name: 'DeptTree',
        props: {
            value: String,
            disabledNodes: Function,
            placeholder: {
                type:String,
                default: '搜索单位'
            }
        },
        data() {
            return {
                searchId: `ocs_${new Date().getMilliseconds()}`,
                keyword: '',//过滤树
                treeData: [],
                selectedOrg: null,//选择树节点
                visible: false,
                isNodeClick: false,
                nodeProps: {
                    label: 'deptName'
                }
            };
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        computed: {
            suffixIcon() {
                if (this.visible) {
                    return 'el-icon-arrow-up';
                } else {
                    return 'el-icon-arrow-down';
                }
            },
            deptName() {
                let node = this.findNode(this.treeData, this.value);
                if (node) {
                    return node.deptName;
                }
                return '';
            }
        },
        methods: {
            blur(event) {
                let {relatedTarget} = event;
                if (relatedTarget) {
                    let {id, classList} = relatedTarget;
                    if (id !== this.searchId && classList.contains('el-tree-node') !== true) {
                        this.visible = false;
                    }

                } else {
                    this.visible = false;
                }
            },
            filterNode(value, data) {
                if (value) {
                    return data.deptName.indexOf(value) !== -1;
                }
                return true;
            },
            valueClick() {
                this.visible = !this.visible;
            },
            handleNodeClick(data) {
                if (!data.disabled) {
                    this.$emit('change', data.id);
                    this.visible = false;
                }
            },
            loadTree() {
                this.$request.get('/api/admin/dept/manage/getDeptInfo').then(res=>{
                    let nodes = res.data;
                    if(this.disabledNodes){
                        this.disabledNodes(nodes);
                    }
                    this.treeData = nodes;
                    setTimeout(()=>{
                        this.$refs.tree.setCurrentKey(this.value);
                    },10)
                });
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
    };
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
    .el-custom-tree-node.disabled{
        color: #A7A8AA;
    }
    .el-custom-tree-node.disabled:hover {
        background: transparent;
        cursor: not-allowed;
        color: #A7A8AA;
    }
</style>
