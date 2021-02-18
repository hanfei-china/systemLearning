<template>
    <el-container class="absolute-fill-parent">
        <el-header class="border-bottom flex flex-center flex-column">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-center flex-column" style="font-size: 14px;">
                    {{containerTitle}}
                </div>
                <div class="flex">
                    <el-button icon="el-icon-success" size="small" type="primary" plain @click="save(false)">仅保存</el-button>
                    <el-button icon="el-icon-s-claim" type="primary" size="small" @click="save(true)">保存并发布</el-button>
                    <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="margin: 0 auto;max-width: 800px;padding: 16px 0;">
                        <el-form size="small" label-width="120px">
                            <el-form-item label="标题：" required>
                                <el-input v-model="contentEntity.title" placeholder="请输入标题，50字以内" :maxlength="50"/>
                            </el-form-item>
                            <div class="flex">
                                <el-form-item label="标签：" class="flex-fill-in-the-remaining-space">
                                    <content-label-choose :class-id="contentClass.id" v-model="contentEntity.contentLabels"/>
                                </el-form-item>
                                <el-form-item required label="发布时间：" class="flex-fill-in-the-remaining-space">
                                    <el-date-picker v-model="contentEntity.publishTime" type="datetime" style="width: 100%;"
                                                    format="yyyy-MM-dd HH:mm" :picker-options="pickerOptions"/>
                                </el-form-item>
                            </div>
                            <div class="flex">
                                <el-form-item required label="阅读量：" class="flex-fill-in-the-remaining-space">
                                    <el-input-number :min="0" v-model="contentEntity.readingNum"/>
                                </el-form-item>
                                <el-form-item v-if="contentClass.isOpenMemberPrivilege" required label="权限设置：" class="flex-fill-in-the-remaining-space">
                                    <member-group-multi-tree-provider v-model="contentEntity.privilegeSetting" only-static/>
                                </el-form-item>
                            </div>
                            <el-form-item label="内容：" v-if="originalContentType === 0 || originalContentType === 6 || originalContentType === 7">
                                <el-upload v-if="originalContentType === 0" style="margin-right: 10px;margin-bottom: 10px;" accept=".doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                           :show-file-list="false" :action="wordAction" :before-upload="wordBeforeUpload" :on-success="wordUploadSuccess">
                                    <el-button icon="iconfont icon-word" size="small" type="primary" plain>从word中导入内容</el-button>
                                    <div slot="tip" style="padding-top: 4px;">
                                        <span class="danger-tip">推荐使用【.docx】类型文件，【.doc】类型建议另存为【.docx】后进行解析</span>
                                    </div>
                                </el-upload>
                                <editor v-loading="parseing"
                                        element-loading-background="rgba(0, 0, 0, 0.8)"
                                        element-loading-text="内容解析中..." ref="editor" v-model="contentEntity.content"/>
                            </el-form-item>
                            <el-form-item label="附件：" v-if="originalContentType === 0">
                                <multiple-upload v-model="contentEntity.attachments"/>
                            </el-form-item>
                            <el-form-item v-if="originalContentType === 0||originalContentType === 4||originalContentType === 8">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        互动功能：
                                    </div>
                                </template>
                                <el-radio-group v-model="contentEntity.interact">
                                    <el-radio :label="true">有互动(点亮、分享、评论)</el-radio>
                                    <el-radio :label="false">无互动</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="封面：" required v-if="contentClass&&contentClass.type==2">
                                <image-upload v-model="contentEntity.poster" :attributes="{uploadBtnText:'上传海报',width:190,height:280}"/>
                            </el-form-item>
                            <el-form-item label="封面：" v-else>
                                <image-upload v-model="contentEntity.poster" :attributes="{uploadBtnText:'上传海报'}"/>
                            </el-form-item>
                            <el-form-item label="视频："  v-if="originalContentType === 4">
                                <!-- <video-upload class="item-input" v-model="contentEntity.linkAddress" :fileId.sync="contentEntity.otherId"/> -->
                                <video-upload class="item-input" :fileId.sync="contentEntity.otherId" :linkAddress.sync="contentEntity.linkAddress" :vid.sync="contentEntity.vid"/>
                            </el-form-item>
                            <el-form-item label="链接：" required v-if="originalContentType === 1 || originalContentType === 2 || originalContentType === 3">
                                <div class="flex">
                                    <el-select v-model="contentEntity.contentType" style="width: 120px;" class="first-input-item">
                                        <el-option label="链接" :value="1"></el-option>
                                        <el-option label="图文" :value="2"></el-option>
                                    </el-select>
                                    <el-input v-show="contentEntity.contentType === 1" v-model="contentEntity.linkAddress" maxlength="500" placeholder="请输入链接地址，需携带请求协议http或https" class="second-input-item" />
                                    <content-list v-show="contentEntity.contentType === 2" v-model="contentEntity.otherId" class="second-input-item"/>
                                </div>
                            </el-form-item>
                            <el-form-item label="音频：" required v-if="originalContentType === 8">
                                <audio-upload  class="item-input" v-model="contentEntity.linkAddress" :fileId.sync="contentEntity.otherId"/>
                            </el-form-item>
                            <el-form-item label="文件：" required v-if="originalContentType === 5">
                                <el-upload :action="action" :on-success="uploadSuccess" :on-remove="removeFile"
                                           :file-list="fileList" :before-upload="beforeUpload">
                                    <el-button size="small" type="primary" :disabled="disabled" v-show="!disabled">上传文件</el-button>
                                    <label class="el-button el-button--primary el-button--small" style="margin-left: 0;" @click.stop.prevent="btnClick" v-show="disabled">上传文件</label>
                                    <div slot="tip" class="el-upload__tip">文件大小不大于100M，只能上传一个文件，上传新文件时需先删除已上传文件</div>
                                </el-upload>
                            </el-form-item>
                            <el-form-item :label="originalContentType !== 4 ? '摘要：':'视频简介：'">
                                <el-input type="textarea" :rows="3" maxlength="500" :placeholder="originalContentType === 0 ? '选填，若不填则默认抓取正文前54字，500字以内。' : (originalContentType !== 4 ? '请输入摘要，500字以内' :'请输入视频简介，500字以内')"
                                          v-model="contentEntity.contentAbstract" resize="none"/>
                            </el-form-item>
                        </el-form>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {contentType} from "../../../../../js/util/constantStore";
    import ContentLabelChoose from "../contentLabelManage/ContentLabelChoose";
    import Editor from "../../../../util/editor/Editor";
    import ImageUpload from "../../../../util/ImageUpload";
    import VideoUpload from "../../../../util/videoUpload/VideoUpload";
    import ContentList from "./ContentList";
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
    import MemberGroupMultiTreeProvider from "../../../util/group/memberGroup/MemberGroupMultiTreeProvider";
    import MultipleUpload from "../../../util/upload/MultipleUpload";
    import AudioUpload from "../../../../util/audioUpload/AudioUpload";

    export default {
        name: "ContentForm",
        components: {
            MultipleUpload,AudioUpload,
            MemberGroupMultiTreeProvider, ContentList, VideoUpload, ImageUpload, Editor, ContentLabelChoose},
        props:{
            originalContentType: {
                type: Number,
                default: 0
            },
            id: String,
            contentClass: Object,
        },
        computed:{
            containerTitle(){
                let title = '新增';
                if(this.id){
                    title = '编辑';
                }
                title += contentType[this.originalContentType];
                return title;
            },
            disabled(){
                return this.fileList.length >= 1;
            }
        },
        data(){
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                wordAction: requestBaseUrl + '/api/common/parse/word',
                pickerOptions:{
                    disabledDate:(chooseDate)=>{
                        return chooseDate.getTime() > new Date().getTime();
                    }
                },

                contentEntity:{
                    contentType: this.originalContentType,
                    classId: this.contentClass.id,

                    content: '',
                    contentAbstract: '',
                    contentLabels: [],
                    isTop: true,
                    linkAddress: '',
                    otherId: '',
                    interact: false,
                    poster: '',
                    publishTime: new Date(),
                    readingNum: 0,
                    title: '',
                    privilegeSetting: [],
                    attachments:[],
                    vid:''
                },

                fileList:[],
                parseing: false
            }
        },
        methods:{
            save(isPublish){
                if(this.contentClass.type==2&&!this.contentEntity.poster){
                    this.$message.error("封面不能为空")
                    return
                }
                if(this.contentClass.linkAddress===''&&this.contentEntity.vid===''){
                    this.$message.error("视频不能为空")
                    return
                }
                let content = {
                    ...this.contentEntity,
                    contentLabels: JSON.stringify(this.contentEntity.contentLabels),
                    isPublish: isPublish,
                    privilegeSetting: JSON.stringify(this.contentEntity.privilegeSetting),
                    attachments: JSON.stringify(this.contentEntity.attachments)
                };

                if(this.id){
                    content.id = this.id;
                    this.$request.put('/api/admin/content',content).then(()=>{
                        this.$emit('refresh');
                        this.$message.success("内容修改成功");
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/content',content).then(()=>{
                        this.$emit('refresh');
                        this.$message.success("内容新增成功");
                        this.$emit('close');
                    })
                }

            },
            uploadSuccess(response,file){
                this.fileList.splice(0,1);
                let name = file.name;
                let url = response.data;
                this.fileList.push({name,url});
                this.contentEntity.otherId = name;
                this.contentEntity.linkAddress = url;
            },
            removeFile(){
                this.fileList.splice(0,1);
                this.contentEntity.otherId = '';
                this.contentEntity.linkAddress = '';
            },
            btnClick(){
                if(this.contentEntity.otherId && this.contentEntity.otherId !== ''){
                    this.$message.warning('上传新文件时需先删除已上传文件');
                    return false;
                }else{
                    return true;
                }
            },
            beforeUpload(file){
                if(file.size > 100*1024*1024){
                    this.$message.warning('上传失败，文件大小应不大于100M');
                    return false;
                }
                return true;
            },
            wordUploadSuccess(response){
                this.$refs.editor.appendContent(response.data);
                this.parseing = false;
            },
            wordBeforeUpload(){
                this.parseing = true;
            }
        },
        created() {
            if(this.id){
                this.$request.get('/api/common/content/anon/detail',{
                    params:{id: this.id}
                }).then(res=>{
                    let {data} = res;
                    console.log(data);
                    this.contentEntity.content = data.content;
                    this.contentEntity.contentAbstract = data.contentAbstract;
                    this.contentEntity.contentLabels = JSON.parse(data.contentLabels);
                    this.contentEntity.isTop = data.isTop;
                    this.contentEntity.linkAddress = data.linkAddress;
                    this.contentEntity.otherId = data.otherId;
                    this.contentEntity.poster = data.poster;
                    this.contentEntity.interact = data.interact;
                    this.contentEntity.publishTime = new Date(data.publishTime);
                    this.contentEntity.title = data.title;
                    this.contentEntity.readingNum = data.readingNum;
                    this.contentEntity.privilegeSetting = data.privilegeSetting ? JSON.parse(data.privilegeSetting) : [];
                    this.contentEntity.attachments = data.attachments ? JSON.parse(data.attachments) : [];
                    this.contentEntity.vid=data.vid;

                    this.fileList.push({name:data.otherId,url:data.linkAddress});
                })
            }
        }
    }
</script>

