<template>
    <div class="member-field-simple-infobox">
        <div class="member-field-simple-infocus flex">
            <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                <span class="topic-index">{{index+1}}、</span>
                <span class="txt_show">{{data.name}}</span>
            </div>
            <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                <span class="type_txt">({{fieldType[data.topicType]}})</span>
            </div>
            <div class="member-field-simple-info-handle" style="padding-left: 16px;width:110px;">
                <el-button class="custom-el-button item-sort" type="text">排序</el-button>
                <el-button class="custom-el-button" type="text" @click="editField">修改</el-button>
                <el-button class="custom-el-button danger" type="text" @click="deleteField" v-if="!data.buildIn">删除</el-button>
            </div>
        </div>
        <div v-if="data.topicType==13">
            <div class="member-field-simple-infozuhe flex" v-for="(item,index) in data.detailList" :key="index">
                <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                    <span class="txt_show">{{item.name}}</span>
                </div>
                <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                    <span class="type_txt">({{fieldType[item.topicType]}})</span>
                </div>
                <div class="member-field-simple-info-handle" style="padding-left: 16px;">
                    <el-button class="custom-el-button" style="padding:7px 0;" type="text" @click="editComposeField(item)">修改</el-button>
                </div>
            </div>
        </div>

        <el-dialog title="编辑字段" :visible.sync="dialogShow" width="800px" append-to-body :close-on-click-modal="false">
            <member-field-form v-if="dialogShow" :data="transferData"  :table-name="tableName" :seq="data.seq"
                            @close="dialogShow = false" @created-fields="$emit('refresh-fields');"
                            @updated-fields="$emit('refresh-fields')" @manage-detail-table="manageDetailTable"/>
        </el-dialog>

        <el-dialog title="编辑字段" :visible.sync="dialogShow2" width="800px" append-to-body :close-on-click-modal="false">
            <member-field-form v-if="dialogShow2" :data="transferData"  :table-name="tableName" :seq="transferData.seq"
                            @close="dialogShow2 = false" @created-fields="$emit('refresh-fields');"
                            @updated-fields="$emit('refresh-fields')" @manage-detail-table="manageDetailTable"/>
        </el-dialog>
    </div>
</template>

<script>
    import MemberFieldForm from './MemberFieldForm';
    import {fieldType} from "../../../../../js/util/constantStore";

    export default {
        name: "MemberFieldSimplePreview",
        components: {MemberFieldForm},
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            },
            index: {
                type: Number,
                default: 0
            },
            tableName: String,
        },
        data() {
            return {
                fieldType,
                dialogShow: false,
                transferData: {},
                dialogShow2:false
            }
        },
        methods: {
            editComposeField(item){
                let data = JSON.parse(JSON.stringify(item));
                data.fieldSetting = true;
                let {parameter} = data;

                if (typeof parameter == 'string') {
                    try {
                        parameter = JSON.parse(parameter);
                        data.parameter = parameter;
                    } catch (e) {
                        e
                    }
                }
                this.transferData = {...data};
                this.dialogShow2 = true;
            },
            editField() {
                let data = JSON.parse(JSON.stringify(this.data));
                data.fieldSetting = true;
                let {parameter} = data;

                if (typeof parameter == 'string') {
                    try {
                        parameter = JSON.parse(parameter);
                        data.parameter = parameter;
                    } catch (e) {
                        e
                    }
                }
                this.transferData = {...data};
                this.dialogShow = true;
            },
            deleteField(){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/associator/deleteField',{
                        params:{fieldId: this.data.id}
                    }).then(()=>{
                        this.$message.success(`字典【${this.data.name}】已成功删除`);
                        this.$emit('refresh-fields');
                    })
                }).catch(()=>{});
            },
            manageDetailTable(data) {
                this.dialogShow = false;
                this.$emit('manage-detail-table',data);
            },
        },
    }
</script>
<style lang="less" scoped>
.member-field-simple-infobox{
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    .member-field-simple-infocus{
        font-size: 14px;
        color: #333333;
        padding: 0 12px;
        height: 37px;
        line-height: 37px;
    }
    .member-field-simple-infozuhe{
        background-color: #eee;
        border-radius: 4px;
        font-size: 12px;
        color: #333333;
        border: 1px solid #d7d7d7;
        padding: 0 12px;
        height: 30px;
        line-height: 30px;
        margin: 5px 10px;
    } 
}
</style>