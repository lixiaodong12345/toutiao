<template>
  <div id="login-container">
    <!-- 设置样式 -->
    <div id="login-box">
      <el-form ref="loginFo"
               :model="loginForm"
               :rules="rules">
        <img src="../../assets/img/logo_index.png"
             alt="">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile"
                    placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code"
                    placeholder="请输入校验码"></el-input>
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
                     @click="login">登录</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    var checkAge = (rule, value, callback) => {
      value ? callback() : callback('无条件')
    }
    return {
      loginForm: {
        mobile: '13555555555',
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
          var pro = this.$http.post('/authorizations', this.loginForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                console.log(result)

                window.localStorage.setItem('user', JSON.stringify(result.data.data))
                this.$router.push('/home')
              }
            })
            // .catch(err => {
            //   this.$message.error('用户名错误')
            // })
        }
      })
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
