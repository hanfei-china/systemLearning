<template>
    <div class="account-container background-color-white fixed-fill-parent flex flex-center flex-column">
        <div class="flex flex-center">
            <div class="background-color-white" style="padding-bottom: 20px;">
                <div>
                    <img style="height: 120px;" src="../../assets/wait-login.gif"/>
                </div>
                <div class="text-align-center bounce" v-show="!showTip">
                    <span>正在登录{{systemSetting.systemName}}，请稍候</span>
                    <span class="letter" style="font-size: 16px;" v-for="(letter,index) of letters" :key="index">{{letter}}</span>
                </div>
                <div class="text-align-center bounce" v-show="showTip">
                    <span class="danger-tip" style="font-size: 16px;">{{errorTip}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TicketLogin",
        computed:{
            systemSetting(){
                return this.$store.state.systemSetting;
            },
            letters(){
                return ['.','.','.','.','.','.'];
            },
            ticket(){
                return this.$route.query.ticket;
            }
        },
        methods:{
            login(){
                this.$message.closeAll();
                if(!this.ticket){
                    this.$message.error('丢失登录凭证【ticket】，请联系系统管理员');
                    this.errorTip = '丢失登录凭证【ticket】，请联系系统管理员';
                    this.showTip = true;
                    return;
                }

                this.$request.post('/api/admin/account/anon/authorizationLogin',{
                    ticket: this.ticket
                }).then(()=>{
                    this.$message.success({message:'登录成功',duration:1000});
                    this.$router.push('/console');
                    this.showTip = false;
                }).catch((errorTip)=>{
                    this.errorTip = errorTip;
                    this.showTip = true;
                })
            },
        },
        data(){
            return {
                errorTip: '丢失登录凭证【ticket】，请联系系统管理员',
                showTip: false
            }
        },
        created() {
            this.login();
        },
        watch:{
            ticket(){
                this.login();
            }
        }
    }
</script>
<style>
    .bounce {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        white-space: nowrap;
    }

    .letter {
        animation: bounce 0.75s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate;
        display: inline-block;
        transform: translate3d(0, 0, 0);
        margin-top: 0.5em;
        text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
        font: normal 500 16px 'Varela Round', sans-serif;
        padding-left: 4px;
    }

    .letter:nth-last-child(1) {
        animation-delay: 0.0833333333s;
    }
    .letter:nth-last-child(2) {
        animation-delay: 0.1666666667s;
    }
    .letter:nth-last-child(3) {
        animation-delay: 0.25s;
    }
    .letter:nth-last-child(4) {
        animation-delay: 0.3333333333s;
    }
    .letter:nth-last-child(5) {
        animation-delay: 0.4166666667s;
    }
    .letter:nth-last-child(6){
        animation-delay: 0.5166666667s;
    }


    @keyframes bounce {
        0% {
            transform: translate3d(0, 0, 0);
            text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
        }
        100% {
            transform: translate3d(0, -8px, 0);
            text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em;
        }
    }
</style>
