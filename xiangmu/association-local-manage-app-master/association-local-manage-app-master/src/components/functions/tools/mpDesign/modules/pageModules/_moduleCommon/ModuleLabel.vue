<template>
    <div class="module-label-container">
        <div class="module-label">
            <iconfont :icon="icon" class="module-icon"/>
            <span class="module-title">{{title}}</span>
        </div>
    </div>
</template>

<script>
    import Iconfont  from '../../../util/Iconfont';
    export default {
        name: "ModuleLabel",
        components: {Iconfont},
        props:{
            icon:{
                type: String,
                default(){
                    return 'content-icon-btn';
                }
            },
            title:{
                type: String,
                default(){
                    return '模块名称';
                }
            },
            name:{
                type: String,
                default(){
                    return 'name';
                }
            },
        },
    }
</script>