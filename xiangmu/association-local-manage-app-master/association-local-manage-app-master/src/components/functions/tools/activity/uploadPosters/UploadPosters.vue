<template>
    <div class="uploadPosters-wrap flex">
        <div class="classify-wrap">
            <div class="classify">
                <div class="input-wrap">
                    <el-input size="small" placeholder="请输入海报分类" v-model="addTitle"></el-input>
                </div>
                <div class="input-wrap">
                    <el-select v-model="addIsUsed" size="small">
                        <el-option v-for="item in isUseds" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button type="primary" size="small" @click="addClassify">添加分类</el-button>
            </div>
            <div class="classify">
                <div class="input-wrap">
                    <el-input size="small" placeholder="请输入海报分类" v-model="editTitle"></el-input>
                </div>
                <div class="input-wrap">
                    <el-select v-model="editIsUsed" size="small">
                        <el-option v-for="item in isUseds" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button type="warning" size="small" @click="updateClassify">修改分类</el-button>
            </div>
            <div class="posters">
                <div class="input-wrap">
                    <el-select v-model="categoryId" size="small">
                        <el-option v-for="item in classifyListData" :key="item.id" :value="item.id"
                                   :label="item.title"></el-option>
                    </el-select>
                </div>
                <el-button size="small" type="primary" @click="addPosters">上传海报</el-button>
                <el-upload :action="action" :show-file-list="false" :on-success="getUrl" :on-change="changeEvent" class="avatar-uploader">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div class="classifyTable">
                <el-table :data="classifyListData" border>
                    <el-table-column prop="title" label="分类名称" width="120px"></el-table-column>
                    <el-table-column label="是否启用" width="100px">
                        <template slot-scope="{row}">
                            <span v-if="row.isUsed">启用</span>
                            <span v-else>不启用</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="{row}">
                            <el-button size="small" class="item-sort">排序</el-button>
                            <el-button size="small" type="warning" @click="editClassify(row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deleteClassify(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="posters-wrap">
            <div class="poster-table">
                <el-table :data="posterList" border height="100%">
                    <el-table-column label="分类">
                        <!--<template slot-scope="{row}">
                            <span v-if="row.posterCategoryId == "></span>
                        </template>-->
                    </el-table-column>
                    <el-table-column label="海报">
                        <template slot-scope="{row}">
                            <img style="width: 194px;height: 104px;" :src="row.posterUrl">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row}">
                            <el-button size="small">排序</el-button>
                            <el-button size="small" type="warning">编辑</el-button>
                            <el-button size="small" type="danger" @click="deletePoster(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination :currentPage="currentPage" :page-sizes="[5, 10, 15, 20]"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="totalCount"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           style="text-align: right;"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';
    import {requestBaseUrl} from '../../../../../js/config/serviceConfig';

    export default {
        name: "UploadPosters",
        data() {
            return {
                isUseds: [
                    {
                        label: "启用",
                        value: true
                    }, {
                        label: "不启用",
                        value: false
                    }
                ],//是否启用
                classifyListData: [],

                //添加
                addIsUsed: '',//是否启用
                addTitle: '',//分类名称

                //编辑
                editId: '',//分类id
                editIsUsed: '',//是否启用
                editTitle: '',//分类名称

                //添加海报
                categoryId: '',//分类id
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                imageUrl: '',//海报的url
                posterList: [],//海报列表
                currentPage: 1,//当前页
                pageSize: 10,//每页数量
                totalCount: 0,//总数量

            }
        },
        created() {
            this.getClassifyList();//获取分类列表
            this.getPosters();//获取海报列表
        },
        mounted() {
            this.$nextTick(function () {
                this.drag();
            });
        },
        methods: {
            //获取分类列表
            getClassifyList() {
                this.$request.get('/api/admin/activity/poster/category/list', {}).then(res => {
                    this.classifyListData = res.data;
                })
            },
            //添加分类
            addClassify() {
                this.$request.post('/api/admin/activity/poster/category/add', {
                    isUsed: this.addIsUsed,
                    seq: this.classifyListData.length,
                    title: this.addTitle
                }).then(res => {
                    if (res.success) {
                        this.$message.success("添加分类成功");
                        this.getClassifyList();
                        this.addIsUsed = '';
                        this.addTitle = '';
                    }
                })
            },
            //编辑分类
            editClassify(item) {
                this.editId = item.id;
                this.editIsUsed = item.isUsed;
                this.editTitle = item.title;
            },
            updateClassify() {
                this.$request.put('/api/admin/activity/poster/category/update', {
                    categoryId: this.editId,
                    isUsed: this.editIsUsed,
                    title: this.editTitle
                }).then(res => {
                    if (res.success) {
                        this.$message.success("修改成功");
                        this.getClassifyList();
                        this.editId = '';
                        this.editIsUsed = '';
                        this.editTitle = '';
                    }
                })
            },
            //删除分类
            deleteClassify(id) {
                this.$request.delete('/api/admin/activity/poster/category/delete', {params: {id: id}}).then(res => {
                    if (res.success) {
                        this.$message.success("删除分类成功");
                        this.getClassifyList();
                    }
                })
            },
            //分类排序
            drag() {
                let table = document.querySelector('.el-table__body-wrapper tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.classifyListData));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue, true);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue, true);
                        }
                    }
                });
            },
            sortFields(fieldList, refresh) {
                if (!fieldList) {
                    fieldList = this.classifyListData;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                this.$request.post('/api/admin/activity/poster/category/order', null, {
                    params: {idList: orderList}
                }).then(data => {
                    if (data.success) {
                        if (refresh) {
                            this.$message.success("修改顺序成功");
                            this.classifyListData = [];
                            setTimeout(() => {
                                this.getClassifyList();
                            }, 1);
                        }
                    }
                })
            },

            //获取海报列表
            getPosters() {
                this.$request.get('/api/admin/activity/poster/getPosterByCondition', {
                    params: {
                        limit: this.pageSize,
                        offset: (this.currentPage - 1) * this.pageSize,
                    }
                }).then(res => {
                    this.posterList = res.data.list;
                    this.totalCount = res.data.total;
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getPosters();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getPosters();
            },
            //获取上传海报的url
            getUrl(res, file) {
                this.imageUrl = file.response.data;
            },
            changeEvent(){
            },
            //添加海报
            addPosters() {
                this.$request.post('/api/admin/activity/poster/add', {
                    categoryId: this.categoryId,
                    posterUrl: this.imageUrl,
                    seq: this.totalCount
                }).then(res => {
                    if (res.success) {
                        this.$message.success("添加海报成功");
                        this.getPosters();
                        this.imageUrl = '';
                        this.categoryId = '';
                    }
                })
            },
            //删除海报
            deletePoster(id) {
                this.$request.delete('/api/admin/activity/poster/delete', {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.success) {
                        this.$message.success("删除成功");
                        this.getPosters();
                    }
                })
            },


        }
    }
</script>

<style scoped>
</style>
