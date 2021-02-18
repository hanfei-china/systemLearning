<template>
    <div class="website-pro-position-relative" style="height: 642px;width: 100%;">
        <vue-scroll :ops="{bar:{keepShow:true}}">
            <codemirror ref="codemirror" class="website-pro-codemirror" v-model="changeValue" :options="cmOptions" @ready="ready"/>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "CustomCss",
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'css',
                    lineNumbers: true,
                    theme: 'neo',
                    line: true,
                    // more codemirror options, 更多 codemirror 的高级配置...
                },
                changeValue: this.value
            }
        },
        methods:{
            ready(){
                this.$refs.codemirror.$el.click();
            }
        },
        created(){

        },
        watch:{
            changeValue(val){
                this.$emit('change',val);
            },
            value(val){
                this.changeValue = val;
            }
        }
    }
</script>
