<template>
  <el-container class="fixed-fill-parent">
    <el-main class="account-container-dark unset-padding flex flex-column flex-center">
      <div class="flex flex-center main">
        <div class="flex allcont">
          <div class="flex flex-column flex-center leftpart">
            <div class="system-introduce">
              <div class="titlebox">
                <img :src="systemSetting.loginLogo || systemSetting.systemLogo"
                     alt=""><span>{{ systemSetting.systemName || 校友会管理系统 }}
                <i>V{{ version }}</i>
              </span>
              </div>
              <img class="logintext" src="../../assets/logintext.png" alt="">
            </div>
          </div>
          <div class="dark-system-login" style="">
            <div class="formmain">
              <div>
                <custom-input ref="loginName" v-model="loginName" @keyup.native.enter="enter" placeholder="账号"/>
                <custom-input ref="password" v-model="password" @keyup.native.enter="enter" style="margin-top: 10px;"
                              placeholder="密码" type="password"/>
                <div style="margin-top: 10px;position: relative">
                  <custom-input ref="verifyCode" v-model="verifyCode" @keyup.native.enter="enter" placeholder="验证码"/>
                  <div @click="getVerificationCode"
                       style="width: 85px;position: absolute;right: 0;bottom: 0;z-index: 4;padding: 0px 8px 0 0;">
                    <img :src="verifyCodeUrl" alt="">
                  </div>

                </div>
              </div>
              <div>
                <div class="dark-system-login-btn" @click="login">登录</div>
              </div>
            </div>
            <div class="text-align-center" style="padding-top: 30px;" v-show="casClientSetting.isUsed">
              <el-button style="color:#545451;text-decoration: underline;" size="small" @click="ssoSignIn" type="text">
                单点登录
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import CustomInput from "../util/custom/CustomInput";
import {requestBaseUrl} from '@/js/config/serviceConfig.js';
import CryptoJS from 'crypto-js'

export default {
  name: "Login2",
  components: {CustomInput},
  data() {
    return {
      loginName: '',
      password: '',
      verifyCode: '',
      verifyCodeUrl: '',
      casClientSetting: {
        isUsed: false,
        serverUrlPrefix: '',
        serverLoginUrl: '',
        clientHostUrl: '',
        clientLogoutUrl: ''
      },
    }
  },
  computed: {
    systemSetting() {
      return this.$store.state.systemSetting;
    },
    version() {
      return this.$store.state.systemVersion;
    },
  },
  created() {
    Promise.all([this.$request.get('/api/common/setting/anon/getCommonSetting', {params: {type: 14}})])
        .then(([casClientRes]) => {
          this.casClientSetting = casClientRes.data;
        });

    this.$request.get('/api/admin/account/loginCheck').then(() => {
      this.$message.success({message: '已登录', duration: 1000});
      this.$router.push('/console');
    })
  },
  mounted() {
    this.$refs.loginName.focus();
    this.getVerificationCode()
  },
  methods: {
    getVerificationCode() {
      let num = Math.ceil(Math.random() * 10);//生成一个随机数（防止缓存）
      this.verifyCodeUrl = `${requestBaseUrl}/api/member/account/anon/getPictureVerifyCode?${num}`;
    },
    enter() {
      if (!this.loginName) {
        this.$refs.loginName.focus();
        return;
      }

      if (!this.password) {
        this.$refs.password.focus();
        return;
      }

      if (!this.verifyCode) {
        this.$refs.verifyCode.focus();
        return;
      }

      this.login();
    },
    login() {
      this.$message.closeAll();
      if (!this.loginName) {
        this.$message.warning('请输入登录账号');
        this.$refs.loginName.focus();
        return;
      }

      if (!this.password) {
        this.$message.warning('请输入登录密码');
        this.$refs.password.focus();
        return;
      }

      if (!this.verifyCode) {
        this.$message.warning('请输入验证码');
        this.$refs.verifyCode.focus();
        return
      }
      new Promise(resolve => {
        this.$request.get('/api/admin/account/anon/getLoginAESKey').then((res) => {
          resolve(res.data)
        })
      }).then(AESKey => {
        let enc_password = this.encrypted(AESKey, this.password)
        this.$request.post('/api/admin/account/anon/login', {
          loginName: this.loginName, password: enc_password, randCode: this.verifyCode, key: AESKey
        }).then((res) => {
          this.$message.success({message: '登录成功', duration: 1000});
          if (res.data == "branch") {
            this.$router.push('/branchEditView/branchInfoEdit');
          } else {
            this.$router.push('/console');
          }
        }).catch(() => {
          this.getVerificationCode()
        })
      })
    },
    encrypted(key, password) {
      let utf8_key = CryptoJS.enc.Utf8.parse(key)
      let utf8_password = CryptoJS.enc.Utf8.parse(password)
      return CryptoJS.AES.encrypt(utf8_password, utf8_key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
    },
    ssoSignIn() {
      this.$request.get('/api/admin/account/cas').then((resp) => {
        let {data} = resp;
        if (data === 'success') {
          this.$message.success({message: '已登录系统', duration: 1000});
          this.$router.push('/console');
        }
      });
    },
    forgetPassword() {
      this.$router.push('/forgetPassword');
    }
  }
}
</script>
<style lang="less" scoped>
.account-container-dark {
  background: url('../../assets/loginbg.png') no-repeat;
  background-size: cover;
  font-family: PingFangSC-Regular, PingFang SC, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}

.main {
  min-height: 440px;
  height: 52%;
}

.allcont {
  width: 52%;
  height: 100%;
  min-width: 800px;
  margin-left: 16px;
}

.leftpart {
  width: 50%;
  height: 100%;
}

.system-introduce {
  height: 100%;
  background: rgba(90, 195, 218, 0.7);
  border-radius: 16px;
  box-sizing: border-box;
  color: #ffffff;
  padding-top: 29px;

  .titlebox {
    margin-left: 39px;
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 30px;
      flex-shrink: 0;
      margin-right: 15px;
      object-fit: contain;
    }

    span {
      font-size: 18px;

      i {
        font-size: 12px;
      }
    }
  }

  .logintext {
    margin-left: 72px;
    margin-top: 165px;
  }
}

.dark-system-login {
  width: 50%;
  padding: 0 10%;
  height: 100%;
  box-sizing: border-box;
  margin-left: -16px;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-btn {
    line-height: 40px;
    background: #545451;
    border-radius: 20px;
    color: white;
    font-size: 16px;
    text-align: center;
    margin-top: 40px;
  }
}
</style>
