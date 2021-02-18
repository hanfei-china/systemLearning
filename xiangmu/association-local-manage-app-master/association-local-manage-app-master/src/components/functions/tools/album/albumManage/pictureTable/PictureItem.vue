<template>
    <div>
        <div class="picture position-relative" @click="viewLargePicture">
            <div class="checkbox position-absolute" @click.stop>
                <el-checkbox v-model="pictureInfo.checked" @change="pictureCheckedItemChange"></el-checkbox>
            </div>
            <el-image v-if="pictureInfo.fileType==1" style="width: 100%;height: 100%;" fit="cover" :src="pictureInfo.photoUrl"
                      @click="albumPictureDialog = true"></el-image>
            <div style="width:100%;height:100%;display:flex;justifyContent:center;alignItems:center;" v-if="pictureInfo.fileType==2" >
                <img @click="albumPictureDialog = true" src="../../pictureExamine/image/videoPlay.png" style="width:150px;height:150px;">
            </div>
            <div class="pictureModel position-absolute">
                <div class="operate position-absolute flex">
                    <p class="operateBtn cursor-pointer" style="border-right: 1px solid #ffffff;"
                       @click.stop="transferPicture">
                        <span class="iconfont icon-plus-transfer" style="margin-right: 6px"></span>
                        <span>转移</span>
                    </p>
                    <p class="operateBtn cursor-pointer" @click.stop="$emit('deleteItem',pictureInfo.id)">
                        <span class="iconfont icon-xiazai14" style="margin-right: 6px"></span>
                        <span>删除</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="albumTitle cursor-pointer" style="height:20px;">
            #<span style="color: #097CEF;">{{pictureInfo.title}}</span>#
        </div>
        <div class="describe" v-if="pictureInfo.photoDescribe"><span style="fontWeight:700;">描述: </span>{{pictureInfo.photoDescribe}}</div>
        <!--查看大图-->
        <el-dialog title="大图预览" :visible.sync="albumPictureDialog" append-to-body width="800px">
            <div class="cover position-relative" style="height: 450px;">
                <el-image v-if="pictureInfo.fileType==1" fit="contain" :src="pictureInfo.photoUrl" style="width: 100%;height: 100%;"></el-image>
                <video v-if="pictureInfo.fileType==2" :src="pictureInfo.photoUrl" controls="controls" preload="preload" width="600px" height="450px" style="border:3px solid #222;"></video>
            </div>
            <div class="desc">
                <p style="margin-bottom: 14px;font-size: 16px;font-weight: 500;">{{pictureInfo.albumTitle}}</p>
                <el-tooltip class="descTooltip" effect="dark" :content="pictureInfo.photoDescribe" placement="top-start">
                    <div class="preDescribe" v-if="pictureInfo.photoDescribe"><span style="fontWeight:700;">描述: </span>{{pictureInfo.photoDescribe}}</div>
                </el-tooltip>
                <div class="flex" style="line-height: 32px;">
                    <p style="font-size: 12px;" class="flex-fill-in-the-remaining-space">
                        <span>上传用户</span>
                        <span style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 0">{{pictureInfo.adminUserName | formatNull}}</span>
                        <span style="margin: 0 78px 0 16px;" v-if="pictureInfo.createType === 1">{{pictureInfo.memberUserName | formatNull}}</span>
                        <span>上传时间</span>
                        <span style="margin-left: 16px;">{{pictureInfo.createTime | yyyyMMddHHmm}}</span>
                    </p>
                    <div>
                        <el-button size="small" type="warning" @click="transferPicture">转移</el-button>
                        <el-button size="small" type="danger" @click="$emit('deleteItem',pictureInfo.id)">删除</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PictureItem",
        props: ['pictureInfo', 'picturecheckedItemStatus'],
        data() {
            return {
                albumPictureDialog: false,//查看大图
            }
        },
        watch: {
            picturecheckedItemStatus(val) {
                this.$set(this.pictureInfo, "checked", val);
            }
        },
        filters: {
            formatNull: function(val){
                if(val){
                    return val;
                }else {
                    return '-'
                }
            }
        },
        methods: {
            //选择某一项
            pictureCheckedItemChange(val) {
                if (val) {
                    this.$emit("addPictureCheckdItem", this.pictureInfo.id)
                } else {
                    this.$emit("reducePictureCheckdItem", this.pictureInfo.id)
                }
            },
            //转移一项
            transferPicture() {
                this.$emit('transferPicture', this.pictureInfo.id);
            },
            viewLargePicture() {
                this.albumPictureDialog = true;
            }
        }
    }
</script>

<style scoped>
.describe{
    padding-top: 5px;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    padding: 5px 16px 0 16px;
}
.preDescribe{
    padding-top: 5px;
    width: 550px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}
</style>