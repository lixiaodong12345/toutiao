<template>
  <div id="login-container">
    <!-- 设置样式 -->
    <div id="login-box">
      <!-- ref form表单验证的DOM元素 -->
      <el-form ref="loginFo"
               :model="loginForm"
               :rules="rules">
        <img src="../../assets/img/logo_index.png"
             alt="">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile"
                    placeholder="请输入手机号码">
                    <i slot="prefix" class="iconfont icon-iconsheji-">
                      </i></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code"
                    placeholder="请输入校验码">
                    <i slot="prefix" class="iconfont icon-yanzhengma1"></i></el-input>
        </el-form-item>
        <el-form-item style="text-align:left;"
                      prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"
                       style="margin-right:10px;"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;"
                     type="primary"
                     @click="login" v-loading="loading" :disabled="loading">登录</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
import '@/assets/icon/iconfont.css'
export default {
  data () {
    var checkAge = (rule, value, callback) => {
      value ? callback() : callback('无条件')
    }
    return {
      loading: false,
      createObj: null,
      loginForm: {
        mobile: '13911111111',
        code: '246810',
        xieyi: false
      },
      rules: {
        xieyi: [
          { validator: checkAge }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[35789]\d{9}$/, message: '手机格式不正确', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入校验码', trigger: 'blur' }

        ]
      }

    }
  },
  methods: {
    login () {
      //   编程跳转
      this.$refs.loginFo.validate(valid => {
        if (valid) {
          if (this.createObj !== null) {
            return this.createObj.verify()
          }
          this.loading = true
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              let { data } = result.data
              console.log(data)
              window.initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 没有按钮，通过登录按钮激活验证
              }, captchaObj => {
                // 这里可以调用验证实例 captchaObj 的实例方法
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  this.createObj = captchaObj
                  captchaObj.verify() // 显示验证码窗口
                  // 交互窗口完毕后 激活样式
                  this.loading = false
                }).onSuccess(() => {
                  // your code
                  // B. 校验账号真实性，登录
                  this.loginAt()
                }).onError(() => {
                  // your code
                })
              })
            })
            .catch(err => {
              return this.$message.error('货的极验初始校验错误' + err)
            })
        }
      })
    },
    loginAt () {
      var pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            console.log(result)

            window.localStorage.setItem('token', JSON.stringify(result.data.data))
            this.$router.push('/home')
          }
        })
      // .catch(err => {
      //   this.$message.error('用户名错误')
      // })
    }

  }

}
</script>

<style lang="less" scope>
#login-container {
  background-color: gray;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/img/login_bg.jpg");
  background-size: cover;
  #login-box {
    height: 345px;
    width: 410px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img {
      width: 50%;
      margin: 20px auto;
    }
    .el-form {
      width: 75%;
    }
  }
}
</style>
