<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%;" ref="select" :clearable="clearable" placeholder="输入名称搜索图文" filterable remote :remote-method="getData" size="mini" v-model="attribute.value">
                <el-option style="max-width:400px" v-for="content in list" :key="content.id" :value="content.id" :label="getMixTitle(content)"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ContentAttr",
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
            clearable(){
                return this.attributes.clearable !== false;
            },
        },

        data() {
            return {
                list: []
            }
        },
        methods:{
            getMixTitle(item) {
                return `【${item.classTitle}】${item.title}`;
            },
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.select.$refs.popper.$el.contains(target);
            },
            getData(value) {

                let params = {
                    branchId: this.branchId,
                    title: value,
                };

                if (!value){
                    params.offset = 0;
                    params.limit = 100;
                }

                this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            }
        },
        created() {
            if(this.attribute.value && this.attribute.value !== ''){
                let params = {
                    id: this.attribute.value,
                    branchId: this.branchId,
                };
                this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            }else{
                this.getData();
            }
        }
    }
</script>
