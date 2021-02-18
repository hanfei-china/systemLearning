<template>
    <div class="flex">
        <div class="lrd-image-upload-attr-image-preview" :style="previewBgi" v-loading="loading"
             element-loading-text=""
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
        </div>
        <div class="flex flex-column flex-end" style="padding-left: 10px;">
            <div class="lrd-image-upload-attr-tip">
                <slot>
                    <span style="color: red;font-size: 12px;">{{tip}}</span>
                </slot>
            </div>
            <div>
                <el-upload class="lrd-image-upload-attr-upload" :show-file-list="false" :on-success="successUpload"
                           :action="action" :before-upload="beforeUpload"
                           accept="image/*">
                    <el-button size="small" type="primary">{{uploadBtnText}}</el-button>
                </el-upload>
                <el-button size="small" style="margin-left: 10px;" v-if="showImageStore">{{imageStoreText}}</el-button>
                <el-button size="small" style="margin-left: 10px;" @click="clearImage" type="text" v-if="showClear">清除</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    import {requestBaseUrl} from "../../js/config/serviceConfig";
    import getImageStore from '../../js/util/imageStore';
    export default {
        name: "ImageUpload",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        width: 280,
                        height: 131,
                        maxSize: 1024 * 1024,
                        isContain: false,
                        /**
                         * 启用图片库
                         * null/undefined: 不启用
                         * all:加载所有的图标库
                         * store1: 加载单个图标库
                         * [store1,store2]:加载选中的图标库
                         */
                        imageStore: null,
                        /**
                         * 自定义图片库，同时设置imageStore会使用两者的合集，并在最开始插入图片,应为数组
                         */
                        customImageStore: null,
                        uploadBtnText: '上传图片',
                        imageStoreText: '从图库中选择'
                    }
                }
            },
            unrestricted: {
                type: Boolean,
                default: false
            },
            value: {
                type: String,
                default: ''
            }
        },
        computed: {
            title() {
                if (this.attributes && this.attributes.title && this.attributes.title != '') {
                    return this.attributes.title;
                }

                return '图片上传';
            },
            width() {
                if (this.attributes && this.attributes.width && this.attributes.width > 0) {
                    return this.attributes.width;
                }

                return 280;
            },
            height() {
                if (this.attributes && this.attributes.height && this.attributes.height > 0) {
                    return this.attributes.height;
                }

                return 131;
            },
            maxSize() {
                if (this.attributes && this.attributes.maxSize && this.attributes.maxSize > 0) {
                    return this.attributes.maxSize;
                }

                return 1024 * 1024;
            },
            uploadBtnText() {
                if (this.attributes && this.attributes.uploadBtnText && this.attributes.uploadBtnText != '') {
                    return this.attributes.uploadBtnText;
                }

                return '上传图片';
            },
            imageStoreText() {
                if (this.attributes && this.attributes.imageStoreText && this.attributes.imageStoreText != '') {
                    return this.attributes.imageStoreText;
                }

                return '从图库中选择';
            },
            showClear() {
                if (this.attributes && this.attributes.showClear) {
                    return this.attributes.showClear;
                }
                return false;
            },
            isContain() {
                if (this.attributes && this.attributes.isContain) {
                    return this.attributes.isContain;
                }
                return false;
            },
            imageStore() {
                return getImageStore(this.attributes.imageStore, this.attributes.customImageStore);
            },
            showImageStore() {
                return this.attributes.imageStore && this.attributes.customImageStore && this.attributes.customImageStore.length > 0;
            },
            previewBgi() {
                let style = {
                    height: this.height + 'px',
                    width: this.width + 'px',
                    backgroundSize: this.isContain ? 'contain' : 'cover'
                };
                if (this.copyValue && this.copyValue != '') {
                    style.backgroundImage = `url(${this.copyValue})`;
                } else {
                    style.backgroundColor = '#888888';
                }

                return style;
            },
            maxImageSize() {
                let _M = this.maxSize / 1024 / 1024;
                let _Kb = this.maxSize / 1024 + '';
                if (_M >= 1) {
                    let y = String(_M).indexOf(".") + 1
                    if (y > 0) {
                        return _M.toFixed(2) + 'M';
                    } else {
                        return _M + 'M';
                    }

                } else {
                    return parseInt(_Kb) + 'Kb'
                }
            },
            tip() {
                if(this.unrestricted){
                    return `单张图片质量应小于${this.maxImageSize}`;
                }
                return `请上传${this.width}*${this.height}的或相同比例的图片，单张图片质量应小于${this.maxImageSize}`;
            }
        },
        data() {
            return {
                copyValue: this.value,
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                loading: false
            }
        },
        methods: {
            successUpload(response) {
                this.copyValue = response.data;
                this.$emit('change', response.data);
                this.$nextTick(()=>{ this.loading = false; })
            },
            beforeUpload(file) {
                if (file.size > this.maxSize) {
                    this.$message.error('上传失败，图片大于' + this.maxImageSize);
                    return false;
                }
                this.loading = true;
                return true;
            },
            clearImage(){
                this.copyValue = '';
                this.$emit('change', '');
            }
        },
        watch:{
            value(value){
                if(!this.copyValue){
                    this.copyValue = value;
                }
            }
        }
    }
</script>
<style>
    .lrd-image-upload-attr-image-preview {
        background-repeat: no-repeat;
        background-position: center;
    }

    .lrd-image-upload-attr-upload{
        display: inline-block;
    }
</style>
