<template>
    <el-container>
        <el-main class="unset-padding">
            <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                <el-form size="small" label-width="120px">
                    <el-form-item v-if="groupInfo.isFolder && groupInfo.groupType !== 2">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                文件夹名称：
                            </div>
                        </template>
                        <el-input v-model="groupInfo.name" :placeholder="`请输入文件夹名称，100字以内`" :maxlength="100"/>
                    </el-form-item>
                    <el-form-item v-if="!groupInfo.isFolder && groupInfo.groupType !== 2 && groupInfo.groupType !== 3">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                分组名称：
                            </div>
                        </template>
                        <el-input v-model="groupInfo.name" :placeholder="`请输入分组名称，100字以内`" :maxlength="100"/>
                    </el-form-item>
                    <el-form-item>
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                上级分组：
                            </div>
                        </template>
                        <common-group-tree v-model="groupInfo.parentId"
                                           :group-type="groupInfoType" :is-folder="isFolder"
                                           :group-nodes="optionsData.originalGroups" :filter-node-id="id"/>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{id ? '确认修改' : '确认添加'}}</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>

    import CommonGroupTree from "./CommonGroupTree";
    export default {
        name: "CommonGroupForm",
        components: {CommonGroupTree},
        props: {
            groupType: String,
            id: {
                type: String,
                default: null
            },
            parentId: {
                type: String,
                default: null
            },
            seq: {
                type: Number,
                default: 0
            },
            describable: {
                type: Boolean,
                default: false
            },
            isFolder: Boolean,
            groupInfoType: Number,
            optionsData: {
                type: Object,
                default(){
                    return {
                        originalGroups:[]
                    }
                }
            }
        },
        data() {
            return {
                groupInfo: {
                    name: '',
                    parentId: this.parentId,
                    seq: this.seq,
                    type: this.groupType,
                    descriptions: '',
                    isFolder: this.isFolder,//是否创建文件夹
                    groupType: this.groupInfoType,//分组类型
                },
            }
        },
        methods: {
            getGroupInfo() {
                if (this.id) {
                    this.$request.get('/api/admin/group/getGroup', {
                        params: {id: this.id, operate: 0, type: this.groupType}
                    }).then(resp => {
                        let data = resp.data[0];
                        this.groupInfo.name = data.name;
                        this.groupInfo.parentId = data.parentId;
                        this.groupInfo.seq = data.seq;
                        this.groupInfo.descriptions = data.descriptions;
                        this.groupInfo.isFolder = data.isFolder;
                        this.groupInfo.groupType = data.groupType;
                    })
                }
            },
            checkData() {
                return new Promise((resolve, reject) => {
                    if (!this.groupInfo.name) {
                        reject(new Error(`请输入分组名称`));
                        return;
                    }

                    resolve({...this.groupInfo});
                })
            },
            submitData() {
                this.checkData().then(params => {
                    if (this.id) {
                        params.id = this.id;
                        this.$request.put('/api/admin/group/updateGroup', params).then(() => {
                            this.emitParent();
                            this.$message.success(`分组信息修改成功`);
                        })
                    } else {
                        this.$request.post('/api/admin/group/addGroup', params).then(() => {
                            this.emitParent();
                            this.$message.success(`分组添加成功`);
                        })

                    }
                }).catch(e => {
                    this.$message.warning(e.message);
                });
            },
            emitParent() {
                this.$emit('refresh');
                this.$emit('close');
            },
        },
        created() {
            this.getGroupInfo();
        },
    }
</script>
