<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有分组</div>
                <div class="flex flex-column flex-center">
                    <div>
                        <el-dropdown @command="handleCommand">
                            <el-button icon="el-icon-plus" type="text"
                                       class="custom-el-button unset-padding" size="small">
                                新增
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in createItems" :key="item.id" :command="item">
                                    <div>
                                        <i :class="item.icon" style="margin-right: 5px;line-height: 32px;"></i>
                                        <span>{{item.title}}</span>
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-loading="loading">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel : {scrollingX : true}, bar : {keepShow : true}}">
                    <div style="padding: 10px 0;">
                        <el-tree ref="tree" highlight-current :data="groupList"
                                 node-key="localId" :expand-on-click-node="false" :default-expanded-keys="defaultExpandedKeys"
                                 :draggable="false" :allow-drop="allowDrop" :allow-drag="allowDrag"
                                 @current-change="currentChange"  @node-drop="handleDrop">
                            <div class="flex flex-fill-in-the-remaining-space" slot-scope="{data}">
                                <i :class="data.icon"  style="margin-right: 5px;line-height: 19px;"></i>
                                <div class="flex-fill-in-the-remaining-space"
                                     @mouseover="setTreeNodeVisible(data,true)" @mouseout="setTreeNodeVisible(data,false)">
                                    {{ data.name }}
                                </div>
                                <div v-if="data.id !== '0' && !data.unRealEntity"  style="padding:0 10px;"
                                     :style="{display: treeNodeVisibleId === data.localId || chosenKey === data.localId ?'block':'none'}">
                                    <el-button type="text" class="custom-el-button unset-padding"
                                               size="small" icon="el-icon-edit" @click="editGroup(data.id, data.groupType)"/>
                                    <el-button style="margin-left: 6px;" type="text"
                                               @click="deleteGroup(data.id)"
                                               class="custom-el-button unset-padding danger" size="small"
                                               icon="el-icon-delete"/>
                                </div>
                            </div>
                        </el-tree>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body width="800px"
                   :close-on-click-modal="false">
            <member-group-form v-if="formVisible" :id="formId" @refresh="refreshList" :options-data="optionsData"
                        @close="formVisible = false" :type-name="typeName" :parent-id="formParentId" :seq="formSeq"
                        :groupType="groupType" :isFolder="isFolder" :groupInfoType="groupInfoType"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import MemberGroupForm from "./MemberGroupForm";
    import {treeFormingVirtualGroup,groupTypes,groupTypesForBranch} from "./js/memberGroupTools";
    export default {
        name: "MemberGroupList",
        components: {MemberGroupForm},
        props: {
            chosenGroup: Object,
            typeName: String,
            groupType: String,
            originalGroups: Array,
            virtualGroups: Array,
            conditionFields: Array,
            branches: Array,
            educationList: Array,
            collegeList: Array,
            majorList: Array,
        },
        model: {
            prop: 'chosenGroup',
            event: 'change',
        },
        computed: {
            allNode() {
                return [
                    {
                        id: this.rootId,
                        localId: this.rootId,
                        name: '所有会员',
                        parentId: null,
                        isFolder: true,
                        children: [],
                    }
                ]
            },
            branchId(){
                return this.$store.state.branchId;
            },
            createItems(){
                return this.branchId ? groupTypesForBranch : groupTypes;
            }
        },
        data() {
            return {
                rootId: '0',
                chosenKey: '0',

                groupList: [],

                formTitle: '',
                formVisible: false,
                formId: '',
                formParentId: null,
                formSeq: 0,

                nodeIds: [],

                loading: true,

                isFolder: null,//创建文件夹或分组

                groupInfoType: null,//创建的分组类型

                treeNodeVisibleId: '',

                resource: null,

                optionsData: {
                    enumFields: [],
                    conditionFields: [],
                    labels: [],
                    originalGroups:[]
                },
                defaultExpandedKeys:[]
            }
        },
        methods: {
            initCommonInfo(callback){
                Promise.all([
                    this.$request.get('/api/common/associator/getFieldsInfoByWeChat',{params:{topicTypes:[2,3,6,8]}}),
                    this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[0,2,5,6,13]}}),
                    this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params:{type:0}}),
                    this.$request.get('/api/common/branch/branchListAndBranchType'),
                ]).then(([fieldsRes,conditionFieldsRes,labelsRes,branchRes])=>{
                    let fields = fieldsRes.data;
                    let labels = labelsRes.data;
                    let branchList = branchRes.data;
                    this.$emit('update:branches',branchList);
                    let resource = {};
                    for(let field of fields){
                        let {id,topicType,parameter,code} = field;
                        if([2,3,6,8].indexOf(topicType) > -1){
                            this.optionsData.enumFields.push({...field});
                            resource[id] = {
                                code,
                                topicType,
                                parameter: JSON.parse(parameter)
                            }
                        }
                    }
                    var arr = conditionFieldsRes.data;
                    var newArr = [];
                    var educationList = this.educationList.map(item=>{
                        return {key:item,title:item}
                    })
                    var collegeList = this.collegeList.map(item=>{
                        return {key:item,title:item}
                    })
                    var majorList = this.majorList.map(item=>{
                        return {key:item,title:item}
                    })
                    for(var i=0;i<arr.length;i++){
                        if(arr[i].topicType==13){
                            for(var j=0;j<arr[i].detailList.length;j++){
                                let field =  arr[i].detailList[j]
                                if(field.code=="education"){
                                    field. parameter=JSON.stringify({ options: educationList })
                                }else if(field.code=="college"){
                                    field. parameter=JSON.stringify({ options: collegeList })
                                }else if(field.code=="major"){
                                    field. parameter=JSON.stringify({ options: majorList })
                                }
                                newArr.push(field)
                            }
                        }else{
                            newArr.push(arr[i])
                        }
                    }
                    this.optionsData.conditionFields=newArr.concat([{
                        code: 'status',
                        name: '激活状态',
                        topicType: 2,
                        parameter: JSON.stringify({
                            options: [
                                {key: '1', title: '已激活'},
                                {key: '0', title: '未激活'}
                            ]
                        }),
                    }]);


                    resource.labels = labels;

                    resource.branch = branchList;

                    this.resource = resource;

                    this.optionsData.labels = labels;

                    callback && callback();
                })
            },
            setTreeNodeVisible(data,isShow){
                if(data && isShow){
                    this.treeNodeVisibleId = data.localId;
                }else {
                    this.treeNodeVisibleId = '';
                }
            },
            allowDrop(draggingNode, dropNode, type) {
                if (dropNode.data.id === this.rootId) {
                    if (draggingNode.data.parentId === null || draggingNode.data.parentId === undefined) {
                        return type !== 'inner' && type !== 'prev';
                    } else {
                        return false;
                    }
                } else {
                    if (draggingNode.data.parentId === dropNode.data.parentId) {
                        return type !== 'inner';
                    } else {
                        return false;
                    }
                }
            },
            allowDrag(draggingNode) {
                return draggingNode.data.id !== this.rootId;
            },
            handleDrop() {
                if (this.nodeIds && this.nodeIds.length === 0) {
                    this.getNodeId(this.groupList);
                } else {
                    this.nodeIds = [];
                    this.getNodeId(this.groupList);
                }

                this.$request.post('/api/admin/group/orderGroup', null, {params: {ids: this.nodeIds}}).then(res => {
                    if (res.success) {
                        this.getGroupList()
                    }
                })
            },
            getNodeId(list) {
                for (let item of list) {
                    this.nodeIds.push(item.id);
                    if (item.children && item.children.length > 0) {
                        this.getNodeId(item.children);
                    }
                }
            },

            getGroupList(sortable) {
                this.loading = true;
                this.$request.get('/api/admin/group/getMemberGroup').then(res => {
                    this.optionsData.originalGroups = res.data;
                    let groupList = treeFormingVirtualGroup(this.allNode.concat(res.data),this.resource);
                    let defaultExpandedKeys = [];
                    for(let group of groupList){
                        defaultExpandedKeys.push(group.localId);
                    }
                    this.defaultExpandedKeys = defaultExpandedKeys;
                    this.groupList = groupList;
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(this.rootId);
                        this.$nextTick(()=>{ this.loading = false; })
                    });
                });
                if (sortable) {
                    this.handleDrop();
                }
            },
            refreshList() {
                this.getGroupList(true);
            },

            //新建分组或文件夹
            handleCreate(val){
                if (this.groupInfoType === -1) {
                    this.isFolder = true;
                    this.formTitle = '新增文件夹';
                } else {
                    this.isFolder = false;
                    this.formTitle = `新增${val.title}`;
                }
                this.formId = '';
                this.formVisible = true;
            },
            handleCommand(val) {
                this.groupInfoType = val.id;
                this.handleCreate(val);
            },
            editGroup(formId,groupType) {
                let groupTypeName = null;
                if(groupType === 0){
                    groupTypeName = '静态分组'
                }else if(groupType === 1){
                    groupTypeName = '条件分组'
                }else if(groupType === 2){
                    groupTypeName = '枚举分组'
                }else if(groupType === 3){
                    groupTypeName = '标签分组'
                }else if(groupType === 4){
                    groupTypeName = '分会分组'
                }else{
                    groupTypeName = '文件夹'
                }
                this.formTitle = `编辑${this.typeName}信息-${groupTypeName}`;
                this.formId = formId;
                this.formParentId = '';
                this.formVisible = true;
            },
            deleteGroup(formId) {
                this.$confirm(`此操作将永久删除该${this.typeName}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/group/deleteGroup', {
                        params: {
                            id: formId
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getGroupList(true);
                        }
                    })
                });
            },
            currentChange(data) {
                let {id,rootId} = data;
                this.chosenKey = data.localId;

                let _id = rootId || id;

                this.formParentId = _id === this.rootId ? null : _id;

                this.$emit('change', data);
            }
        },
        created() {
            this.initCommonInfo(()=>{
                this.getGroupList();
            });
        },
        watch:{
            'optionsData.originalGroups'(val){
                this.$emit('update:originalGroups',val);
            },
            'optionsData.conditionFields'(val){
                this.$emit('update:conditionFields',val);
            },
            groupList(val){
                this.$emit('update:virtualGroups',val);
            },
        }
    }
</script>
