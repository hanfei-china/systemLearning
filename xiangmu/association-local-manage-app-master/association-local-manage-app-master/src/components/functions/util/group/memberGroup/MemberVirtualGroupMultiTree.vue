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
                             :props="nodeProps" :default-checked-keys="value" :data="virtualGroup" default-expand-all
                             node-key="localId" :expand-on-click-node="false" :filter-node-method="filterNode"
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
    import {addEvent, removeEvent} from "../../../../../js/util/dom";

    export default {
        name: "MemberVirtualGroupMultiTree",
        props: {
            virtualGroup: {
                type: Array,
                required: true,
                validator(val) {
                    return val;
                }
            },
            value: Array,
            conditions: String
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

                treeData: [],
                visible: false,

                //是否为节点点击
                isNodeClick: false,
                nodeProps: {
                    label: 'name'
                },
                checkedNodes: [],//选中的项
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
                        let item = this.findNode(this.virtualGroup, id);
                        if(item){
                            nodeArr.push(item);
                        }
                    }
                    for (let item of nodeArr) {
                        nameArr.push(item.name);
                    }
                    if (nameArr && nameArr.length > 0) {
                        return nameArr.join(',');
                    } else {
                        return ''
                    }
                }
            },
            domIds() {
                return [this.searchId, this.searchId + '_cancel', this.searchId + '_sure', this.searchId + '_clean']
            },
        },
        methods: {
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
                this.resultConditions(dataObj.checkedNodes)
            },
            resultConditions(nodes) {
                let conditions = '';
                let conditionArr = [];

                nodes.forEach((node)=>{
                    let condition = node.getFinishCondition();
                    if(condition){
                        conditionArr.push(condition);
                    }
                });
                let length = conditionArr.length;
                if(length > 0){
                    conditions = '(';
                    conditionArr.forEach((condition,index)=>{
                        if(index === length - 1){
                            conditions += `(${condition})`
                        }else{
                            conditions += `(${condition}) or `
                        }
                    });

                    conditions += ')';
                }
                this.$emit('update:conditions', conditions);
                return conditions;
            },
            findNode(arr, id) {
                for (let item of arr) {
                    if (item.localId === id) {
                        return item;
                    } else if (item.children && item.children.length > 0) {
                        let temp = this.findNode(item.children, id);
                        if (temp) {
                            return temp;
                        }
                    }
                }
            },
            windowClick(e) {
                let target = e.target || e.srcElement;
                if (!this.$refs.inputs.contains(target) && !this.$refs.panel.contains(target)) {
                    this.visible = false;
                }
            }
        },
        mounted() {
            addEvent(window, 'click', this.windowClick);
        },
        beforeDestroy() {
            removeEvent(window, 'click', this.windowClick);
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
