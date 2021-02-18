<template>
    <el-popover placement="bottom-start" width="420" trigger="manual" v-model="visible">
        <div slot="reference">
            <el-input size="small" readonly clearable v-show="!searchShow" :value="name" placeholder="请输入分组名称进行搜索" :suffix-icon="suffixIcon"
                      @click.native.stop="valueClick" @clear="clear"
                      @mouseenter.native="hovering = true"
                      @mouseleave.native="hovering = false"/>
            <el-input size="small" ref="search" clearable v-show="searchShow" v-model="keyword" :placeholder="placeholder" :suffix-icon="suffixIcon"
                      @click.native.stop="searchClick"  @focus="focusing=true"
                      @blur="searchBlur"
                      @mouseenter.native="hovering = true"
                      @mouseleave.native="hovering = false"/>
        </div>
        <div class="organization-choose-tree-panel" v-show="visible">
            <div class="position-relative" style="height: 100%;">
                <vue-scroll>
                    <el-tree ref="tree" class="lrd-organization-choose-custom-tree" highlight-current
                             :props="nodeProps" :data="virtualGroup" default-expand-all
                             node-key="localId" :expand-on-click-node="false" :filter-node-method="filterNode"
                             @node-click="handleNodeClick">
                        <div class="el-custom-tree-node flex-fill-in-the-remaining-space"
                             :class="{disabled: data.disabled}" slot-scope="{ node, data }">
                            <i v-if="data.isFolder" :class="data.icon" ></i>
                            {{ node.label }}
                        </div>
                    </el-tree>
                </vue-scroll>
            </div>
        </div>
    </el-popover>
</template>

<script>
    export default {
        name: "MemberVirtualGroupTree",
        props:{
            virtualGroup: {
                type: Array,
                required: true,
                validator(val){
                    return val;
                }
            },
            value: String,
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

                visible: false,

                nodeProps: {
                    label: 'name'
                },
                hovering: false,
                focusing: false
            };
        },
        computed:{
            placeholder(){
                return this.name || '请输入分组名称进行搜索';
            },
            suffixIcon() {
                if(this.searchShow){
                    if((this.focusing || this.hovering) && this.keyword){
                        return '';
                    }
                }else{
                    if((this.focusing || this.hovering) && this.name){
                        return '';
                    }
                }


                if (this.visible) {
                    return 'el-icon-arrow-up';
                } else {
                    return 'el-icon-arrow-down';
                }
            },
            name: {
                get: function () {
                    let node = {};
                    if (this.value) {
                        node = this.findNode(this.virtualGroup, this.value);
                    }
                    if (node) {
                        return node.name
                    } else {
                        return ''
                    }
                }
            },
            domIds(){
                return [this.searchId, this.searchId+'_cancel', this.searchId+'_sure', this.searchId+'_clean']
            }
        },
        methods:{
            searchBlur(event){
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
            valueClick(e) {
                let target = e.target || e.srcElement;
                let regex = new RegExp('el-input__icon', '');
                if (regex.test(target.className)) {
                    return;
                }
                this.searchShow = true;
                this.$nextTick(()=>{
                    this.visible = !this.visible;
                    this.$refs.search.focus();
                })
            },
            searchClick(){
                this.visible = !this.visible;
            },
            filterNode(value, data) {
                if (value) {
                    return data.name.indexOf(value) !== -1;
                }
                return true;
            },
            handleNodeClick(data) {
                if (!this.isMultiple) {
                    if(data.disabled){
                        return;
                    }
                    this.visible = false;
                    this.keyword = '';
                    this.searchShow = false;
                    this.$emit('checked', data.id);
                    this.$emit('update:conditions',data.getFinishCondition());
                }
            },
            findNode(arr, id) {
                for (let item of arr) {
                    if (item.id === id) {
                        if(item.disabled){
                            return null;
                        }
                        return item;
                    } else if (item.children && item.children.length > 0) {
                        let temp = this.findNode(item.children, id);
                        if (temp) {
                            return temp;
                        }
                    }
                }
            },
            clear(){
                this.$refs.tree.setCurrentKey(null);
                this.$emit('checked','');
                this.$emit('update:conditions', '');
            }
        },
        watch: {
            keyword(val) {
                this.$refs.tree.filter(val);
            },
            name:{
                immediate: true,
                handler(val){
                    if(!val){
                        this.$emit('checked','');
                        this.$emit('update:conditions','');
                    }
                }
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
