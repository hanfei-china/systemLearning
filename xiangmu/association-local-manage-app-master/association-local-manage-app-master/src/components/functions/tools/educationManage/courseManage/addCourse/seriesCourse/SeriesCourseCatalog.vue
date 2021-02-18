<template>
    <el-container class="absolute-fill-parent">
        <el-header height="auto" class="flex border-bottom" style="padding: 16px;">
            <div class="flex-fill-in-the-remaining-space flex" style="padding-top: 4px;">
                <el-page-header @back="goBack" content='新增课程'></el-page-header>
                <div style="color: #909399;">
                    <span style="padding: 0 6px;font-size: 22px;">/</span>
                    <span>系列课程</span>
                </div>
            </div>
            <div>
                <el-button size="small" type="warning" @click="goBack">取消</el-button>
                <el-button size="small" type="warning" @click="lastStep">上一步</el-button>
                <el-button size="small" type="primary" @click="saveData(true)">保存并上架</el-button>
                <el-button size="small" type="primary" @click="saveData(false)">仅保存</el-button>
            </div>
        </el-header>
        <el-main class="position-relative">
            <el-container class="absolute-fill-parent">
                <el-header height="auto" style="padding: 16px;">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space">
                            <el-radio-group v-model="catelogType" size="small">
                                <el-radio-button label="first">一级目录</el-radio-button>
                                <el-radio-button label="second">二级目录</el-radio-button>
                            </el-radio-group>
                        </div>
                        <el-button size="small" type="primary" @click="uploadVideoVisible = true">上传宣传片</el-button>
                        <el-upload style="margin: 0 6px;" :action="action" :show-file-list="false"
                                   :on-success="uploadSuccess">
                            <el-button size="small" type="primary" v-if="catelogType === 'first'">上传课件</el-button>
                        </el-upload>
                        <el-button size="small" type="primary" v-if="catelogType === 'second'" @click="newSection">
                            新建章节
                        </el-button>
                    </div>
                    <div style="padding-top: 16px;" v-if="video">
                        <el-alert type="success" :closable="false">
                            <template v-slot:title>
                                <el-button size="small" type="text" class="unset-padding" @click="videoDetail">宣传片预览
                                </el-button>
                            </template>
                        </el-alert>
                    </div>
                </el-header>
                <el-main style="padding: 0 16px 16px;">
                    <template v-if="catelogType === 'first'">
                        <div class="container">
                            <div class="table-header flex">
                                <span class="flex-fill-in-the-remaining-space text-align-center">章节名称</span>
                                <span class="flex-fill-in-the-remaining-space text-align-center">修改课件</span>
                                <span class="flex-fill-in-the-remaining-space text-align-center">免费试看</span>
                                <span style="width: 200px;">操作</span>
                            </div>
                            <div class="table-body">
                                <ul ref="sortList">
                                    <li v-for="(field,index) in list" :key="index">
                                        <single-chapter :field="field" @delete-field="deleteField(index)"
                                                        @change-field="changeField($event,index)"></single-chapter>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                    <template v-if="catelogType === 'second'">
                        <second-catalog v-for="(field, index) of list" :key="index" :field="field"
                                        @delete-item="deleteItem(index)"></second-catalog>
                    </template>
                </el-main>
            </el-container>
        </el-main>
        <el-dialog :visible.sync="uploadVideoVisible" title="上传宣传片" append-to-body width="600px">
            <video-upload class="item-input" v-model="video"></video-upload>
        </el-dialog>
        <el-dialog :visible.sync="videoDisplayVisible" title="宣传片预览" append-to-body width="600px">
            <video-display v-if="videoDisplayVisible" :content="videoContent" videoWidth="560px"
                           videoHeight="300px"></video-display>
        </el-dialog>
    </el-container>
</template>

<script>
    import VideoDisplay from "../../../../content/contentManage/util/VideoDisplay";
    import VideoUpload from "../../../../../../util/videoUpload/VideoUpload";
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";
    import SecondCatalog from "./SecondCatalog";
    import SingleChapter from "./SingleChapter";
    import Sortable from 'sortablejs';

    export default {
        name: "SeriesCourseCatalog",
        components: {SingleChapter, SecondCatalog, VideoUpload, VideoDisplay},
        props: {
            id: String,
            basicInfo: Object
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',

                catelogType: 'first',//课程目录类型
                uploadVideoVisible: false,//上传宣传片
                videoDisplayVisible: false,
                videoContent: {},

                video: '',//宣传视频
                list: []
            }
        },
        mounted() {
            this.drag();
        },
        watch: {
            catelogType() {
                let copyList = this.list;
                this.list = [];
                if (this.catelogType === 'first' && copyList[0].items) {
                    for (let i = 0; i < copyList.length; i++) {
                        this.list = this.list.concat(copyList[i].items);
                    }
                } else if (this.catelogType === 'second' && !copyList[0].items) {
                    this.list.push({
                        name: "目录名称",
                        seq: this.list.length,
                        items: copyList
                    });
                } else {
                    this.list = copyList;
                }
            }
        },
        created() {
            if (this.id) {
                this.getInfo();
            }
        },
        methods: {
            //编辑的详情
            getInfo() {
                this.$request.get('/api/admin/onlineCourse/' + this.id).then(res => {
                    if (res.success) {
                        this.video = res.data.video;
                        this.list = JSON.parse(res.data.catalog);
                        if (JSON.parse(res.data.catalog).length > 0 && JSON.parse(res.data.catalog)[0].items) {
                            this.catelogType = 'second';
                        } else {
                            this.catelogType = 'first';
                        }
                    }
                })
            },
            goBack() {
                this.$emit("closeWrap")
            },
            lastStep() {
                this.$emit('close')
            },
            //上传宣传片
            uploadVideo(elUpload) {
                let qcVideo = window.qcVideo;
                let file = elUpload.file;
                if (this.beforeUpload(file)) {
                    this.$request.get('/api/admin/content/vodSignature').then((res) => {
                        let signature = res.data;

                        function getSignature(callback) {
                            return callback(signature);
                        }

                        let that = this;

                        qcVideo.ugcUploader.start({
                            videoFile: file,
                            getSignature: getSignature,
                            error: function (result) {
                                that.stopSendPulse();
                                that.percentage = -1;
                                that.$message.warning('上传失败：' + result.msg);
                            },
                            progress: function (result) {
                                that.percentage = parseFloat((result.curr * 100).toFixed(2));
                            },
                            finish: function (result) {//上传成功时的回调函数
                                that.copyFileId = result.fileId;
                                that.copyVideoUrl = result.videoUrl;
                                that.$emit('success', result.videoUrl);
                                that.uploading = false;
                                that.$emit('update:fileId', result.fileId);
                                that.$message.success('视频上传成功');
                                that.percentage = 0;
                                that.stopSendPulse();
                            }
                        });
                    })
                }
            },
            videoDetail() {
                this.videoDisplayVisible = true;
                this.videoContent = {linkAddress: this.video};
            },
            //上传课件（一级菜单）
            uploadSuccess(res) {
                this.list.push({
                    name: '章节名称',
                    resource: res.data,
                    free: false,
                    seq: this.list.length
                })
            },
            deleteField(index) {
                this.list.splice(index, 1);
            },
            changeField(val, index) {
                this.list.splice(index, 1, val);
            },
            //新建章节（二级菜单）
            newSection() {
                this.list.push({
                    name: "目录名称",
                    seq: this.list.length,
                    items: []
                })
            },
            deleteItem(index) {
                this.list.splice(index, 1);
            },
            //保存
            saveData(enabled) {
                let params = this.basicInfo;
                params.enabled = enabled;
                params.video = this.video;
                params.catalog = JSON.stringify(this.list);

                if (this.id) {
                    params.id = this.id;
                    this.$request.put('/api/admin/onlineCourse', params).then(res => {
                        if (res.success) {
                            this.$message.success('课程已编辑');
                            this.$emit("closeWrap");
                            this.$emit("refresh");
                        }
                    })
                } else {
                    this.$request.post('/api/admin/onlineCourse', params).then(res => {
                        if (res.success) {
                            this.$message.success('课程已添加');
                            this.$emit("closeWrap");
                            this.$emit("refresh");
                        }
                    })
                }
            },
            //排序
            drag() {
                let el = this.$refs.sortList;
                Sortable.create(el, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.list));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue);
                        }
                    }
                });
            },
            sortFields(fieldList) {
                this.list = [];
                setTimeout(() => {
                    this.list = fieldList;
                }, 1);
            },
        }
    }
</script>

<style scoped lang="less">
    .container {
        box-sizing: border-box;
        border: 1px solid #d7dde4;
        color: #65717f;

        .table-header {
            background-color: #f5f8f9;
            height: 49px;
            border-bottom: 1px solid #d7dde4;
            line-height: 50px;

            span {
                display: inline-block;
            }
        }

        .table-body {
            /*margin: 0 20px;*/
            line-height: 49px;
        }
    }
</style>
