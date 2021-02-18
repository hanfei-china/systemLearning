<template>
    <attr-container :title="title" :required="required">
        <div>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="newTabItem">新增页签</el-button>
        </div>
        <div>
            <draggable tag="div" handle=".item-sort" :animation="300" v-model="value.tabItems">
                <member-query-builder v-for="(item,index) of value.tabItems" :item="item" :fields="fields" :key="item.id" @delete-item="deleteItem(index)"/>
            </draggable>
        </div>
    </attr-container>
</template>

<script>
    import QueryBuilder from "./js/queryBuilder";
    import AttrContainer from "../AttrContainer";
    import MemberQueryBuilder from "./MemberQueryBuilder";
    import {deleteItem} from "../../../../../../js/util/arrayUtil";

    export default {
        name: "MemberQueryBuilderAttr",
        components: {MemberQueryBuilder, AttrContainer},
        props:{
            attributes: {
                type: Object,
                default() {
                    return {
                        title: '设置标题',
                    }
                }
            },
            value: {
                type: Object,
                default(){
                    return {
                        tabItems: []
                    }
                }
            },
            required: {
                type: Boolean,
                default: true
            },
            educationList:Array,
            collegeList:Array,
            majorList:Array,
        },
        computed: {
            title() {
                if (this.attributes && this.attributes.title && this.attributes.title !== '') {
                    return this.attributes.title;
                }

                return '设置标题';
            },
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        methods:{
            newTabItem(){
                this.value.tabItems.push(new QueryBuilder(null));
            },
            getFields(){
                this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[0,2,5,6,13]}}).then(resp=>{
                    var arr = resp.data;
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
                    this.fields = newArr;
                })
            },
            deleteItem(index){
                deleteItem(index,this.value.tabItems);
            }
        },
        data(){
            return {
                fields: []
            }
        },
        created() {
            let array = [];
            for(let item of this.value.tabItems){
                array.push(new QueryBuilder(item));
            }
            this.value.tabItems = array;

            this.getFields();
        }
    }
</script>
