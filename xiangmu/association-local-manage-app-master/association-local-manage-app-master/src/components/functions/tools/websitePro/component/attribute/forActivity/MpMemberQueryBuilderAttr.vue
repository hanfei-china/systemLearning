<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" style="height: 28px;" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div class="flex-fill-in-the-remaining-space">
            <div>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="newTabItem">新增页签</el-button>
            </div>
            <div>
                <draggable tag="div" handle=".item-sort" :animation="300" v-model="attribute.value.tabItems">
                    <member-query-builder v-for="(item,index) of attribute.value.tabItems" :item="item" :fields="fields" :key="item.id" @delete-item="deleteItem(index)"/>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
    import MemberQueryBuilder from "../../../../mpDesign/attributes/memberQueryBuilder/MemberQueryBuilder";
    import QueryBuilder from "../../../../mpDesign/attributes/memberQueryBuilder/js/queryBuilder";
    import {deleteItem} from "../../../../../../../js/util/arrayUtil";
    export default {
        name: "MpMemberQueryBuilderAttr",
        components: {MemberQueryBuilder},
        props:{
            attribute: Object
        },
        computed:{
            showTitle(){
                return this.attribute.showTitle;
            },
            title(){
                return this.attribute.title;
            },
            attributes(){
                return this.attribute.attributes || {};
            },
            options(){
                return this.attributes.options || [];
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
        },

        data() {
            return {
                fields: []
            }
        },
        methods:{
            newTabItem(){
                this.attribute.value.tabItems.push(new QueryBuilder(null));
            },
            getFields(){
                this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[0,2,5,6]}}).then(resp=>{
                    this.fields = resp.data;
                })
            },
            deleteItem(index){
                deleteItem(index,this.attribute.value.tabItems);
            }
        },
        created() {
            let array = [];
            for(let item of this.attribute.value.tabItems){
                array.push(new QueryBuilder(item));
            }
            this.attribute.value.tabItems = array;

            this.getFields();
        }
    }
</script>
