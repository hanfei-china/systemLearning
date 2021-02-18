<template>
    <div>
        <div style="padding: 5px 0;">
            <el-tag v-for="(item,index) of showLabels" :key="index" :color="item.color"
                    closable style="margin: 5px 5px 0 0;color: #ffffff;border: none;" @close="deleteTag(item)">
                {{item.title}}
            </el-tag>
        </div>
        <vue-scroll>
            <div style="height: 300px;">
                <div v-for="item of list" :key="item.id">
                    <div style="margin: 5px 0;">
                            <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;margin-right: 5px;"
                                  :style="{backgroundColor: item.color}"></span>
                        {{item.title}}
                    </div>
                    <div class="flex flex-wrap">
                        <el-tag v-for="label of item.labels" :key="label.id" class="cursor-pointer"
                                :color="label.isChoose?label.color:'#ffffff'" style="margin: 5px 5px 0 0;"
                                :style="{color:label.isChoose?'#ffffff':'#909399',border:label.isChoose?'none':'1px solid #909399'}"
                                @click="operateLabel(item.id,label.id,label.isMultiple,item.labels)">
                            {{label.title}}
                        </el-tag>
                    </div>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "LabelSetting",
        props: {
            value: Array
        },
        model:{
          prop: 'value',
          event:'change'
        },
        data(){
            return {
                copyValue: this.value,//
                list: [],//标签分组列表
                labelList: [],//只有标签的列表
                showLabels: [],//上边展示的选中的标签
            }
        },
        watch:{
            // showLabels() {
            //     this.$emit('show-labels',this.showLabels)
            // },
            copyValue(val) {
                this.$emit('change', val);
                this.showLabels = [];
                for(let labelGroup of this.list){
                    for(let label of labelGroup.labels){
                        label.isChoose = false;
                    }
                }
                for(let label of this.copyValue){
                    for(let item of this.labelList){
                        if(label.labelId === item.id){
                            this.showLabels.push(item)
                        }
                    }
                    this.dataContrast(label);
                }
                this.$emit('showLabels',this.showLabels)
            }
        },
        methods: {
            getList() {
                let params = {
                    type: 0
                };
                this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params: params}).then((resp) => {
                    this.list = resp.data;
                    for (let item of this.list) {
                        for (let label of item.labels) {
                            label.color = item.color;
                            label.isMultiple = item.isMultiple;
                            this.labelList.push(label);
                        }
                    }

                    if(this.copyValue){
                        for(let label of this.copyValue){
                            for(let item of this.labelList){
                                if(label.labelId === item.id){
                                    this.showLabels.push(item)
                                }
                            }
                            this.dataContrast(label);
                        }
                    }
                })
            },
            //添加或去掉标签
            operateLabel(groupId, labelId, isMultiple, labels) {
                if (isMultiple) {
                    if (this.copyValue && this.copyValue.length > 0) {
                        for (let i = 0; i < this.copyValue.length; i++) {
                            if (this.copyValue[i].groupId === groupId && this.copyValue[i].labelId === labelId) {
                                this.copyValue.splice(i,1);
                            }
                        }
                        this.copyValue.push({"groupId": groupId, "labelId": labelId});
                    } else {
                        let labelArr = [{"groupId": groupId, "labelId": labelId}];
                        this.copyValue = labelArr;
                    }
                } else {
                    if (this.copyValue && this.copyValue.length > 0) {
                        for (let item of labels) {
                            for (let i = 0; i < this.copyValue.length; i++) {
                                if (item.id === this.copyValue[i].labelId) {
                                    this.copyValue.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        this.copyValue.push({"groupId": groupId, "labelId": labelId});
                    } else {
                        let labelArr = [{"groupId": groupId, "labelId": labelId}];
                        this.copyValue = labelArr;
                    }
                }
            },
            //去掉标签
            deleteTag(item) {
                for(let i=0;i<this.copyValue.length;i++){
                    if(this.copyValue[i].labelId === item.id){
                        this.copyValue.splice(i, 1);
                    }
                }
            },
            //给标签列表的选中标签显示颜色
            dataContrast(showLabel){
                for(let labelGroup of this.list){
                    for(let label of labelGroup.labels){
                        if(showLabel.labelId === label.id){
                            label.isChoose = true;
                        }
                    }
                }
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style scoped>

</style>