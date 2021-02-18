<template>
    <el-container class="absolute-fill-parent">
        <el-header style="padding-top: 14px;">
            <el-input prefix-icon="el-icon-search" size="small" placeholder="搜索" clearable
                      v-model="searchVal"></el-input>
        </el-header>
        <el-main class="position-relative unset-padding">
            <vue-scroll @handle-scroll="loadUserInfos">
                <div class="user-box cursor-pointer flex position-relative"
                     :class="{active:item.userId === tabIndex}"
                     v-for="item in userListSearch" :key="item.userId"
                     @click="checkedUser(item)">
                    <div style="padding: 15px;">
                        <el-avatar v-if="item.headImg" :src="item.headImg"></el-avatar>
                        <el-avatar v-else :src="defaultImg"></el-avatar>
                    </div>
                    <div class="flex-fill-in-the-remaining-space" style="padding: 10px 0;">
                        <p style="font-size: 16px;color: #333333;line-height: 26px;">
                            {{item.name | formatNull}}
                        </p>
                        <p style="font-size: 12px;color: #999999;line-height: 24px;">
                            {{item.newTime | yyyyMMddHHmm}}</p>
                    </div>
                    <i v-if="item.noReadCount" class="unread">{{item.noReadCount}}</i>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "UserList",
        props: ["queryClassId"],
        data() {
            return {
                defaultImg: require('../../../../../assets/default.jpg'),
                categoryId: '',//分类id
                searchVal: '',//搜索框的初始值
                userLimit: 20,//查询条数
                userOffset: 0,//偏移量
                userTotal: 0,
                userList: [],//用户列表
                userListSearch: [],//搜索的列表
                tabIndex: 0,//选中的user的index
            }
        },
        filters: {
            formatNull(val) {
                if (val) {
                    return val;
                } else {
                    return '-'
                }
            }
        },
        created(){
            if(this.queryClassId){
                this.categoryId = this.queryClassId;
                this.getUserList();
            }
        },
        watch: {
            queryClassId(val) {
                this.userList = [];
                this.userListSearch = [];
                this.categoryId = val;
                this.getUserList();
            },
            searchVal() {
                this.searchUser();
            },
            userListSearch(val) {
                this.$emit("searchList", val)
            }
        },
        methods: {
            //搜索
            searchUser() {
                this.$emit("search", true);
                this.userListSearch = [];
                if (this.searchVal && this.searchVal !== '') {
                    for(let i=0;i<this.userList.length;i++){
                        if(this.userList[i].name && this.userList[i].name!==''){
                            if(this.userList[i].name.indexOf(this.searchVal) > -1){
                                this.userListSearch.push(this.userList[i])
                            }
                        }
                    }
                } else {
                    this.userListSearch = this.userList;
                    this.$emit("search", false);
                }
            },
            //选中用户
            checkedUser(item) {
                this.$emit('checkedUser', item);
                this.$set(item, 'noReadCount', 0);
                this.tabIndex = item.userId;
            },
            //获取用户列表
            getUserList() {
                this.tabIndex = 0;
                if (this.categoryId) {
                    this.$request.get('/api/admin/counsel/message/getCounselUserQuestions', {
                        params: {
                            categoryId: this.categoryId,
                            limit: this.userLimit,
                            offset: this.userOffset
                        }
                    }).then(res => {
                        if (res.success) {
                            this.userList = this.userList.concat(res.data.list);
                            this.userTotal = res.data.total;
                            this.userListSearch = this.userList;
                        }
                    })
                }
            },
            //加载获取的用户列表
            loadUserInfos(vertical, horizontal, nativeEvent) {
                let {scrollTop} = vertical;
                let scrollHeight = nativeEvent.target.scrollHeight;
                let clientHeight = nativeEvent.target.clientHeight;
                if (this.userLimit + this.userOffset < this.userTotal && scrollTop === scrollHeight - clientHeight) {
                    this.userOffset += this.userLimit;
                    this.getUserList();
                }
            },
        }
    }
</script>