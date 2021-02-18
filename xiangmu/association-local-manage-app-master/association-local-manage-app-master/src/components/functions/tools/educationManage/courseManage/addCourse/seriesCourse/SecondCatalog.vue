<template>
    <div style="margin-top: 6px;">
        <el-card>
            <div slot="header" class="flex">
                <div class="flex-fill-in-the-remaining-space">
                    <el-input size="small" placeholder="请输入章节名称" v-model="field.name" style="width: 350px;"></el-input>
                </div>
                <div style="height: 32px;" class="flex flex-column flex-center">
                    <el-upload style="margin: 0 6px;" :action="action" :show-file-list="false" :on-success="uploadSuccess">
                        <el-button style="float: right; padding: 3px 0" type="text">上传课件<i class="el-icon-upload el-icon--right"></i></el-button>
                    </el-upload>
                </div>
                <div style="line-height: 32px;margin-left: 16px;">
                    <el-button type="text" class="unset-padding custom-el-button danger" @click="$emit('delete-item')">删除</el-button>
                </div>
            </div>
            <div class="container">
                <div class="table-header flex">
                    <span class="flex-fill-in-the-remaining-space text-align-center">章节名称</span>
                    <span class="flex-fill-in-the-remaining-space text-align-center">修改课件</span>
                    <span class="flex-fill-in-the-remaining-space text-align-center">免费试看</span>
                    <span style="width: 200px;">操作</span>
                </div>
                <div class="table-body">
                    <ul ref="sortList">
                        <li v-for="(item,index) in field.items" :key="index">
                            <single-chapter :field="item" @delete-field="deleteField(index)" @change-field="changeField($event,index)"></single-chapter>
                        </li>
                    </ul>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";
    import SingleChapter from "./SingleChapter";
    import Sortable from 'sortablejs';

    export default {
        name: "SecondCatalog",
        components: {SingleChapter},
        props: {
            field: Object
        },
        data(){
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
            }
        },
        mounted(){
            this.drag();
        },
        methods: {
            uploadSuccess(res){
                this.field.items.push({
                    name: '章节名称',
                    resource: res.data,
                    free: false,
                    seq: this.field.items.length
                })
            },
            deleteField(index){
                this.field.items.splice(index, 1);
            },
            changeField(val,index){
                this.field.items.splice(index, 1, val);
            },
            //排序
            drag() {
                let el = this.$refs.sortList;
                Sortable.create(el, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.field.items));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue);
                        }
                    }
                });
            },
            sortFields(fieldList) {
                this.field.items = [];
                setTimeout(() => {
                    this.field.items = fieldList;
                }, 1);
            },
        }
    }
</script>

<style scoped lang="less">
    .container {
        box-sizing: border-box;
        border: 1px solid #d7dde4;
        color: #65717f;

        .table-header {
            background-color: #f5f8f9;
            height: 49px;
            border-bottom: 1px solid #d7dde4;
            line-height: 50px;

            span {
                display: inline-block;
            }
        }

        .table-body {
            /*margin: 0 20px;*/
            line-height: 49px;
        }
    }
</style>
