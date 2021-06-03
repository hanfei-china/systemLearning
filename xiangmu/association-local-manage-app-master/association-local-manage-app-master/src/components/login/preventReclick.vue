<template>
    <button v-preventReclick="clickBtn">按钮</button>
</template>

<script>
export default {
    directives:{
        preventReclick:{
            inserted(el,binding){
                el.addEventListener('click',()=>{
                    if(!el.disable){
                        el.disable=true;
                        new Promise(resolve=>{
                            binding.value(resolve);
                        }).then(res=>{
                            el.disable=false;
                        })
                    }
                })
            }
        }
    },
    methods:{
        clickBtn(callback){
            setTimeout(() => {
                console.log(1);
                callback();
            }, 3000);
        }
    }
}
</script>