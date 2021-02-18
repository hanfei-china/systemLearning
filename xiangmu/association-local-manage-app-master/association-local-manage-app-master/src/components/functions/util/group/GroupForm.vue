<template>
    <el-container>
        <el-main class="unset-padding">
            <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                <el-form size="small" label-width="120px">
                    <el-form-item v-if="groupInfo.isFolder && groupInfo.groupType !== 2">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                分组名称：
                            </div>
                        </template>
                        <el-input v-model="groupInfo.name" :placeholder="`请输入分组名称，多个以“，”隔开。1000字以内`" :maxlength="1000"/>
                    </el-form-item>
                    <el-form-item v-if="!groupInfo.isFolder && groupInfo.groupType !== 2 && groupInfo.groupType !== 3">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                {{typeName}}名称：
                            </div>
                        </template>
                        <el-input v-model="groupInfo.name" :placeholder="`请输入${typeName}名称，100字以内`" :maxlength="100"/>
                    </el-form-item>
                    <el-form-item>
                        <template v-slot:label>
                            <div class="custom-el-form-item-label">
                                上级{{typeName}}：
                            </div>
                        </template>
                        <group-tree :editable="editable" v-model="groupInfo.parentId" :disabled-nodes="disabledNodes" :is-multiple="false"
                                    :groupInfoType="groupInfo.groupType" :isFolder="groupInfo.isFolder"
                                    :group-type="groupType" :placeholder="`请选择上级${typeName}`" :max-level="maxLevel"/>
                    </el-form-item>
                    <el-form-item v-if="describable">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                {{typeName}}描述：
                            </div>
                        </template>
                        <el-input v-model="groupInfo.descriptions" type="textarea" :rows="8" resize="none"
                                  :placeholder="`请输入${typeName}描述，500字以内`" :maxlength="500"/>
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
    import GroupTree from "./GroupTree";

    export default {
        name: "GroupForm",
        components: {GroupTree},
        props: {
            groupType: String,
            groupList:Array,
            id: {
                type: String,
                default: null
            },
            parentId: {
                type: String,
                default: null
            },
            typeName: {
                type: String,
                required: true
            },
            seq: {
                type: Number,
                default: 0
            },
            maxLevel: {
                type: Number,
                default: null
            },
            describable: {
                type: Boolean,
                default: false
            },
            isFolder: Boolean,
            groupInfoType: Number
        },
        data() {
            return {
                groupInfo: {
                    name: '',
                    parentId: [this.parentId],
                    seq: this.seq,
                    type: this.groupType,
                    descriptions: '',
                    isFolder: this.isFolder,//是否创建文件夹
                    groupType: this.groupInfoType,//分组类型
                    labelGroupId: '',//标签分组
                },
                groupTypes: [
                    {
                        id: '0',
                        title: '静态分组'
                    },
                ],
                editable:true
            }
        },
        watch:{
          "groupInfo.parentId":{
            immediate:true,
            handler(val){
              if(!this.id){
                if(val[0]){
                  this.groupInfo.seq = this.getMax(val[0],this.groupList)
                }else{
                  var maxSeq =Math.max(...this.groupList.map(item=>item.seq))
                  this.groupInfo.seq = maxSeq+1
                }
              }
            }
          }
        },
        methods: {
          // 递归取得最大值
          getMax(id,list){
            for(var i=0;i<list.length;i++){
              if(list[i].id==id){
                var maxSeq =list[i].children.length>0?Math.max(...list[i].children.map(item=>item.seq)):0
                return maxSeq+1
              }else if(list[i].children.length>0){
                var max = this.getMax(id,list[i].children)
                if(max>0){
                  return max
                }
              }
            }
            return 0
          },
          // getMax(id,groupList){
          //   for (var i = 0; i < groupList.length; i++) {
          //     if (groupList[i].id == id) {
          //       return groupList[i].name;
          //     }
          //     var result = this.getMax(id, groupList[i].children);
          //     if (result) {
          //       return result;
          //     }
          //   }
          //   return null;
          // },
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
                        this.groupInfo.parentId = [data.parentId];
                        this.groupInfo.seq = data.seq;
                        this.groupInfo.descriptions = data.descriptions;
                        this.groupInfo.isFolder = data.isFolder;
                        this.groupInfo.groupType = data.groupType;
                        this.groupInfo.fieldId = data.objectId;
                        this.groupInfo.labelGroupId = data.objectId;
                        this.groupInfo.conditions = JSON.parse(data.conditions);
                        if(data.parentId){
                          this.editable = true
                        }else{
                          this.editable = false  //一级不让改到别的一级底下去
                        }
                    })
                }
            },
            checkData() {
                return new Promise((resolve, reject) => {
                    if (this.groupInfo.groupType !== 2 && this.groupInfo.groupType !== 3 && !this.groupInfo.name) {
                        reject(new Error(`请输入${this.typeName}名称`));
                        return;
                    }
                    if(!this.groupInfo.isFolder && !this.groupInfo.parentId[0]){
                        this.$message.warning('请选择分组的上一级');
                        return;
                    }
                    let groupInfo = {
                        name: this.groupInfo.groupType === 2 ? '' : this.groupInfo.name,
                        descriptions: this.groupInfo.descriptions,
                        isFolder: this.groupInfo.isFolder,
                        parentId: this.groupInfo.parentId[0],
                        seq: this.groupInfo.seq,
                        type: this.groupType,
                        groupType: this.groupInfo.isFolder ? '' : this.groupInfo.groupType,
                    };
                    resolve({...groupInfo});
                })
            },
            submitData() {
                this.checkData().then(params => {
                    if (this.id) {
                        params.id = this.id;
                        this.$request.put('/api/admin/group/updateGroup', params).then(() => {
                            this.emitParent();
                            this.$message.success(`${this.typeName}信息修改成功`);
                        })
                    } else {
                        this.$request.post('/api/admin/group/addGroup', params).then(() => {
                            this.emitParent();
                            this.$message.success(`${this.typeName}添加成功`);
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
