<template>
    <div>
        <div class="flex" style="height: 40px;">
            <div class="flex flex-center flex-column" style="padding-right: 10px;"><i class="iconfont icon-Icon_drag item-sort"/></div>
            <div class="flex-fill-in-the-remaining-space text-overflow flex flex-center flex-column">
                {{item.title}}
            </div>
            <div class="flex flex-center flex-column">
                <div>
                    <el-button icon="el-icon-setting" @click="settingVisible=true" type="text"/>
                    <el-button icon="el-icon-delete" class="custom-el-button danger" @click="$emit('delete-item')" type="text"/>
                </div>
            </div>
        </div>
        <el-dialog width="760px" title="页签设置" :visible.sync="settingVisible" :close-on-click-modal="false" append-to-body>
            <member-query-builder-setting v-if="settingVisible" :item="item" :fields="fields"
                                          @close="settingVisible=false" @change="change"/>
        </el-dialog>
    </div>
</template>

<script>
    import MemberQueryBuilderSetting from "./MemberQueryBuilderSetting";
    export default {
        name: "MemberQueryBuilder",
        components: {MemberQueryBuilderSetting},
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
                settingVisible: false,
            }
        },
        methods:{
            change(item){
                this.item.copy(item);
                this.settingVisible = false;
            }
        }
    }
</script>
