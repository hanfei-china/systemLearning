<template>
    <el-popover placement="bottom-start" width="420" trigger="manual" v-model="visible">
        <div slot="reference" ref="inputs">
            <el-input size="small" readonly clearable v-show="!searchShow" :value="name" placeholder="请输入分组名称进行搜索"
                      :suffix-icon="suffixIcon"
                      @click.native.stop="valueClick"/>
            <el-input size="small" ref="search" clearable v-show="searchShow" v-model="keyword"
                      :placeholder="placeholder" :suffix-icon="suffixIcon"
                      @click.native.stop="searchClick"
                      @blur="searchBlur"/>
        </div>
        <div class="organization-choose-tree-panel" ref="panel" v-show="visible">
            <div class="position-relative" style="height: 100%;">
                <vue-scroll>
                    <el-tree ref="tree" class="lrd-organization-choose-custom-tree" highlight-current
                             :props="nodeProps" :default-checked-keys="value" :data="treeNodes" default-expand-all
                             node-key="id" :expand-on-click-node="false" :filter-node-method="filterNode"
                             show-checkbox check-strictly @check="handleCheck">
                        <div class="el-custom-tree-node flex-fill-in-the-remaining-space"
                             :class="{disabled: data.disabled}" slot-scope="{ node, data }">
                            <i v-if="data.isFolder" :class="data.icon"></i>
                            {{ node.label }}
                        </div>
                    </el-tree>
                </vue-scroll>
            </div>
        </div>
    </el-popover>
</template>

<script>
    import {treeFormingGroup} from "./js/memberGroupTools";
    import {addEvent,removeEvent} from "../../../../../js/util/dom";

    export default {
        name: "MemberGroupMultiTreeProvider",
        props: {
            value: Array,
            groupType: Number,
            isFolder: Boolean,
            filterNodeId: String,
            onlyStatic: {
                type: Boolean,
                default: false
            }
        },
        model: {
            prop: 'value',
            event: 'checked'
        },
        data() {
            return {
                searchShow: false,
                searchId: `ocs_${new Date().getMilliseconds()}`,
                keyword: '',//过滤树

                visible: false,

                //是否为节点点击
                isNodeClick: false,
                nodeProps: {
                    label: 'name'
                },
                checkedNodes: [],//选中的项

                groupNodes: []
            };
        },
        computed: {
            placeholder() {
                return this.name || '请输入分组名称进行搜索';
            },
            suffixIcon() {
                if (this.visible) {
                    return 'el-icon-arrow-up';
                } else {
                    return 'el-icon-arrow-down';
                }
            },
            name: {
                get: function () {
                    let nodeArr = [];
                    let nameArr = [];
                    for (let id of this.value) {
                        nodeArr.push(this.findNode(this.treeNodes, id));
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
                }
            },
            treeNodes() {
                return treeFormingGroup(this.groupNodes, this.filterNodeId, this.isFolder, this.groupType, this.onlyStatic);
            },
            domIds() {
                return [this.searchId, this.searchId + '_cancel', this.searchId + '_sure', this.searchId + '_clean']
            }
        },
        methods: {
            getGroupList(){
                this.$request.get('/api/admin/group/getMemberGroup').then(res => {
                    this.groupNodes = res.data;
                });
            },
            searchBlur(event) {
                let {relatedTarget} = event;
                if (relatedTarget) {
                    let {id, classList} = relatedTarget;
                    if (this.domIds.indexOf(id) <= -1 && classList.contains('el-tree-node') !== true) {
                        this.visible = false;
                    }

                } else {
                    this.visible = false;
                }
                this.keyword = '';
                this.searchShow = false;
            },
            valueClick() {
                this.searchShow = true;
                this.$nextTick(() => {
                    this.visible = !this.visible;
                    this.$refs.search.focus();
                })
            },
            searchClick() {
                this.visible = !this.visible;
            },
            filterNode(value, data) {
                if (value) {
                    return data.name.indexOf(value) !== -1;
                }
                return true;
            },
            handleCheck(data, dataObj) {
                this.checkedNodes = dataObj.checkedKeys;
                this.$emit('checked', this.checkedNodes);
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
            windowClick(e){
                let target = e.target || e.srcElement;
                if(!this.$refs.inputs.contains(target) && !this.$refs.panel.contains(target)){
                    this.visible = false;
                }
            }
        },
        created() {
            this.getGroupList();
        },
        mounted() {
            addEvent(window,'click',this.windowClick);
        },
        beforeDestroy() {
            removeEvent(window,'click',this.windowClick);
        },
        watch: {
            keyword(val) {
                this.$refs.tree.filter(val);
            },
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
