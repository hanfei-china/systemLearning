<template>
    <el-select placeholder="下拉选择系统功能" size="small" v-model="copyValue" filterable clearable>
        <member-func-module-option v-for="item of list" :key="item.id" :item="item"/>
    </el-select>
</template>

<script>
    import {translatorMenus} from "../../../../../../../../js/util/utilFunction";
    import MemberFuncModuleOption from "./MemberFuncModuleOption";

    export default {
        name: "MemberFuncModuleChoose",
        components: {MemberFuncModuleOption},
        props:{
            value:String,
        },
        computed:{
            memberType(){
                return this.$route.params.memberType
            }
        },
        data(){
            return {
                copyValue: this.value,
                list: []
            }
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        watch:{
            copyValue(val){
                this.$emit('change',val);
            },
            value(val){
                this.copyValue = val;
            }
        },
        methods:{
            getList(){
                this.$request.get(`/api/admin/memberMenuSetting/moduleList`).then(res=>{
                    let modules = res.data;

                    if (modules && modules.length > 0) {

                        let parents = modules.filter(module => {
                            return !module.rootId;
                        });

                        let children = modules.filter(module => {
                            return module.rootId && module.isRealModule;
                        });

                        translatorMenus(parents, children, 'rootId');
                        this.list = parents;
                    }
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
