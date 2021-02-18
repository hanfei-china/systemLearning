<template>
    <el-container class="background-color-white absolute-fill-parent">
        <el-aside width="200px" class="border-right position-relative">
            <group-list :operable="false" v-model="chosenGroup" :type-name="typeName" group-type="9"></group-list>
        </el-aside>
        <template>
            <el-main v-if="seriesCourseVisible" class="unset-padding position-relative">
                <series-course v-if="seriesCourseVisible" :id="editCourseId" @close="seriesCourseVisible = false" @refresh="getList"></series-course>
            </el-main>
            <el-main v-else-if="documentCourseVisible" class="unset-padding position-relative">
                <document-course v-if="documentCourseVisible" :id="editCourseId" @close="documentCourseVisible = false" @refresh="getList"></document-course>
            </el-main>
            <el-main v-else-if="videoCourseVisible" class="unset-padding position-relative">
                <video-course v-if="videoCourseVisible" :id="editCourseId" @close="videoCourseVisible = false" @refresh="getList"></video-course>
            </el-main>
            <el-main v-else class="unset-padding position-relative">
                <el-container class="absolute-fill-parent" style="padding: 16px;">
                    <el-header height="auto" class="flex" style="padding: 0 0 16px;">
                        <div class="flex-fill-in-the-remaining-space flex">
                            <div style="width: 180px;margin-right: 16px;">
                                <el-input size="small" prefix-icon="el-icon-search"
                                          placeholder="搜索课程标题/讲师姓名" v-model="searchContent"></el-input>
                            </div>
                            <div style="margin-right: 16px;">
                                <el-input size="small" placeholder="最低价格" style="width: 90px;" v-model="startPrice"></el-input>
                                <span style="padding: 0 6px;">-</span>
                                <el-input size="small" placeholder="最高价格" style="width: 90px;" v-model="endPrice"></el-input>
                            </div>
                            <div style="width: 160px;margin-right: 16px;">
                                <el-select size="small" placeholder="请选择课程状态" clearable v-model="enabled">
                                    <el-option :value="true" label="已上架"></el-option>
                                    <el-option :value="false" label="未上架"></el-option>
                                </el-select>
                            </div>
                            <div style="width: 160px;margin-right: 16px;">
                                <el-select size="small" placeholder="请选择课程类型" v-model="type" clearable>
                                    <el-option :value="0" label="系列课程"></el-option>
                                    <el-option :value="1" label="单文档课程"></el-option>
                                    <el-option :value="2" label="单视频课程"></el-option>
                                </el-select>
                            </div>
                            <div style="line-height: 32px;">
                                <el-checkbox v-model="recommend">推荐课程</el-checkbox>
                                <el-checkbox v-model="selected">精选课程</el-checkbox>
                            </div>
                        </div>
                        <div>
                            <el-dropdown size="small" trigger="click" @command="handleCommand">
                                <el-button type="primary" size="small">
                                    新增课程<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="seriesCourseVisible">
                                        系列课程
                                    </el-dropdown-item>
                                    <el-dropdown-item command="documentCourseVisible">
                                        单文档课程
                                    </el-dropdown-item>
                                    <el-dropdown-item command="videoCourseVisible">
                                        单视频课程
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-header>
                    <el-main class="unset-padding">
                        <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border
                                  stripe @selection-change="handleSelectionChange">
                            <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                            <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
                            <el-table-column label="课堂类型" show-tooltip-when-overflow>
                                <template v-slot="{row}">
                                    <span v-if="row.type === 0">单文档课程</span>
                                    <span v-if="row.type === 1">单视频课程</span>
                                    <span v-if="row.type === 2">系列课程</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" show-tooltip-when-overflow >
                                <template v-slot="{row}">
                                    <el-button size="small" type="text" class="unset-padding" @click="toCourseDetail(row.id)">
                                        {{row.title}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="讲师">
                                <template v-slot="{row}">
                                    <el-tooltip effect="dark" placement="top">
                                        <div slot="content">
                                            <p v-for="(item,index) of row.lecturers" :key="item.id" style="display: inline-block;">
                                                {{item.name}}<span v-if="row.lecturers.length-1>index">、</span>
                                            </p>
                                        </div>
                                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                            <p v-for="(item,index) of row.lecturers" :key="item.id" style="display: inline-block;">
                                                {{item.name}}<span v-if="row.lecturers.length-1>index">、</span>
                                            </p>
                                        </div>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <!--<el-table-column label="学习(人数)"></el-table-column>
                            <el-table-column label="浏览(人数)"></el-table-column>
                            <el-table-column label="分享(人数)"></el-table-column>
                            <el-table-column label="收藏(人数)"></el-table-column>
                            <el-table-column label="评价(人数)"></el-table-column>
                            <el-table-column label="评分"></el-table-column>-->
                            <el-table-column label="售价(元)" prop="price"></el-table-column>
<!--                            <el-table-column label="订单量"></el-table-column>-->
                            <el-table-column label="创建时间" width="90px">
                                <template v-slot="{row}">
                                    {{row.createTime | yyyyMMdd}}
                                </template>
                            </el-table-column>
                            <el-table-column label="上架" width="65px">
                                <template v-slot="{row}">
                                    <el-switch v-model="row.enabled" active-color="#13ce66" @change="operateCourse($event,row.id)"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="推荐" width="65px">
                                <template v-slot="{row}">
                                    <el-switch v-model="row.recommend" active-color="#13ce66" @change="recommendCourse($event,row.id)"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="精选" width="65px">
                                <template v-slot="{row}">
                                    <el-switch v-model="row.selected" active-color="#13ce66" @change="selectedCourse($event,row.id)"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" fixed="right" width="90px">
                                <template v-slot="{row}">
                                    <el-button type="text" size="small" class="unset-padding" @click="editCourse(row.type,row.id)">编辑</el-button>
                                    <el-button type="text" size="small" class="unset-padding custom-el-button danger" @click="deleteCourse(row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <el-footer height="auto" style="padding: 16px 0 0;" class="flex">
                        <div>
                            <batch-operation title="批量操作">
                                <li>已选({{selectList.length}}/{{page.total}})</li>
                                <li @click="operateSelectCourse(true)">上架</li>
                                <li @click="operateSelectCourse(false)">下架</li>
                                <li @click="recommendSelectCourse(true)">推荐</li>
                                <li @click="recommendSelectCourse(false)">取消推荐</li>
                                <li @click="selectedSelectCourse(true)">精选</li>
                                <li @click="selectedSelectCourse(false)">取消精选</li>
                                <li @click="deleteSelectCourse">删除</li>
                            </batch-operation>
                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="page.total" layout="total, sizes, prev, pager, next, jumper"
                                           @current-change="handleCurrentChange" @size-change="handleSizeChange">
                            </el-pagination>
                        </div>
                    </el-footer>
                </el-container>
            </el-main>
        </template>
        <el-drawer :visible.sync="courseDetailVisible" :show-close="false" append-to-body size="800px"
                   custom-class="courseDetail">
            <course-detail v-if="courseDetailVisible" :id="detailId"></course-detail>
        </el-drawer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../util/BatchOperation";
    import DocumentCourse from "./addCourse/documentCourse/DocumentCourse";
    import VideoCourse from "./addCourse/videoCourse/VideoCourse";
    import SeriesCourse from "./addCourse/seriesCourse/SeriesCourse";
    import CourseDetail from "./courseDetail/CourseDetail";
    import GroupList from "../../../util/group/GroupList";

    export default {
        name: "CourseManage",
        components: {GroupList, CourseDetail, SeriesCourse, VideoCourse, DocumentCourse, BatchOperation},
        data() {
            return {
                typeName: '分类',
                chosenGroup: {},
                chosenGroupId: '',

                searchContent: '',//搜索
                startPrice: null,
                endPrice: null,
                enabled: null,//是否上架
                type: null,//类型
                recommend: false,//推荐
                selected: false,//精选

                selectList: [],//选中的项
                list: [],
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                editCourseId: '',
                seriesCourseVisible: false,
                documentCourseVisible: false,
                videoCourseVisible: false,
                courseDetailVisible: false,
                detailId: ''
            }
        },
        watch: {
            chosenGroup(val) {
                if (val && val.id === '0') {
                    this.chosenGroupId = ""
                } else {
                    this.chosenGroupId = val.id
                }
                this.getList();
            },
            searchContent() {
                this.getList();
            },
            startPrice(){
                this.getList();
            },
            endPrice(){
                this.getList();
            },
            enabled(){
                this.getList();
            },
            type(){
                this.getList();
            },
            recommend(){
                this.getList();
            },
            selected(){
                this.getList();
            },
        },
        methods: {
            getList() {
                this.$request.get('/api/admin/onlineCourse',{params: {
                        categoryId: this.chosenGroupId,
                        enabled: this.enabled,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        priceRange: this.startPrice&&this.endPrice?[Number(this.startPrice),Number(this.endPrice)]:[],
                        recommend: this.recommend,
                        searchContent: this.searchContent,
                        selected: this.selected,
                        type: this.type
                    }}).then(res=>{
                        if(res.success){
                            this.list = res.data.list;
                            this.page.total = res.data.total;
                        }
                })
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            handleSelectionChange(list){
                this.selectList = [];
                for(let item of list){
                    this.selectList.push(item.id)
                }
            },
            //上架下架
            operateCourse(status, id){
                if(status){
                    this.$request.put('/api/admin/onlineCourse/enable/' + id)
                }else {
                    this.$request.put('/api/admin/onlineCourse/disable/' + id)
                }
            },
            operateSelectCourse(status){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要操作的项');
                    return;
                }
                if(status){
                    this.$request.put('/api/admin/onlineCourse/enable',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已上架');
                            this.getList();
                        }
                    })
                }else {
                    this.$request.put('/api/admin/onlineCourse/disable',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已下架');
                            this.getList();
                        }
                    })
                }
            },
            //删除
            deleteCourse(id){
                this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/onlineCourse/'+id).then(res=>{
                        if(res.success){
                            this.$message.success('课程已删除');
                            this.getList();
                        }
                    })
                }).catch(() => {});
            },
            deleteSelectCourse(){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要删除的项');
                    return;
                }
                this.$confirm('此操作将永久删除所选课程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/onlineCourse',{params: {courseIds : this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已删除');
                            this.selectList = [];
                            this.getList();
                        }
                    })
                }).catch(()=>{})
            },
            //推荐
            recommendCourse(status, id){
                if(status){
                    this.$request.put('/api/admin/onlineCourse/recommend' + id)
                }else {
                    this.$request.put('/api/admin/onlineCourse/unrecommend/' + id)
                }
            },
            recommendSelectCourse(status){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要操作的项');
                    return;
                }
                if(status){
                    this.$request.put('/api/admin/onlineCourse/recommend',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已开启推荐');
                            this.getList();
                        }
                    })
                }else {
                    this.$request.put('/api/admin/onlineCourse/unrecommend',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已取消推荐');
                            this.getList();
                        }
                    })
                }
            },
            //精选
            selectedCourse(status, id){
                if(status){
                    this.$request.put('/api/admin/onlineCourse/selected/' + id)
                }else {
                    this.$request.put('/api/admin/onlineCourse/unselected/' + id)
                }
            },
            selectedSelectCourse(status){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要操作的项');
                    return;
                }
                if(status){
                    this.$request.put('/api/admin/onlineCourse/selected',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已开启精选');
                            this.getList();
                        }
                    })
                }else {
                    this.$request.put('/api/admin/onlineCourse/unselected',null,{params: {courseIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选课程已取消精选');
                            this.getList();
                        }
                    })
                }
            },
            //新建
            handleCommand(command) {
                this[command] = true;
            },
            //编辑
            editCourse(type,id){
                this.editCourseId = id;
                if(type === 0){
                    this.documentCourseVisible = true;
                }else if(type === 1){
                    this.videoCourseVisible = true;
                }else if(type === 2){
                    this.seriesCourseVisible = true;
                }
            },
            //查看详情
            toCourseDetail(id) {
                this.detailId = id;
                this.courseDetailVisible = true;
            }
        }
    }
</script>

<style lang="less">
    .courseDetail {
        color: #555555;

        .el-drawer__header {
            padding: 0;
            margin: 0;
        }
    }
</style>

