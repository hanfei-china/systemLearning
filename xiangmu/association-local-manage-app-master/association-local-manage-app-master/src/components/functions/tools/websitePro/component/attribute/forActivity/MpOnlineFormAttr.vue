<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%;" placeholder="请输入在线表单标题进行搜索" :clearable="clearable"
                       ref="select" size="mini" v-model="attribute.value" remote :remote-method="getData">
                <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.formTitle"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MpOnlineFormAttr",
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
            clearable(){
                return this.attributes.clearable !== false;
            },
        },
        data(){
            return {
                list: []
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.select.$refs.popper.$el.contains(target);
            },
            getData(value) {
                let params = {
                    formTitle: value,
                };
                this.$request.get('/api/admin/onlineForm/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            }
        },
        created() {
            this.getData();
        },
    }
</script>
