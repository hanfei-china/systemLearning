<template>
    <router-view/>
</template>

<script>

    import {SET_SYSTEM_SETTING,SET_SYSTEM_VERSION} from "./js/store/mutation-types";

    export default {
        name: 'app',
        computed:{
            systemSetting(){
                return this.$store.state.systemSetting;
            },
            state(){
                return this.$store.state;
            },
        },
        metaInfo(){
            return {
                title: this.systemSetting.systemName,
                link: [{
                    rel: 'icon',
                    href: this.systemSetting.systemFavicon
                }]
            }
        },
        methods: {
            getSystemSetting() {
                this.$request.get('/api/common/setting/anon/getCommonSetting',{
                    params:{type:1}
                }).then(res=>{
                    let {data} = res;
                    this.$store.commit(SET_SYSTEM_SETTING,data);
                })
            },
            getVersion(){
                this.$request.get('/api/common/setting/anon/version').then(res=>{
                    this.$store.commit(SET_SYSTEM_VERSION,res.data);
                })
            }
        },
        created() {
            this.getSystemSetting();
            this.getVersion();
            this.$store.dispatch('updateAllPrivilege');
        }
    }
</script>
