<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-upload :show-file-list="false"
                       :on-success="successUpload"
                       :action="action"
                       accept="image/*">
                <el-button style="padding: 7px;" size="mini" type="primary" icon="el-icon-upload"/>
                <span style="padding-left: 6px;">{{placeholder}}</span>
            </el-upload>
        </div>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../js/config/serviceConfig";
    export default {
        name: "ImageAttr",
        props:{
            attribute: Object,
            value: String
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        computed:{
            attributes(){
                return this.attribute ? this.attribute.attributes || {} : {};
            },
            showTitle(){
                if(this.attribute){
                    return this.attribute.showTitle;
                }

                return false;

            },
            title(){
                if(this.attribute){
                    return this.attribute.title;
                }
                return '';
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            show(){
                if(this.attribute && this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            placeholder(){
                return this.attributes.placeholder;
            }
        },
        data(){
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                copyValue: this.attribute ? this.attribute.value : this.value,
            }
        },
        methods:{
            successUpload(response) {
                let url = response.data;
                this.copyValue = url;
                this.$emit('change',url);
                if(this.attribute){
                    this.attribute.value = url;
                }
            },
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target);
            }
        }
    }
</script>
