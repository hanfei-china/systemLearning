<template>
    <el-container class="absolute-fill-parent background-color-white onlineCounsel">
        <el-header class="unset-padding" style="height: 48px;line-height: 48px;" v-if="!routeClassId">
            <scroll-tab>
                <scroll-tab-item v-for="item in classList" :key="item.id"
                                 :class="{active:categoryId === item.id}"
                                 @click="setCategoryId(item.id)">
                            <span>
                                <i v-if="!item.isUsed" class="iconfont icon-suo"></i>{{item.title}}
                            </span>
                </scroll-tab-item>
            </scroll-tab>
        </el-header>
        <el-main class="position-relative" v-show="userListSearch && userListSearch.length!==0 || searching">
            <el-container class="absolute-fill-parent">
                <el-aside class="border-right userCont position-relative">
                    <user-list :queryClassId="queryClassId" @searchList="searchList" @search="search" @checkedUser="checkedUser"></user-list>
                </el-aside>
                <el-main class="unset-padding userChat position-relative" v-show="chatCont">
                    <message-list :checkedUserInfo="checkedUserInfo"></message-list>
                </el-main>
            </el-container>
        </el-main>
        <el-main v-show="!(userListSearch && userListSearch.length!==0 || searching)" class="position-relative">
            <div class="position-absolute nodata_image">
                <img src="../../../../../assets/nodata.png" style="width: 100%;height: 100%;">
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import ScrollTab from '../../../../util/scrollTab/ScrollTab';
    import ScrollTabItem from '../../../../util/scrollTab/ScrollTabItem';
    import UserList from "./UserList";
    import MessageList from "./MessageList"

    export default {
        name: "ListManage",
        components: {UserList, MessageList, ScrollTab, ScrollTabItem},
        data() {
            return {
                classList: [],//分类列表
                userListSearch: [],//搜索的用户列表
                searching: false,
                categoryId: '',//分类id
                checkedUserInfo: {},//选中的用户
                chatCont: false,//右侧聊天默认不显示
            }
        },
        mounted() {
            this.getClassList();
        },
        computed: {
            routeClassId() {
                return this.$route.params.formId;
            },
            queryClassId() {
                return this.routeClassId || this.categoryId;
            }
        },
        watch: {
            checkedUserInfo(val){
                if(val){
                    this.chatCont = true;
                }
            }
        },
        methods: {
            //获取分类列表
            getClassList() {
                this.$request.get('/api/admin/counsel/messageCategory/getCounselMessageCategories').then(res => {
                    if (res.success) {
                        this.classList = res.data.list;
                        this.categoryId = this.classList[0].id;
                    }
                })
            },
            setCategoryId(id) {
                this.categoryId = id;
                this.chatCont = false;
            },
            //搜索的列表
            searchList(val){
                this.userListSearch = val;
            },
            search(val){
                this.searching = val;
            },
            checkedUser(item){
                this.checkedUserInfo = item;
                this.chatCont = true;
            },
        }
    }
</script>