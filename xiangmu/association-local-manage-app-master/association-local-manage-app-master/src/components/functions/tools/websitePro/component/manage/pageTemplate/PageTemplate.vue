<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll v-if="list.length>0">
            <div style="padding: 16px;">
                <page-template-item v-for="templateInfo of list" :key="templateInfo.id"
                                    :template-info="templateInfo" :img-width="imgWidth"
                                    @use="use"/>
            </div>
        </vue-scroll>
        <no-data v-else/>
    </div>
</template>

<script>
    import PageTemplateItem from "./PageTemplateItem";
    import NoData from "../../../../../../util/noData/NoData";

    export default {
        name: "PageTemplate",
        components: {NoData, PageTemplateItem},
        props: {
            templateType: Number,
            moduleId: String,
            imgWidth: {
                type: Number,
                default: 316
            }
        },
        data(){
            return {
                list: [],
                total: 0
            }
        },
        methods: {
            getModuleTemplates() {
                let params = {
                    limit: 10000,
                    offset: 0,
                    templateType: this.templateType,
                    moduleId: this.moduleId,
                    filterUnOpen: true
                };

                this.$request.post('/api/common/designTemplate/list', params).then(res => {
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
            },
            use(templateConfig){
                this.$emit('use', templateConfig);
            }
        },
        created() {
            this.getModuleTemplates();
        }
    }
</script>
