<template>
    <el-dialog :visible.sync="cropperDialog" title="图片裁剪" append-to-body width="800px">
        <div class="cropper-content">
            <div class="cropper" style="text-align:center">
                <vueCropper
                        ref="cropper"
                        :img="cropperImg"
                        :outputSize="option.size"
                        :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                        :centerBox="option.centerBox"
                        :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox"
                        :fixed="option.fixed"
                        :fixedNumber="option.fixedNumber"/>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="postcropperDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="finish">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {VueCropper} from 'vue-cropper';
    export default {
        name: "CropperImg",
        components:{VueCropper},
        data(){
            return{
                // 裁剪组件的基础配置option
                option: {
                    img: '', // 裁剪图片的地址
                    outputSize: 1, // 裁剪生成图片的质量  (默认:1)
                    full: false, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
                    canMove: true, // 上传图片是否可以移动  (默认:true)
                    canMoveBox: true, // 截图框能否拖动  (默认:true)
                    centerBox: true,//截图框是否被限制在图片里面
                    autoCrop: true, // 是否默认生成截图框  (默认:false)
                    autoCropWidth: 700, // 默认生成截图框宽度  (默认:80%)
                    autoCropHeight: 375, // 默认生成截图框高度  (默认:80%)
                    fixedBox: true, // 固定截图框大小 不允许改变  (默认:false)
                    fixed: true,//是否开启截图框宽高固定比例
                    fixedNumber: [700, 375],//截图框宽高比例
                },
            }
        },
        props:["cropperImg","cropperDialog","fileInfo"],
        methods:{
            finish() {
                let formData = new FormData();
                this.$refs.cropper.getCropBlob((data) => {
                    let _obj = {name: this.fileInfo.name};//原图url
                    let X = this.fileInfo.name.substring(this.fileInfo.name.lastIndexOf('.'), this.fileInfo.name.length);
                    _obj.name = this.fileInfo.name.substring(0, this.fileInfo.name.lastIndexOf('.'));
                    let reg = /^[\u4e00-\u9fa5\\_a-zA-Z0-9]+$/;

                    if (!reg.test(_obj.name)) {
                        _obj.name = _obj.name.replace(/[^\u4e00-\u9fa5\\_a-zA-Z0-9]+/g, '')
                    }
                    _obj.name = _obj.name + X;
                    formData.append("file", data, _obj.name);
                    this.$request.post('/api/common/anon/uploadFile', formData).then(res => {
                        if (res.success) {
                            this.$emit("getUrlData",res.data);
                        }
                    });
                    this.$emit("getDialog",false);
                })
            },
            postcropperDialog(){
                this.$emit("getCropperDialog",false)
            },
        }

    }
</script>

<style scoped>
    /*截图*/
    .cropper-content .cropper {
        width: 760px;
        height: 480px;
    }
</style>
