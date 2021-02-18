<template>
    <draggable-resizable ref="container" :active="settingActive"
                         @resizing="resizing" @dragging="dragging" @resize-stop="resizeStop" @drag-stop="dragStop"
                         :min-height="minHeight" :min-width="minWidth"
                         :handles="handles" enable-native-drag :left-zero="leftZero"
                         :y="top" :x="left" :w="width" :z="zIndex"
                         :h="height" :popover-title="title"
                         :snap="true" :snapTolerance="10" @refLineParams="getRefLineParams">
        <template v-slot:float>
            <div class="website-pro-flex column">
                <div style="text-align: left;">
                    <span style="padding-right: 6px;display: inline-block;">{{title}}</span>
                    <el-button-group>
                        <el-button style="border-radius: 4px 0 0 4px !important;" circle type="primary" size="mini" icon="el-icon-setting un-drag" class="un-drag" @click.stop="$emit('setting')"/>
                        <el-button style="border-radius: 0 4px 4px 0 !important;" :disabled="!canDelete" circle type="primary" size="mini" icon="el-icon-delete un-drag" class="un-drag" @click="deleteModule"/>
                    </el-button-group>
                </div>
            </div>
        </template>
        <div class="website-pro-module-container" @click.stop="click">
            <slot />
        </div>
    </draggable-resizable>
</template>

<script>
    import {addEvent} from "../../js/util/dom";
    import DraggableResizable from "./vue-draggable-resizable/DraggableResizable";
    import "./vue-draggable-resizable/draggableResizable.less";
    export default {
        name: "settingContainer",
        components: {DraggableResizable},
        inject: ['designProvide'],
        props:{
            canDelete: {
                type: Boolean,
                default: true
            },
            handles: {
                type: Array,
                default: () => ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
                validator: (val) => {
                    const s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']);

                    return new Set(val.filter(h => s.has(h))).size === val.length
                }
            },
            width: {
                type: Number,
                default: 200,
                validator: (val) => val >= 0
            },
            height: {
                type: Number,
                default: 200,
                validator: (val) => val >= 0
            },
            minWidth: {
                type: Number,
                default: 0,
                validator: (val) => val >= 0
            },
            minHeight: {
                type: Number,
                default: 0,
                validator: (val) => val >= 0
            },
            maxWidth: {
                type: Number,
                default: null,
                validator: (val) => val >= 0
            },
            maxHeight: {
                type: Number,
                default: null,
                validator: (val) => val >= 0
            },
            left: {
                type: Number,
                default: 0,
                validator: (val) => typeof val === 'number'
            },
            top: {
                type: Number,
                default: 0,
                validator: (val) => typeof val === 'number'
            },
            zIndex: {
                type: Number,
                default: 0,
                validator: (val) => typeof val === 'number'
            },
            leftZero: Boolean,
            title: String,
        },
        methods:{
            resizeStop(left, top, width, height) {
                this.$emit('update:width',width);
                this.$emit('update:height',height);
                this.$emit('resize-stop');
            },
            resizing(left, top, width, height) {
                this.$emit('update:width',width);
                this.$emit('update:height',height);
            },
            dragStop(left, top) {
                this.$emit('update:left',left);
                this.$emit('update:top',top);
            },
            dragging(left, top) {
                this.$emit('update:left',left);
                this.$emit('update:top',top);
            },
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
                    if (!this.$refs.container.$el.contains(target) && !this.designProvide.settingPanel.isChildren(e)){
                        this.settingActive = false;
                    }
                }
            },
            getRefLineParams (params) {
                this.$emit('refLineParams', params);
            }
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
