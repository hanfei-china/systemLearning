<template>
    <el-input v-if="fieldType === 1" :maxlength="200" size="small" v-model="copyValue"
              :placeholder="config.typeConfig.placeholder" clearable/>
    <el-input v-else-if="fieldType === 2" type="textarea" :rows="5" resize="none" size="small" v-model="copyValue"
              :placeholder="config.typeConfig.placeholder" clearable/>
    <el-date-picker v-else-if="fieldType === 3" ref="component" :placeholder="config.typeConfig.placeholder"
                    size="small" :type="parameter.type" v-model="copyValue" style="width: 100%;"/>
    <el-select ref="component" v-else-if="fieldType === 4 || fieldType === 5" size="small"
               :multiple="fieldType === 5" v-model="copyValue" :placeholder="config.typeConfig.placeholder" clearable style="width: 100%;">
        <el-option v-for="option of options" :key="option.code"
                   :value="option.code" :label="option.content"/>
    </el-select>
    <el-upload v-else-if="fieldType === 6" :action="action" :http-request="httpRequest" :on-remove="removeFile" :file-list="fileList"
               list-type="picture-card" :before-upload="beforeUpload" :on-change="onChange" :limit="max" multiple :on-exceed="onExceed">
        <i class="el-icon-plus"/>
    </el-upload>
    <el-upload v-else-if="fieldType === 7" :action="action" :http-request="httpRequestForFile" :on-remove="removeFileForFile" :file-list="fileList"
               :before-upload="beforeUpload" :on-change="onChange" :limit="max" multiple :on-exceed="onExceed">
        <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div v-else-if="fieldType === 8" v-html="config.typeConfig.content"></div>
</template>

<script>
    const uuidTimestamp = require('uuid/v1');
    export default {
        name: "OnlineFormEditField",
        props: ['value', 'config',],
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                copyValue: null,
                action:  '/api/common/anon/uploadFile',
                fileList: []
            }
        },
        computed: {
            fieldType() {
                return this.config.type;
            },
            parameter() {
                return this.config.typeConfig;
            },
            options(){
                let options = [];
                if(this.parameter.list){
                    for(let option of this.parameter.list){
                        if(!option.isDelete){
                            options.push(option);
                        }
                    }
                }
                return options;
            },
            multiple(){
                return this.parameter.multiple;
            },
            max(){
                if(this.multiple){
                    return this.parameter.max;
                }

                return 1;
            },
        },
        methods:{
            hidden(){
                if(this.$refs.component){
                    if(this.$refs.component.pickerVisible){
                        this.$refs.component.pickerVisible = false;
                    }

                    if(this.$refs.component.dropDownVisible){
                        this.$refs.component.dropDownVisible = false;
                    }

                    if(this.$refs.component.visible){
                        this.$refs.component.visible = false;
                    }
                }

                if(this.$refs.children){
                    this.$refs.children.hidden();
                }
            },
            httpRequest(elFile){
                let {file} = elFile;
                let {uid} = file;
                let data = new FormData();
                let listFile = null;
                this.fileList.map(item=>{
                    if(item.uid === uid){
                        listFile = item;
                    }
                });
                if(listFile){
                    listFile.status = 'progress';
                    data.append('file',file);
                    this.$request.post('/api/common/anon/uploadFile',data).then(response=>{
                        listFile.url = response.data;
                        listFile.status = 'success';
                        this.changeCopyValue();
                    })
                }
            },
            httpRequestForFile(elFile){
                let {file} = elFile;
                let {uid} = file;
                let data = new FormData();
                let listFile = null;
                this.fileList.map(item=>{
                    if(item.uid === uid){
                        listFile = item;
                    }
                });
                if(listFile){
                    listFile.status = 'progress';
                    data.append('file',file);
                    this.$request.post('/api/common/anon/uploadFile',data).then(response=>{
                        listFile.url = response.data;
                        listFile.status = 'success';
                        this.changeCopyValueForFile();
                    })
                }
            },
            onChange(file, fileList){
                this.fileList = fileList;
            },
            removeFile(file,fileList){
                this.fileList = fileList.filter(tempFile=>{
                    return tempFile.uid !== file.uid;
                });
                this.changeCopyValue();
            },
            removeFileForFile(file,fileList){
                this.fileList = fileList.filter(tempFile=>{
                    return tempFile.uid !== file.uid;
                });
                this.changeCopyValueForFile();
            },
            btnClick(){
                return true;
            },
            beforeUpload(file){
                if(file.size > 100*1024*1024){
                    this.$message.warning('上传失败，文件大小应不大于100M');
                    return false;
                }
                return true;
            },
            changeCopyValue(){
                let val = [];
                for(let file of this.fileList){
                    let {url,status} = file;
                    if(status === 'success'){
                        val.push(url);
                    }
                }
                this.copyValue = val;
            },
            changeCopyValueForFile(){
                let val = [];
                for(let file of this.fileList){
                    let {url,status,uid,name} = file;
                    if(status === 'success'){
                        val.push({url,status,uid,name});
                    }
                }
                this.copyValue = val;
            },
            onExceed(){
                let name = this.fieldType === 6 ? '图片':'文件';
                this.$message.warning(`上传${name}超过上限，只能上传${this.max}${this.fieldType === 6 ? '张':'个'}${name}`);
            }
        },
        created() {
            if (this.value) {
                this.copyValue = this.value;
                if(this.fieldType === 6 && this.value){
                    let temp = [];

                    for(let url of this.value){
                        let uid = uuidTimestamp();
                        temp.push({
                            url,
                            status:'success',
                            uid
                        })
                    }
                    this.fileList = temp;
                }

                if(this.fieldType === 7 && this.value){
                    this.fileList = this.value;
                }
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            },
        }
    }
</script>
