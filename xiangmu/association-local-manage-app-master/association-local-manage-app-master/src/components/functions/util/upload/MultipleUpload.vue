<template>
    <el-upload :action="action" :http-request="httpRequest" :on-remove="removeFile"
               :file-list="fileList" :before-upload="beforeUpload" :on-change="onChange" multiple>
        <el-button size="small" type="primary">{{buttonText}}</el-button>
        <div v-if="tip" slot="tip" class="el-upload__tip">{{tip}}</div>
    </el-upload>
</template>

<script>
    import {requestBaseUrl} from "../../../../js/config/serviceConfig";

    export default {
        name: "MultipleUpload",
        props: {
            beforeUpload: {
                type: Function,
                default() {
                    return () => {
                        return true;
                    }
                }
            },
            tip: String,
            buttonText: {
                type: String,
                default: '上传文件'
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                fileList: JSON.parse(JSON.stringify(this.value)),
            }
        },
        methods: {
            httpRequest(elFile) {
                let {file} = elFile;
                let {uid} = file;
                let data = new FormData();
                let listFile = null;
                this.fileList.map(item => {
                    if (item.uid === uid) {
                        listFile = item;
                    }
                });
                if (listFile) {
                    listFile.status = 'progress';
                    data.append('file', file);
                    this.$request.post('/api/common/anon/uploadFile', data).then(response => {
                        let url = response.data;
                        this.fileList.map(item => {
                            if (item.uid === uid) {
                                listFile.url = url;
                                listFile.status = 'success';
                            }
                        })
                    })
                }

            },
            onChange(file, fileList) {
                this.fileList = fileList;
            },
            removeFile(file, fileList) {
                this.fileList = fileList.filter(tempFile => {
                    return tempFile.uid !== file.uid;
                })
            },
        },
        watch: {
            fileList: {
                deep: true,
                handler(val) {
                    let array = [];
                    for (let file of val) {
                        let {status, name, uid, url} = file;
                        if (status === 'success') {
                            array.push({
                                status, name, uid, url
                            });
                        }
                    }

                    this.$emit('change', array);
                }
            },
            value(val){
                // console.log(val);
                if(this.fileList.length < 1 && val && val.length>0){
                    this.fileList = val;
                }
            }
        }
    }
</script>
