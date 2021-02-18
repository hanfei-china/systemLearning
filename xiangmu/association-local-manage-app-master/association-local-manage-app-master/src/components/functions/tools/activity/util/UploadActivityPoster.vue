<template>
<div>
    <div class="active-pic">
        <div style="width: 280px;height: 150px;" @click="uploadDialogVisible = true" v-if="poster">
            <img style="width: 100%;height: 100%;" :src="poster"/>
        </div>
        <div class="upload-area" @click="uploadDialogVisible = true" v-else>
            <div><img src="../../../../../assets/upload.png" class="clip-area-img"/></div>
            <div class="clip-area-font">点击添加海报</div>
        </div>
        <div class="upload-desc">
            <p style="margin-bottom: 21px;">1、建议上传尺寸 700px*375px，.jpg或.png及.gif格式，不超过1M</p>
            <p>2、选择一张精美的图片作为封面海报既提高浏览者的视觉体验，又可以宣传活动内容</p>
        </div>
    </div>
    <upload-img v-model="poster" :visible.sync="uploadDialogVisible"/>
</div>
</template>

<script>
    import UploadImg from "./UploadImg";
    export default {
        name: "UploadActivityPoster",
        components: {UploadImg},
        props: {
            value: String
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        data(){
            return {
                uploadDialogVisible: false,
                poster: this.value
            }
        },
        watch:{
            value(val){
                if(!this.poster){
                    this.poster = val;
                }
            },
            poster(val){
                this.$emit('change',val);
            }
        }
    }
</script>
