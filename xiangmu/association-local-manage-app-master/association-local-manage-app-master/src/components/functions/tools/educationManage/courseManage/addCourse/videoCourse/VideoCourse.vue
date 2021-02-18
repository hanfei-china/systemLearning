<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header height="auto" class="flex border-bottom" style="padding: 16px;">
            <div class="flex-fill-in-the-remaining-space flex" style="padding-top: 4px;">
                <el-page-header @back="goBack" content='新增课程'></el-page-header>
                <div style="color: #909399;">
                    <span style="padding: 0 6px;font-size: 22px;">/</span>
                    <span>单视频课程</span>
                </div>
            </div>
            <div>
                <el-button size="small" type="warning" @click="goBack">取消</el-button>
                <el-button size="small" type="primary" @click="saveData(true)">保存并上架</el-button>
                <el-button size="small" type="primary" @click="saveData(false)">仅保存</el-button>
            </div>
        </el-header>
        <el-main class="position-relative">
            <vue-scroll>
                <div style="width: 840px;">
                    <el-form size="small" label-width="110px">
                        <el-form-item label="课程标题" required>
                            <el-input placeholder="请输入课程标题" v-model="title"></el-input>
                        </el-form-item>
                        <el-form-item label="课程分类" required>
                            <el-select style="width: 350px;margin-right: 30px;" placeholder="请选择一级分类"
                                       v-model="categoryId1">
                                <el-option v-for="item in firstList" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                            <el-select style="width: 350px;" placeholder="请选择二级分类" v-model="categoryId2">
                                <el-option v-for="item in secondList" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程售价" required>
                            <el-input placeholder="请输入出售金额，不输入或输入为零则认为该课程免费" v-model="price"></el-input>
                        </el-form-item>
                        <el-form-item label="课程讲师" required>
                            <el-select placeholder="请输入讲师姓名或ID搜索" multiple clearable filterable v-model="lecturerIds" style="width: 100%;">
                                <el-option v-for="item in lecturerList" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="更多选项" required>
                            <div style="width: 710px;padding: 0 10px;background-color: #F9F9F9;">
                                <el-checkbox v-model="recommend">推荐课程</el-checkbox>
                                <el-checkbox v-model="selected">精选课程</el-checkbox>
                            </div>
                        </el-form-item>
                        <el-form-item label="视频课件" required>
                            <video-upload class="item-input" v-model="resource"></video-upload>
                        </el-form-item>
                        <el-form-item label="课程海报">
                            <div class="flex">
                                <div style="width: 160px;height: 100px;background-color: #999999;margin-right: 16px;">
                                    <el-image v-if="poster" fit="contain" style="width: 100%;height: 100%;" :src="poster"></el-image>
                                </div>
                                <div class="flex flex-column flex-end">
                                    <el-upload :action="action" :show-file-list="false"
                                               :on-success="uploadPosterSuccess">
                                        <el-button size="small" type="primary">上传海报</el-button>
                                    </el-upload>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="课程简介" required>
                            <el-input type="textarea" :rows="5" v-model="introduction"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";
    import VideoUpload from "../../../../../../util/videoUpload/VideoUpload";

    export default {
        name: "VideoCourse",
        components: {VideoUpload},
        props: {
            id: String
        },
        data(){
            return{
                action: requestBaseUrl + '/api/common/anon/uploadFile',

                firstList: [],
                secondList: [],
                categoryId1: '',
                categoryId2: '',
                lecturerList: [],

                title: '',//标题
                price: null,//价格
                lecturerIds: [],//讲师id
                recommend: false,//推荐
                selected: false,//精选
                resource: '',//资源链接
                poster: '',//宣传海报
                introduction: '',//简介
            }
        },
        created() {
            this.getFirstList();
            this.getLecturerList();
            if(this.id){
                this.getInfo();
            }
        },
        watch: {
            categoryId1(val) {
                if (val) {
                    this.getSecondList(val);
                }
            }
        },
        methods: {
            //编辑的详情
            getInfo(){
                this.$request.get('/api/admin/onlineCourse/' + this.id).then(res=>{
                    if(res.success){
                        this.categoryId = res.data.categoryId.split('/');

                        this.title = res.data.title;
                        this.price = res.data.price;
                        this.categoryId1 = this.categoryId[0];
                        this.introduction = res.data.introduction;
                        this.poster = res.data.poster;
                        this.recommend = res.data.recommend;
                        this.resource = res.data.resource;
                        this.selected = res.data.selected;
                        this.lecturerIds = res.data.lecturers.map(item=>{
                            return item.id
                        });
                    }
                })
            },
            //获取分类列表
            getFirstList() {
                this.$request.get('/api/admin/group/getGroup', {
                    params: {
                        maxLevel: 2,
                        type: 9
                    }
                }).then(res => {
                    if (res.success) {
                        this.firstList = res.data;
                    }
                })
            },
            getSecondList(id) {
                this.categoryId2 = '';
                if(this.categoryId && this.categoryId.length === 2){
                    this.categoryId2 = this.categoryId[1];
                    this.categoryId = [];
                }

                this.$request.get('/api/admin/group/getGroup', {
                    params: {
                        maxLevel: 2,
                        type: 9,
                        id: id,
                        operate: 1
                    }
                }).then(res => {
                    if (res.success) {
                        this.secondList = res.data[0].children;
                    }
                })
            },
            //获取讲师列表
            getLecturerList() {
                this.$request.get('/api/admin/onlineCourse/Lecturer/all').then(res=>{
                    if(res.success){
                        this.lecturerList = res.data;
                    }
                })
            },
            //上传海报
            uploadPosterSuccess(res){
                this.poster = res.data;
            },
            //上传文档
            uploadVideoSuccess(res){
                this.resource = res.data;
            },
            //返回上一页
            goBack(){
                this.$emit("close")
            },
            //保存
            saveData(enabled) {
                if(!this.title){
                    this.$message.warning('请输入课程标题');
                    return;
                }
                if(!this.categoryId1){
                    this.$message.warning('请选择课程分类');
                    return;
                }
                if(this.lecturerIds.length === 0){
                    this.$message.warning('请选择课程讲师');
                    return;
                }
                if(!this.resource){
                    this.$message.warning('请上传课程文档');
                    return;
                }
                if(!this.introduction){
                    this.$message.warning('请输入课程简介');
                    return;
                }

                let params = {
                    categoryId: this.categoryId2?this.categoryId1 + '/' + this.categoryId2: this.categoryId1,
                    enabled: enabled,
                    introduction: this.introduction,
                    lecturerIds: this.lecturerIds,
                    poster: this.poster,
                    price: this.price?Number(this.price):0,
                    recommend: this.recommend,
                    resource: this.resource,
                    selected: this.selected,
                    title: this.title,
                    type: 1
                };

                if(this.id){
                    params.id = this.id;
                    this.$request.put('/api/admin/onlineCourse', params).then(res=>{
                        if(res.success){
                            this.$message.success('课程已编辑');
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }else {
                    this.$request.post('/api/admin/onlineCourse', params).then(res=>{
                        if(res.success){
                            this.$message.success('课程已添加');
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
