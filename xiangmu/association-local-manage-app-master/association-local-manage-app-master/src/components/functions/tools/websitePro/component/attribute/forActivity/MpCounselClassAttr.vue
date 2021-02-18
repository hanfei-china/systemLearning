<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%;" placeholder="请选择咨询分类" :clearable="clearable" ref="select" size="mini" v-model="attribute.value">
                <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MpCounselClassAttr",
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
            getData() {
                this.loading = true;
                this.$request.get('/api/admin/counsel/messageCategory/getCounselMessageCategories').then(res=>{
                    this.list = res.data.list;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            }
        },
        created() {
            this.getData();
        },
    }
</script>
