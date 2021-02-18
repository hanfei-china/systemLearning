<template>
    <el-container class="psychology-course background-color-white absolute-fill-parent">
        <el-header class="unset-padding flex" style="height: 47px;line-height: 47px;">
            <div class="flex-fill-in-the-remaining-space">
                <scroll-tab>
                    <scroll-tab-item :class="{active:headerIndex === -1}"
                                     @click="getQuestionsById(userInfo,tabIndex)">
                        全部
                    </scroll-tab-item>
                    <scroll-tab-item v-for="(item,index) in counselCategories" :key="item.id"
                                     :class="{active:index === headerIndex}"
                                     @click="getQuestionsByClassify(item,index)">
                            <span>
                                <i v-if="!item.isUsed" class="iconfont icon-suo"></i>{{item.title}}
                            </span>
                    </scroll-tab-item>
                    <template v-slot:handle>
                        <div style="padding: 0 20px;">
                            <el-button type="warning" size="small" @click="classifyActive = true">分类管理</el-button>
                        </div>
                    </template>
                </scroll-tab>
            </div>
        </el-header>
        <el-main class="psy-container unset-padding"
                 v-if="(userListSearch && userListSearch.length!==0) || searching">
            <!-- 左侧用户列表 -->
            <div class="psy-userList position-relative border-right">
                <el-container class="absolute-fill-parent">
                    <el-header style="padding-top: 14px;">
                        <el-input prefix-icon="el-icon-search" placeholder="搜索" size="small" clearable
                                  v-model="searchVal"></el-input>
                    </el-header>
                    <el-main class="position-relative unset-padding">
                        <vue-scroll @handle-scroll="loadUserInfos">
                            <div class="user-box cursor-pointer flex position-relative"
                                 :class="{active:item.userId === tabIndex}"
                                 v-for="item in userListSearch" :key="item.id" @click="getQuestionsById(item)">
                                <div class="pic">
                                    <el-avatar v-if="item.headImg" :src='item.headImg'></el-avatar>
                                    <el-avatar v-else :src="defaultImg"></el-avatar>
                                </div>
                                <div class="userInfo flex-fill-in-the-remaining-space">
                                    <p style="font-size: 16px;color: #333333;line-height: 22px;">{{item.name |
                                        formatNull}}</p>
                                    <p style="font-size: 12px;color: #999999;margin-top: 2px;line-height: 24px;">
                                        {{item.updateTime | yyyyMMddHHmm}}</p>
                                </div>
                                <i class="unread position-absolute"
                                   v-if="item.neverReadCount">{{item.neverReadCount}}</i>
                            </div>
                        </vue-scroll>
                    </el-main>
                </el-container>
            </div>
            <!-- 中间用户消息 -->
            <div class="psy-userMsg position-relative border-right" v-if="chatCont === 1">
                <vue-scroll @handle-scroll="loadMsgInfos">
                    <div style="padding: 16px;">
                        <div class="userMsg position-relative cursor-pointer flex"
                             :class="{active: index === msgTabIndex}"
                             v-for="(item,index) in msgList" :key="item.id"
                             @click="getAllReplyByQuestionId(item,index)">
                            <div class="headImg">
                                <el-avatar v-if="item.headImg" :src="item.headImg"></el-avatar>
                                <el-avatar v-else :src="defaultImg"></el-avatar>
                            </div>
                            <div class="flex-fill-in-the-remaining-space msgInfo">
                                <div class="flex" style="margin-bottom: 13px;">
                                    <p class="flex-fill-in-the-remaining-space">
                                        <span style="line-height: 17px;color: #999999;margin-right: 12px;">{{item.name | formatNull}}</span>
                                        <i style="color: #FFFFFF;height: 20px;line-height: 20px;padding: 0 7px;background-color: #F85847;">{{item.categoryTitle
                                            | formatNull}}</i>
                                    </p>
                                    <p style="height: 24px;line-height: 24px;color: #7B8EA1;">{{item.updateTime |
                                        yyyyMMddHHmm}}</p>
                                </div>
                                <p class="msgTitle">{{item.content | formatNull}}</p>
                            </div>
                            <i class="unread position-absolute" v-if="item.neverReadCount">{{item.neverReadCount}}</i>
                        </div>
                    </div>
                </vue-scroll>
            </div>
            <!-- 右侧用户聊天 -->
            <div class="psy-userChat" v-if="chatCont === 1">
                <div class="psy-userChat-history">
                    <vue-scroll ref="vsScrollBottom">
                        <div v-for="item in replayList" :key="item.id">
                            <!--右边-->
                            <div v-if="item.isMyPartner" class="record flex flex-end">
                                <div class="contInfo text-align-right" style="margin-right: 17px;">
                                    <p>{{item.adminName | formatNull}}</p>
                                    <p>{{item.createTime | yyyyMMddHHmm}}</p>
                                    <pre class="cont rightCont">{{item.content | formatNull}}</pre>
                                </div>
                                <div>
                                    <el-avatar v-if="item.adminHeadImg" :src="item.adminHeadImg"></el-avatar>
                                    <el-avatar v-else :src="defaultImg"></el-avatar>
                                </div>
                            </div>
                            <!--左边-->
                            <div v-else class="record flex">
                                <div>
                                    <el-avatar v-if="item.headImg" :src="item.headImg"></el-avatar>
                                    <el-avatar v-else :src="defaultImg"></el-avatar>
                                </div>
                                <div class="contInfo" style="margin-left: 17px;">
                                    <p>{{item.name | formatNull}}</p>
                                    <p>{{item.createTime | yyyyMMddHHmm}}</p>
                                    <pre class="cont leftCont">{{item.content | formatNull}}</pre>
                                </div>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
                <div class="psy-userChat-import">
                        <textarea rows="3" class="chatMsg" placeholder="请在这里输入咨询内容(500字以内)" v-model="content"
                                  maxlength="500" @keydown.ctrl.enter="replyQuestion"></textarea>
                    <el-button class="send-btn" size="small" type="primary" @click="replyQuestion">发送 | Ctrl+Enter
                    </el-button>
                </div>
            </div>
        </el-main>
        <el-main class="psy-container position-relative" v-else>
            <div class="position-absolute nodata_image">
                <img src="../../../../assets/nodata.png" style="width: 100%;height: 100%;">
            </div>
        </el-main>
        <!--        分类管理         -->
        <el-dialog title="分类管理" :visible.sync="classifyActive" :close-on-click-modal="false" append-to-body
                   @open="init()" width="800px">
            <div class="text-align-right">
                <el-button size="small" icon="el-icon-plus" type="primary" plain @click="newCategories"
                           style="margin-bottom: 20px;">
                    添加分类
                </el-button>
            </div>
            <el-table size="small" :data="counselCategories" class="custom-el-table header-gray" height="400px" border
                      stripe
                      row-key="id">
                <el-table-column label="分类名称" align="center" prop="title" show-tooltip-when-overflow width="120px"/>
                <el-table-column label="描述" align="center" prop="description" show-tooltip-when-overflow/>
                <el-table-column prop="isUsed" label="是否启用" align="center" width="90px">
                    <template slot-scope="{row}">
                        <span v-if="row.isUsed">启用</span>
                        <span v-else>未启用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180px">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" class="custom-el-button unset-padding item-sort">排序
                        </el-button>
                        <el-button size="small" type="text" class="custom-el-button unset-padding" @click="toEdit(row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="text" class="custom-el-button unset-padding danger"
                                   @click="deleteCounselCategory(row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--        添加/编辑分类         -->
        <el-dialog v-if="activeCategories" :title="formTitle" :visible.sync="activeCategories"
                   :close-on-click-modal="false" append-to-body
                   width="400px">
            <categories-form :editInfo="updateForm" :seq="seq" @close="activeCategories = false"
                             @refresh="getCounselCategories(true)"></categories-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import categoriesForm from './util/categoriesForm';
    import ScrollTab from '../../../util/scrollTab/ScrollTab';
    import ScrollTabItem from '../../../util/scrollTab/ScrollTabItem';

    export default {
        components: {categoriesForm, ScrollTab, ScrollTabItem},
        filters: {
            formatNull(val) {
                if (val) {
                    return val;
                } else {
                    return '-'
                }
            }
        },
        data() {
            return {
                defaultImg: require('../../../../assets/default.jpg'),
                classifyActive: false,// 打开分类管理弹窗
                activeCategories: false,//打开添加或编辑分类弹窗
                counselCategories: [],//分类管理列表
                updateForm: {},//编辑分类的form表单
                formTitle: '',//新增或编辑分类弹窗的title
                seq: 0,//排序

                searchVal: '',//搜索框的初始值
                searching: false,

                usersList: [],//用户列表
                usersTotalCount: 0,//用户总数量
                userListSearch: [],//搜索后的用户列表
                userLimit: 30,//用户查询的初始值
                userOffset: 0,//用户查询的初始值
                userInfo: '',//当前选中的那一名用户
                chatCont: 0,//右侧聊天默认不显示

                msgList: [],//所有咨询列表
                msgLimit: 30,//用户查询的初始值
                msgOffset: 0,//用户查询的偏移量
                msgTotalCount: 0,//咨询列表的总数量
                responseInfo: '',//当前选中的那一条msg
                responseIndex: 0,//当前选中的那一条msg的索引
                replayList: [],//回复的消息列表
                content: '',//回复内容
                tabIndex: -1, //用户选项卡切换index
                msgTabIndex: 0,//msg部分选项卡切换
                classifyItem: '',//根据分类获取信息时的分类item
                classifyIndex: '',//...索引

                headerIndex: -1,//头部选项卡切换的index
            }
        },
        created() {
            // this.getCounselUserInfosByAdmin();//获取咨询用户信息
            this.getCounselCategories();//获取咨询分类
        },
        methods: {
            //搜索
            searchUser() {
                this.searching = true;
                this.userListSearch = [];
                if (this.searchVal) {
                    this.userListSearch = this.usersList.filter(item => item.name.indexOf(this.searchVal) > -1);
                } else {
                    this.userListSearch = this.usersList;
                    this.searching = false;
                }
            },
            //设置头部分类的index
            setHeaderIndex(index) {
                this.headerIndex = index;
            },

            //打开添加或修改咨询分类弹窗
            newCategories() {
                this.updateForm = '';
                this.formTitle = '新增分类';
                this.activeCategories = true;
            },
            toEdit(val) {
                this.updateForm = val;
                this.formTitle = '编辑分类';
                this.activeCategories = true;
            },
            //删除咨询分类
            deleteCounselCategory(val) {
                this.$confirm('确定删除该分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/counsel/category/deleteCounselCategory', {params: {categoryId: val}}).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getCounselCategories(true);
                        }
                    })
                }).catch(()=>{});
            },
            //获取咨询分类
            getCounselCategories(sort) {
                this.$request.get('/api/admin/counsel/category/getCounselCategories', {}).then(res => {
                    this.counselCategories = res.data;
                    this.seq = this.counselCategories.length;
                    if (sort) {
                        this.sortFields();
                    }
                    this.getCounselUserInfosByAdmin();
                });
            },

            //获取咨询用户信息
            getCounselUserInfosByAdmin() {
                this.$request.get('/api/admin/counsel/category/getCounselUserInfosByAdmin', {
                    params: {
                        limit: this.userLimit,
                        offset: this.userOffset
                    }
                }).then(
                    res => {
                        this.usersList = res.data.list;
                        this.usersTotalCount = res.data.total;
                        this.userListSearch = this.usersList;
                        /*if(this.userListSearch.length>0){
                            this.getQuestionsById(this.userListSearch[0],0);
                        }*/
                    }
                )
            },
            //加载获取的用户列表
            loadUserInfos(vertical, horizontal, nativeEvent) {
                let {scrollTop} = vertical;
                let scrollHeight = nativeEvent.target.scrollHeight;
                let clientHeight = nativeEvent.target.clientHeight;
                if (this.userLimit < this.usersTotalCount && scrollTop === scrollHeight - clientHeight) {
                    this.userLimit += 30;
                    this.getCounselUserInfosByAdmin();
                }
            },
            //获取某个用户的所有咨询
            getQuestionsById(val) {
                this.tabIndex = val.userId;
                this.userInfo = val;
                this.setHeaderIndex(-1);
                if (val) {
                    this.chatCont = 1;
                    this.$request.get('/api/admin/counsel/category/getQuestionsById', {
                        params: {
                            limit: this.msgLimit,
                            offset: this.msgOffset,
                            userId: val.userId,
                        }
                    }).then(res => {
                        if (res.success) {
                            this.msgTotalCount = res.data.total;
                            let list = res.data.list;
                            list.map(item => {
                                this.$set(item, 'userId', val.userId);
                                this.$set(item, 'headImg', val.headImg);
                                this.$set(item, 'name', val.name);
                            });
                            this.msgList = list;
                            if (this.msgList.length !== 0) {
                                this.getAllReplyByQuestionId(this.msgList[0], 0);
                            } else {
                                this.replayList = [];
                            }
                        }
                    })
                }
            },
            //获取某一用户的某一分类咨询
            getQuestionsByClassify(item, index) {
                this.classifyItem = item;
                this.classifyIndex = index;
                this.setHeaderIndex(index);
                if (this.userInfo) {
                    this.$request.get('/api/admin/counsel/category/getQuestionsById', {
                        params: {
                            categoryId: item.id,
                            limit: this.msgLimit,
                            offset: this.msgOffset,
                            userId: this.userInfo.userId,
                        }
                    }).then(res => {
                        if (res.success) {
                            this.msgTotalCount = res.data.total;
                            let list = res.data.list;
                            list.map(item => {
                                this.$set(item, 'userId', this.userInfo.userId);
                                this.$set(item, 'headImg', this.userInfo.headImg);
                                this.$set(item, 'name', this.userInfo.name);
                            });
                            this.msgList = list;
                            if (this.msgList.length !== 0) {
                                this.getAllReplyByQuestionId(this.msgList[0], 0);
                            } else {
                                this.replayList = [];
                            }
                        }
                    })
                }
            },
            //加载用户的咨询
            loadMsgInfos(vertical, horizontal, nativeEvent) {
                let {scrollTop} = vertical;
                let scrollHeight = nativeEvent.target.scrollHeight;
                let clientHeight = nativeEvent.target.clientHeight;
                if (this.msgLimit < this.msgTotalCount && scrollTop === scrollHeight - clientHeight) {
                    this.msgLimit += 30;
                    if (this.headerIndex == -1) {
                        this.getQuestionsById(this.userInfo, this.tabIndex);
                    } else {
                        this.getQuestionsByClassify(this.classifyItem, this.classifyIndex)
                    }
                }
            },
            //获取某个咨询下的所有回复
            getAllReplyByQuestionId(val, index) {
                let presentMsg = '';
                presentMsg = this.msgList.find((item, index1) => index1 == index);
                let presentUser = '';
                presentUser = this.usersList.find((item) => item == this.userInfo);

                let userNeverReadCount = presentUser.neverReadCount;
                if (presentMsg.neverReadCount !== 0) {
                    userNeverReadCount = Number(presentUser.neverReadCount) - Number(presentMsg.neverReadCount);
                }

                this.$set(presentUser, 'neverReadCount', userNeverReadCount);
                this.$set(presentMsg, 'neverReadCount', 0);

                this.msgTabIndex = index;
                this.$request.get('/api/admin/counsel/category/getAllReplyByQuestionId', {params: {questionId: val.id}}).then(
                    res => {
                        if (res.success) {
                            let list = res.data;
                            list.map(item => {
                                this.$set(item, 'userId', val.userId);
                                this.$set(item, 'headImg', val.headImg);
                                this.$set(item, 'name', val.name);
                            });
                            this.replayList = list;
                            this.responseInfo = val;
                            this.responseIndex = index;
                            this.scrollToBottom();
                        }
                    }
                )
            },
            //回复消息
            replyQuestion() {
                if (this.content == '') {
                    this.$message.warning('发送的内容不能为空');
                    return;
                } else {
                    this.$request.post('/api/admin/counsel/category/replyQuestion', {
                        content: this.content,
                        questionId: this.responseInfo.id
                    }).then(
                        res => {
                            if (res.success) {
                                this.content = '';
                                this.getAllReplyByQuestionId(this.responseInfo, this.responseIndex);
                            }
                        }
                    )
                }
            },

            //排序
            init() {
                this.$nextTick(function () {
                    this.drag();//拖拽排序
                })
            },
            drag() {
                let table = document.querySelector('.el-dialog__body .el-table__body-wrapper tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.counselCategories));

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
                    fieldList = this.counselCategories;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                if (orderList.length > 0) {
                    this.$request.post('/api/admin/counsel/category/counselCategoryOrder', null, {
                        params: {idList: orderList}
                    }).then(data => {
                        if (data.success) {
                            if (refresh) {
                                this.$message.success("修改顺序成功");
                                this.counselCategories = [];
                                setTimeout(() => {
                                    this.getCounselCategories();
                                }, 1);
                            }
                        }
                    })
                }

            },

            //聊天记录--滚动条处于最底部
            scrollToBottom() {
                this.$nextTick(() => {
                    this.$refs['vsScrollBottom'].scrollTo(
                        {
                            y: '100%'
                        },
                        0
                    );
                })
            },
        },
        watch: {
            searchVal() {
                this.searchUser();
            }
        }
    }
</script>
