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
                        <member-group-tree v-model="groupInfo.parentId"
                                           :group-type="groupInfoType" :is-folder="isFolder"
                                           :group-nodes="optionsData.originalGroups" :filter-node-id="id"/>
                    </el-form-item>
                    <el-form-item v-if="groupInfo.groupType === 1">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                查询条件：
                            </div>
                        </template>
                        <div style="height: 240px;">
                            <vue-scroll>
                                <member-group-condition hidden-comparison-object :fields="optionsData.conditionFields" :item="groupInfo.conditions"/>
                            </vue-scroll>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="groupInfo.groupType === 2">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                枚举字段：
                            </div>
                        </template>
                        <enum-field-choose v-model="groupInfo.objectId" :field-list="optionsData.enumFields"/>
                    </el-form-item>
                    <el-form-item v-if="groupInfo.groupType === 3">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                标签字段：
                            </div>
                        </template>
                        <label-field-choose v-model="groupInfo.objectId" :label-list="optionsData.labels"/>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{id ? '确认修改' :
                    '确认添加'}}
                </el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import EnumFieldChoose from "./EnumFieldChoose";
    import LabelFieldChoose from "./LabelFieldChoose";
    import MemberGroupTree from "./MemberGroupTree";
    import MemberGroupCondition from "../../../tools/mpDesign/attributes/memberQueryBuilder/MemberGroupCondition";
    import GroupCondition from "../../../tools/mpDesign/attributes/memberQueryBuilder/js/groupCondtion";

    export default {
        name: "MemberGroupForm",
        components: {MemberGroupCondition, MemberGroupTree, LabelFieldChoose, EnumFieldChoose},
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
                        enumFields: [],
                        conditionFields: [],
                        labels: [],
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
                    objectId: '',//枚举分组传此字段   如果groupType为枚举分组，则上传次字段为会员字段的id,该字段的topicType必须为8.
                    conditions: new GroupCondition(null),//条件分组传此字段
                },
            }
        },
        methods: {
            disabledNodes(nodes) {
                this.filterNodes(nodes, this.id, false);
            },
            filterNodes(nodes, deleteId, disabled) {
                nodes.forEach((node, index) => {
                    let {children, id, memberNum} = node;
                    if (disabled) {
                        this.$set(nodes[index], "disabled", true);
                    } else {
                        if (deleteId === id || memberNum > 0) {
                            this.$set(nodes[index], "disabled", true);
                            this.filterNodes(children, deleteId, true);
                        } else {
                            this.filterNodes(children, deleteId, false);
                        }
                    }
                });
            },
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
                        this.groupInfo.objectId = data.objectId;
                        this.groupInfo.conditions = new GroupCondition(data.conditions);
                    })
                }
            },
            checkData() {
                return new Promise((resolve, reject) => {
                    if (this.groupInfo.groupType !== 2 && this.groupInfo.groupType !== 3 && !this.groupInfo.name) {
                        reject(new Error(`请输入分组名称`));
                        return;
                    }


                    let name = this.groupInfo.name;
                    let objectId = this.groupInfo.objectId;
                    let conditions = JSON.stringify(this.groupInfo.conditions);
                    if(this.groupInfo.groupType === 2 && objectId){
                        for(let field of this.optionsData.enumFields){
                            let {id,name:fieldName} = field;
                            if(id === objectId){
                                name = fieldName;
                                break;
                            }
                        }
                    }

                    if(this.groupInfo.groupType === 3 && objectId){
                        for(let field of this.optionsData.labels){
                            let {id,title:fieldName} = field;
                            if(id === objectId){
                                name = fieldName;
                                break;
                            }
                        }
                    }

                    resolve({...this.groupInfo,name,conditions});
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
