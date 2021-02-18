<template>
    <div class="flex input-number-area-container" :class="{focus}">
        <el-input-number @focus="number1Focus = true" @blur="number1Focus = false"
                         class="flex-fill-in-the-remaining-space" :min="min" :max="number1Max" v-model="number1" :controls-position="controlsPosition"/>
        <div><slot></slot></div>
        <el-input-number @focus="number2Focus = true" @blur="number2Focus = false"
                class="flex-fill-in-the-remaining-space" :min="number2Min" :max="max" v-model="number2" :controls-position="controlsPosition"/>
    </div>
</template>

<script>
    export default {
        name: "InputNumberArea",
        props:{
            min:{
                type: Number,
                default: 1
            },
            max:{
                type: Number,
                default: 10000
            },
            step:{
                type: Number,
                default: 10
            },
            diff:{
                type: Number,
                default: 1000
            },
            value:{
                type: Array,
                default(){
                    return [this.min,this.max];
                },
                validator(value){
                    return !value || value.length === 2;
                }
            },
            controlsPosition:{
                type: String,
                default: 'right',
                validator(value) {
                    return ['right','-'].indexOf(value) !== -1;
                }
            }
        },
        model:{
            event: 'change',
            model: 'value',
        },
        data(){
            return {
                number1: this.value[0],
                number2: this.value[1],
                number1Focus: false,
                number2Focus: false
            }
        },
        computed:{
            number1Max(){
                return this.number2;
            },
            number2Min(){
                return this.number1;
            },
            focus(){
                return this.number1Focus || this.number2Focus;
            }
        },
        watch:{
            number1(val){
                if(this.number2 < val){
                    this.number2 = val + this.step;
                }else{
                    this.$emit('change',[val,this.number2]);
                }
            },
            number2(val){
                if(this.number1 > val){
                    this.number1 = val - this.step;
                }else{
                    this.$emit('change',[this.number1,val]);
                }
            },
            min(val){
                if(this.number1 < val){
                    this.number1 = val;
                }
            },
            max(val){
                if(this.number2 > val){
                    this.number2 = val;
                }else{
                    if(this.number2 - this.number1 < this.diff){
                        this.number2 = this.number1 + this.diff;
                    }
                }
            }
        }
    }
</script>
<style lang="less">
    .input-number-area-container{

        border: 1px solid #DCDFE6;
        border-radius: 4px;

        &.focus{
            border-color: #409EFF;
        }

        &>.el-input-number{
            .el-input-number__decrease{
                display: none !important;
                border: none !important;
                background-color: unset !important;

                &:hover{
                    background-color: #f5f7fa !important;
                }
            }

            .el-input-number__increase{
                display: none !important;
                border: none !important;
                background-color: unset !important;

                &:hover{
                    background-color: #f5f7fa !important;
                }
            }

            .el-input input{
                border: none !important;
                padding-right: 15px !important;
            }
        }
    }
</style>
