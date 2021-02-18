<template>
    <div class="pictureItem position-relative" style="margin:0">
        <div class="position-absolute" style="right: 5px;top: 5px;" @click.stop>
            <el-checkbox v-model="pictureInfo.checked" @change="handleChecked"></el-checkbox>
        </div>
        <el-image v-if="pictureInfo.fileType==1" fit="cover" :src="pictureInfo.photoUrl" style="width: 100%;height: 100%;"></el-image>
        <div style="width:100%;height:100%;display:flex;justifyContent:center;alignItems:center;" v-if="pictureInfo.fileType==2" >
            <img src="../pictureExamine/image/videoPlay.png" style="width:150px;height:150px;">
        </div>
    </div>
</template>

<script>
    export default {
        name: "PictureItem",
        props: ['pictureInfo'],
        methods: {
            handleChecked(val){
                if(val){
                    this.$emit("addPicture",this.pictureInfo.id)
                }else {
                    this.$emit("reducePicture",this.pictureInfo.id)
                }
            }
        }
    }
</script>

<style scoped>

</style>