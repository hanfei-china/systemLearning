<template>
    <div style="padding: 24px;">
        <div style="padding: 16px 0;">
            <a :href="fileUrl" target="_blank"
               class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{fileName}}</a>
        </div>
        <el-upload with-credentials :action="action" :on-success="uploadSuccess" :on-remove="removeFile"
                   :file-list="fileList">
            <el-button type="primary" size="small">上传协议</el-button>
        </el-upload>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../js/config/serviceConfig";

    export default {
        name: "UploadProtocol",
        data() {
            return {
                action: requestBaseUrl + '/api/admin/settings/manage/updateUserProtocol',
                fileList: [],
                fileUrl: '',
                fileName: ''
            }
        },
        created() {
            this.getSetting();
        },
        methods: {
            getSetting() {
                this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 15}}).then(res => {
                    this.fileUrl = res.data.fileUrl + '?attname=' + encodeURI(res.data.fileName);
                    this.fileName = res.data.fileName;
                })
            },
            uploadSuccess(response, file) {
                this.fileList.splice(0, 1);
                let name = file.name;
                let url = response.data;
                this.fileList.push({name, url});
            },
            removeFile() {
                this.fileList.splice(0, 1);
            }
        }
    }
</script>
