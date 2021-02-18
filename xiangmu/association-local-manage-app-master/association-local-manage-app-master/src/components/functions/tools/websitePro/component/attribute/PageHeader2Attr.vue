<template>
    <div class="website-pro-flex" v-show="show">
        <div class="website-pro-layout-attr-title" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%" ref="select" v-model="attribute.value" :clearable="showClear" size="mini"
                       placeholder="请选择页头">
                <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageHeader2Attr",
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
            showClear() {
                return !(this.attributes.showClear !== true);
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target);
            },
            getData() {
                this.loading = true;
                this.$request.get('/api/admin/website/pageHeader/list').then(res=>{
                    let {data} = res;
                    this.list = data;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            }
        },
        data() {
            return {
                list: []
            }
        },
        created(){
            this.getData();
        },
    }
</script>
