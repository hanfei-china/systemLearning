<template>
    <div class="flex">
        <div class="audio-preview flex flex-column flex-center" v-loading="loading" :style="{background: copyFileId?'#F1F3F4':''}">
            <div v-show="copyFileId">
                <audio :src="defaultAudioUrl" autoplay controls></audio>
            </div>
        </div>
        <el-upload class="upload-demo" :show-file-list="false" :action="action" :on-success="successUpload"
                   :before-upload="beforeUpload" accept="audio/mp3">
            <el-button size="small" type="primary">{{btnTitle}}</el-button>
            <div slot="tip" class="el-upload__tip">请选择MP3格式的音频进行上传，为了更好的体验，音频应小于{{maxAudioSize}}</div>
        </el-upload>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../js/config/serviceConfig";

    export default {
        name: "AudioUpload",
        props: {
            btnTitle: {
                type: String,
                default: '上传音频'
            },
            maxSize: {
                type: Number,
                default() {
                    return 10 * 1024 * 1024;
                }
            },
            value: {
                type: String,
                default: ''
            },
            fileId: {
                type: String,
                default() {
                    return null;
                }
            },
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        computed: {
            maxAudioSize() {
                let _G = this.maxSize / 1024 / 1024 / 1024;
                let _M = this.maxSize / 1024 / 1024;
                let _Kb = this.maxSize / 1024 + '';

                if (_G >= 1) {
                    let temp = String(_G).indexOf('.') + 1;
                    if (temp > 0) {
                        return _G.toFixed(2) + 'G';
                    } else {
                        return _G + 'G';
                    }
                } else {
                    if (_M >= 1) {
                        let y = String(_M).indexOf(".") + 1;
                        if (y > 0) {
                            return _M.toFixed(2) + 'M';
                        } else {
                            return _M + 'M';
                        }
                    } else {
                        return parseInt(_Kb) + 'Kb'
                    }
                }
            },
            defaultAudioUrl() {
                return this.copyValue;
            },
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                copyValue: this.value,
                copyFileId: this.fileId,
                loading: false
            }
        },
        watch: {
            value(val) {
                if (!this.copyValue) {
                    this.copyValue = val;
                }
            },
            fileId() {
                this.copyFileId = this.fileId;
            },
        },
        methods: {
            beforeUpload(file) {
                if (file.size > this.maxSize) {
                    this.$message.error('上传失败，音频大于' + this.maxAudioSize);
                    return false;
                }
                this.loading = true;
                return true;
            },
            successUpload(response, file) {
                this.copyValue = response.data;
                this.$emit('change', response.data);

                this.copyFileId = file.name;
                this.$emit('update:fileId', file.name);
                this.$nextTick(()=>{ this.loading = false; })
            }
        }
    }
</script>

<style scoped>
    .audio-preview {
        position: relative;
        flex: 0 0 300px;
        width: 300px;
        height: 150px;
        /*background-color: #333333;*/
        background: url("../videoUpload/video.jpeg") no-repeat center;
    }

    .upload-demo {
        align-self: flex-end;
        padding-bottom: 20px;
        padding-left: 20px;
    }
</style>
