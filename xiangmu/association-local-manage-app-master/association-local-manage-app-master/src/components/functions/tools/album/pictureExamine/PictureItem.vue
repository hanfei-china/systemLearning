<template>
    <div>
        <el-image class="pic cursor-pointer" fit="cover" @click="albumPictureDialog = true"
                  :src="pictureInfo.photoUrl"></el-image>
        <div class="picDesc cursor-pointer" :title="pictureInfo.title">
            <el-checkbox v-model="pictureInfo.checked" @change="checkedItemChange"></el-checkbox>
            <span style="margin-left: 6px;">{{pictureInfo.title || '账号已注销'}}</span>
        </div>
        <!--查看大图-->
        <el-dialog title="大图预览" :visible.sync="albumPictureDialog" append-to-body width="800px">
            <div class="cover position-relative" style="height: 450px;">
                <el-image fit="contain" :src="pictureInfo.photoUrl" style="width: 100%;height: 100%;"></el-image>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PictureItem",
        props: ['pictureInfo', 'checkedItemStatus'],
        data() {
            return {
                albumPictureDialog: false,//查看大图
            }
        },
        watch: {
            checkedItemStatus(val) {
                this.$set(this.pictureInfo, 'checked', val);
            },
        },
        methods: {
            //选择某一项
            checkedItemChange(val) {
                if (val) {
                    this.$emit("addCheckdItem", this.pictureInfo.id)
                } else {
                    this.$emit("reduceCheckdItem", this.pictureInfo.id)
                }
            }
        }
    }
</script>