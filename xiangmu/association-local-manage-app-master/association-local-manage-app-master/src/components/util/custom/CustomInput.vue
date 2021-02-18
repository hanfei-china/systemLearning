<template>
    <div class="custom-input" :class="{focus: isFocus, hasValue: copyValue}">
        <label :for="id">{{placeholder}}</label>
        <input ref="input" :type="type" v-model="copyValue" :id="id" autocomplete="off"
               @focus="inputFocus" @blur="inputBlur"/>
    </div>
</template>

<script>
    const uuidTimestamp = require('uuid/v1');
    export default {
        name: "CustomInput",
        props: {
            placeholder: {
                type: String,
                default: '请输入'
            },
            type: {
                type: String,
                default: 'text'
            },
            value: {
                type: String
            }
        },
        model: {
            prop: 'value',
            event: 'change',
        },
        data() {
            return {
                id: uuidTimestamp(),
                copyValue: this.value,
                isFocus: false
            }
        },
        methods:{
            inputFocus(){
                this.isFocus = true;
            },
            inputBlur(){
                this.isFocus = false;
            },
            focus(){
                this.$refs.input.focus();
            }
        },
        watch: {
            copyValue(val) {
                this.$emit('change', val);
            }
        }
    }
</script>

<style lang="less" scoped>
    .custom-input {
        border-bottom: 1px solid #D8D8D8;
        position: relative;
        padding: 25px 0 8px 0;
        height: 21px;
        margin-bottom: 20px;
        input[type="text"],
        input[type="password"]{
            font-weight: 500;
            background: none;
            color: #333333;
            border: none;
            height: 21px;
            line-height: 21px;
            position: absolute;
            left: 0;
            outline: 0;
            font-size: 16px;
            top: 25px;
            z-index: 3;
            width: 100%;
            font-family: "微软雅黑", "Microsoft YaHei", Arial, sans-serif;
        }

        input{
            background-color: rgba(255,255,255,0) !important;
        }
        input:-webkit-autofill{
            transition: background-color 5000s ease-in-out 0s;
            -webkit-text-fill-color: #333 !important;
        }
        input:-webkit-autofill:focus {
            -webkit-text-fill-color: #333 !important;
        }

        label {
            display: block;
            color: #b8b8b8;
            width: 100%;
            position: absolute;
            font-size: 14px;
            top: 0px;
            height: 21px;
            line-height: 21px;
            transition: all .3s;
            font-family: "微软雅黑", "Microsoft YaHei", Arial, sans-serif;
        }

        &.focus{
            border-color: #33B190;
            label{
                color: #70665E;
                top: 0;
                font-size: 12px;
            }
        }

        &.hasValue{
            label{
                color: #70665E;
                top: 0;
                font-size: 12px;
            }
        }
    }
</style>
