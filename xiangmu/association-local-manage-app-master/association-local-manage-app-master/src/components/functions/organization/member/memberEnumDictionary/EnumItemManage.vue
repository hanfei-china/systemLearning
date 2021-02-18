<template>
    <el-container style="background-color: #ffffff;padding: 16px;z-index: 3000;" class="absolute-fill-parent" v-if="visible">
        <el-header height="auto" class="unset-padding border-bottom">
            <div style="padding-bottom: 16px;font-size: 14px;">
                <el-button size="small" class="unset-padding" type="text" @click="$emit('update:visible',false)"
                           icon="el-icon-d-arrow-left" style="font-size: 14px;padding-right: 5px;" />
                <span>枚举项管理（{{dictionary.title}}）</span>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <div class="flex" style="height: 100%;">
                <div class="flex-fill-in-the-remaining-space enum-dictionary-label flex flex-column" v-for="(item,index) in labelList" :key="index">
                    <div class="enum-dictionary-label-head flex">
                        <span style="padding-right: 12px;">{{index+1}}级</span>
                        <!-- :disabled="labelList.length==1" -->
                        <el-input  size="small" class="flex-fill-in-the-remaining-space" v-model="item.name" placeholder="请输入标题"
                                  @focus="saveLabelName(index)" @blur="editLabelName(index)" />
                        <el-button type="text" style="padding-left: 12px !important;" class="unset-padding" @click="openAddNodesDialog(index,item)">添加</el-button>
                    </div>

                    <div class="flex-fill-in-the-remaining-space position-relative">
                        <div class="absolute-fill-parent">
                            <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                                <!-- 一级菜单 -->
                                <div class="enum-dictionary-nodes" v-if="index == 0">
                                    <div class="enum-dictionary-node flex position-relative" v-for="(enumItem,enumIndex) in enumList" :key="enumIndex" :class="{active:firstActiveIndex==enumIndex}" @click="setFirstActiveIndex(enumIndex)">
                                        <span class="flex-fill-in-the-remaining-space">{{enumItem.enumName}}</span>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-edit" type="text" @click="editEnum1(enumItem,enumIndex)"></el-button>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-delete" type="text" @click="deleteNode(enumItem)"></el-button>
                                        <el-input ref="inp0" class="enum-dictionary-node-edit-input" v-show="firstEditIndex==enumIndex" v-model="editEnumVal" @blur="editNode1(enumItem)"></el-input>
                                    </div>
                                </div>
                                <!-- 二级菜单 -->
                                <div class="enum-dictionary-nodes" v-if="index==1 && enumList[firstActiveIndex]">
                                    <div class="enum-dictionary-node flex position-relative" v-for="(enumItem,enumIndex) in enumList[firstActiveIndex].subLayer" :key="enumIndex"
                                         :class="{active:secondActiveIndex==enumIndex}"
                                         @click="setSecondActiveIndex(enumIndex)">
                                        <span class="flex-fill-in-the-remaining-space">{{enumItem.enumName}}</span>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-edit" type="text" @click="editEnum2(enumItem,enumIndex)"></el-button>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-delete" type="text" @click="deleteNode(enumItem)"></el-button>
                                        <el-input ref="inp1" class="enum-dictionary-node-edit-input" v-show="secondEditIndex==enumIndex" v-model="editEnumVal" @blur="editNode2(enumItem)" ></el-input>
                                    </div>
                                </div>
                                <!-- 三级菜单 -->
                                <div class="enum-dictionary-nodes" v-if="index==2&&enumList[firstActiveIndex]&&enumList[firstActiveIndex].subLayer[secondActiveIndex]">
                                    <div class="enum-dictionary-node flex position-relative" v-for="(enumItem,enumIndex) in enumList[firstActiveIndex].subLayer[secondActiveIndex].subLayer"
                                         :key="enumIndex" :class="{active:thirdActiveIndex==enumIndex}"
                                         @click="setThirdActiveIndex(enumIndex)">
                                        <span class="flex-fill-in-the-remaining-space">{{enumItem.enumName}}</span>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-edit" type="text" @click="editEnum3(enumItem,enumIndex)"></el-button>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-delete" type="text" @click="deleteNode(enumItem)"></el-button>
                                        <el-input ref="inp2" class="enum-dictionary-node-edit-input" v-show="thirdEditIndex==enumIndex" v-model="editEnumVal" @blur="editNode3(enumItem)" ></el-input>
                                    </div>
                                </div>
                                <!-- 四级菜单 -->
                                <div class="enum-dictionary-nodes" v-if="index==3&&enumList[firstActiveIndex]&&enumList[firstActiveIndex].subLayer[secondActiveIndex]&&enumList[firstActiveIndex].subLayer[secondActiveIndex].subLayer[thirdActiveIndex]">
                                    <div class="enum-dictionary-node flex position-relative" v-for="(enumItem,enumIndex) in enumList[firstActiveIndex].subLayer[secondActiveIndex].subLayer[thirdActiveIndex].subLayer"
                                         :key="enumIndex" :class="{active:fourthActiveIndex==enumIndex}"
                                         @click="setFourthActiveIndex(enumIndex)">
                                        <span class="flex-fill-in-the-remaining-space">{{enumItem.enumName}}</span>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-edit" type="text" @click="editEnum4(enumItem,enumIndex)"></el-button>
                                        <el-button class="enum-dictionary-node-handle" icon="el-icon-delete" type="text" @click="deleteNode(enumItem)"></el-button>
                                        <el-input ref="inp3" class="enum-dictionary-node-edit-input" v-show="fourthEditIndex==enumIndex" v-model="editEnumVal" @blur="editNode4(enumItem)" ></el-input>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
        <el-dialog class="custom-el-dialog" append-to-body :close-on-click-modal="false" :visible.sync="dialogShow" title="添加节点"
                   width="800px">
            <enum-item-form v-if="dialogShow" @close="dialogShow = false" @add-nodes="addNodes"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import EnumItemForm from './EnumItemForm';

    export default {
        name: "EnumItemManage",
        components: {EnumItemForm},
        props:{
            visible: Boolean,
            dictionary: Object
        },
        data(){
            return {
                labelList: [],
                enumList:[],
                firstEditIndex:-1,
                firstActiveIndex:0,
                secondEditIndex:-1,
                secondActiveIndex:0,
                thirdEditIndex:-1,
                thirdActiveIndex:0,
                fourthEditIndex:-1,
                fourthActiveIndex:0,
                tempLabelVal: '',
                dialogShow: false,
                addLevelIndex: 0,
                nameStr: '',
                editEnumVal:''
            }
        },
        methods:{
            getLabels(){
                this.$request.get('/api/admin/associator/getLayerTitle',{
                    params: {enumId: this.dictionary.enumId}
                }).then(data=>{
                    if(data.data.length == 0){
                        this.labelList=[];
                        for (let i = 0; i < this.dictionary.layerCount; i++) {
                            this.labelList.push(
                                {
                                    layer:i+1,
                                    name: '',
                                    topId:this.dictionary.enumId
                                });
                        }
                    }else{
                        let labelList = [];
                        let arr = data.data
                        arr.map((item) => {
                            item.name = item.title;
                        });

                        for (let i = arr.length; i < this.dictionary.layerCount; i++) {
                            labelList.push({
                                layer:i+1,
                                name: '',
                                topId:this.dictionary.enumId
                            })
                        }
                        this.labelList= arr.concat(labelList);
                    }
                })
            },
            getNodes(callback){
                this.$request.get('/api/admin/associator/getEnumNodes',{
                    params: {enumId: this.dictionary.enumId}
                }).then(data=>{
                    if(data.success){
                        this.enumList=data.data;
                        callback && callback();
                    }
                })
            },
            saveLabelName(index){
                this.tempLabelVal=this.labelList[index].name;
            },
            editLabelName(index){
                if(!this.tempLabelVal && this.labelList[index].name!=""){
                    this.$request.post('/api/admin/associator/addLayerTitle',{
                        enumId: this.dictionary.enumId,
                        layer: index+1,
                        title: this.labelList[index].name
                    }).then(data=>{
                        if(data.success){
                            this.$message.success("添加标题成功");
                        }
                    })
                }else if(this.tempLabelVal && this.labelList[index].name==""){
                    this.labelList[index].name=this.tempLabelVal;
                }else{
                    this.$request.put('/api/admin/associator/updateLayerTitle',{
                        enumId: this.dictionary.enumId,
                        layer: index+1,
                        title: this.labelList[index].name
                    }).then(data=>{
                        if(data.success){
                            this.$message.success("修改标题成功");
                        }
                    })
                }
            },
            openAddNodesDialog(index,item){
                if(item.name==""){
                    this.$message.warning('请先输入标题');
                    return;
                }
                if(index==1&&!this.enumList[this.firstActiveIndex]){
                    this.$message.warning('请先选择父级菜单');
                    return;
                }else if(index==2&&!this.enumList[this.firstActiveIndex].subLayer[this.secondActiveIndex]){
                    this.$message.warning('请先选择父级菜单');
                    return;
                }else if(index==3&&!this.enumList[this.firstActiveIndex].subLayer[this.secondActiveIndex]){
                    this.$message.warning('请先选择父级菜单');
                    return;
                }else if(index==4&&!this.enumList[this.firstActiveIndex].subLayer[this.secondActiveIndex].subLayer[this.thirdActiveIndex]){
                    this.$message.warning('请先选择父级菜单');
                    return;
                }
                this.addLevelIndex=index+1;
                this.nameStr= '';
                this.dialogShow=true;
            },
            addNodes(nodes){
                let parentId = '0';
                if(this.addLevelIndex==1){
                    parentId="0"
                }else if(this.addLevelIndex==2){
                    parentId=this.enumList[this.firstActiveIndex].id;
                }else if(this.addLevelIndex==3){
                    parentId=this.enumList[this.firstActiveIndex].subLayer[this.secondActiveIndex].id;
                }else if(this.addLevelIndex==4){
                    parentId=this.enumList[this.firstActiveIndex].subLayer[this.secondActiveIndex].subLayer[this.thirdActiveIndex].id;
                }

                this.$request.post('/api/admin/associator/addEnumNodes',{
                    enumId: this.dictionary.enumId,
                    enumNameList: nodes,
                    layer: this.addLevelIndex,
                    parentId
                }).then(data=>{
                    if(data.success){
                        this.getNodes(()=>{
                            this.$message.success('节点添加成功');
                            this.dialogShow = false;
                        })
                    }
                });
            },
            setFirstActiveIndex(index){
                this.firstActiveIndex=index;
            },
            setSecondActiveIndex(index){
                this.secondActiveIndex=index;
            },
            setThirdActiveIndex(index){
                this.thirdActiveIndex=index;
            },
            setFourthActiveIndex(index){
                this.fourthActiveIndex=index;
            },
            editEnum1(enumItem,enumIndex){
                this.firstEditIndex=enumIndex;
                this.editEnumVal=enumItem.enumName;
                this.$nextTick(function () {
                    this.$refs.inp0[enumIndex].focus()
                })
            },
            editEnum2(enumItem,enumIndex){
                this.secondEditIndex=enumIndex;
                this.editEnumVal=enumItem.enumName;
                this.$nextTick(function () {
                    this.$refs.inp1[enumIndex].focus()
                })
            },
            editEnum3(enumItem,enumIndex){
                this.thirdEditIndex=enumIndex;
                this.editEnumVal=enumItem.enumName;
                this.$nextTick(function () {
                    this.$refs.inp2[enumIndex].focus()
                })
            },
            editEnum4(enumItem,enumIndex){
                this.fourthEditIndex=enumIndex;
                this.editEnumVal=enumItem.enumName;
                this.$nextTick(function () {
                    this.$refs.inp3[enumIndex].focus()
                })
            },
            editNode1(item){
                this.firstEditIndex=-1;
                this.init(item);
            },
            editNode2(item){
                this.secondEditIndex=-1;
                this.init(item);
            },
            editNode3(item){
                this.thirdEditIndex=-1;
                this.init(item);
            },
            editNode4(item){
                this.fourthEditIndex=-1;
                this.init(item);
            },
            init(item){
                this.$request.put('/api/admin/associator/updateEnumNode',{
                    enumName: this.editEnumVal,
                    id: item.id
                }).then(data => {
                    if(data.success){
                        this.getNodes(()=>{
                            this.$message.success("修改成功");
                        });
                    }
                });
            },
            deleteNode(item){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/associator/deleteEnumNode',{
                        params:{id:item.id}
                    }).then((data)=>{
                        if(data.success){
                            this.getNodes(()=>{
                                this.$message.success("删除成功");
                            })
                        }
                    })
                }).catch(()=>{});
            },
        },
        created() {
            this.getLabels();
            this.getNodes();
        }
    }
</script>
