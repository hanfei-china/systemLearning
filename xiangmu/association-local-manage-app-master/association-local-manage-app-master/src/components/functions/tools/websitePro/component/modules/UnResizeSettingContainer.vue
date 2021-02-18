<template>
    <div ref="container" class="website-pro" style="position: relative;" :class="{active:settingActive}">
        <el-popover placement="top-end" trigger="hover">
            <div class="website-pro-flex column">
                <div style="text-align: left;">
                    <span style="padding-right: 6px;display: inline-block;">{{title}}</span>
                    <el-button-group>
                        <el-button style="border-radius: 4px 0 0 4px !important;" circle type="primary" size="mini" icon="el-icon-setting un-drag" class="un-drag" @click.stop="$emit('setting')"/>
                        <el-button style="border-radius: 0 4px 4px 0 !important;" :disabled="!canDelete" circle type="primary" size="mini" icon="el-icon-delete un-drag" class="un-drag" @click="deleteModule"/>
                    </el-button-group>
                </div>
            </div>
            <div slot="reference" class="website-pro-absolute-fill-parent">
                <div class="website-pro-module-container" @click.stop="click">
                    <slot />
                </div>
            </div>
        </el-popover>
        <div class="handle-bar handle-top"></div>
        <div class="handle-bar handle-right"></div>
        <div class="handle-bar handle-bottom"></div>
        <div class="handle-bar handle-left"></div>
    </div>
</template>

<script>
    import {addEvent} from "../../js/util/dom";
    import "./vue-draggable-resizable/draggableResizable.less";
    export default {
        name: "UnResizeSettingContainer",
        inject: ['designProvide'],
        props:{
            canDelete: {
                type: Boolean,
                default: true
            },
            title: String,
        },
        methods:{
            deleteModule(){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$emit('delete');
                }).catch(()=>{});
            },
            click(){
                this.settingActive = true;
                this.$emit('active');
                this.$emit('setting-if-setting');
            },
            initEvents() {
                addEvent(window, 'click', (e) => {
                    this.contentBlur(e);
                    return false;
                });

                addEvent(window, 'mousedown', (e) => {
                    this.contentBlur(e);
                    return false;
                });
            },
            contentBlur(e){
                if(this.settingActive){
                    let target = e.target || e.srcElement;
                    if (!this.$refs.container.contains(target) && !this.designProvide.settingPanel.isChildren(e)){
                        this.settingActive = false;
                    }
                }
            },
        },
        data(){
            return {
                settingActive: false
            }
        },
        mounted() {
            this.initEvents();
        }
    }
</script>
