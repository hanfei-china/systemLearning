<template>
    <div class="absolute-fill-parent">
        <vue-scroll>
            <div class="absolute-fill-parent flex flex-column flex-center">
                <div class="flex">
                    <div class="cursor-pointer" style="font-size: 12px;color: #409EFF;" @click="backPage">
                        全部 <span style="display: inline-block;padding: 0 3px;"> > </span>
                    </div>
                    <div v-for="(item, index) in headerGroupList" :key="item.id">
                        <el-dropdown trigger="click" @command="handleCommand">
                            <span class="el-dropdown-link" @click="headerGroupChange(item.id)">{{item.name}}</span>
                            <el-dropdown-menu slot="dropdown" v-if="groupList && groupList.length > 0">
                                <el-dropdown-item v-for="group in groupList" :key="group.id" :command="group">
                                    {{group.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span style="display: inline-block;padding: 0 3px;" v-if="!(index === headerGroupList.length - 1)"> > </span>
                    </div>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "AlbumGroupHeader",
        props: ["groupId"],
        data() {
            return {
                groupList: [],
                headerGroupList: [],
                copyGroupId: this.groupId
            }
        },
        created() {
            this.getGroupInfo();
            this.getGroupList(this.copyGroupId);
        },
        watch: {
            copyGroupId: function () {
                this.getGroupInfo();
            },
            headerGroupList: function () {
                for (let item of this.headerGroupList) {
                    this.$set(item, 'showSelect', false)
                }
            }
        },
        methods: {
            getGroupInfo() {
                this.$request.get('/api/common/group/anon/getGroup', {
                    params: {
                        id: this.copyGroupId,
                        operate: 0,
                        type: 2
                    }
                }).then(res => {
                    this.headerGroupList.push(res.data[0]);
                })
            },
            headerGroupChange(id) {
                this.getGroupList(id);
                this.$emit('changeGroupId',id);
            },
            getGroupList(id) {
                for (let i = 0; i < this.headerGroupList.length; i++) {
                    if (this.headerGroupList[i].id === id) {
                        this.headerGroupList.splice(i + 1,this.headerGroupList.length - 1 - i);
                    }
                }

                this.$request.get('/api/common/group/anon/getGroup', {
                    params: {
                        id: id,
                        operate: 1,
                        type: 2
                    }
                }).then(res => {
                    this.groupList = res.data[0].children;
                })
            },
            handleCommand(command) {
                this.headerGroupList.push(command);
                this.$emit('changeGroupId',command.id);
            },
            backPage(){
                this.$router.push({ name: "academyList"})
            }
        }
    }
</script>

<style scoped>

</style>