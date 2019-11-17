<template>
  <div>
    <el-card class="box-card">
      <!--命名插槽，头部内容设置-->
      <div slot="header"
           class="clearfix">
        <span>账户信息</span>
      </div>
      <!--匿名插槽，卡片主体内容-->
      <div class="text item cardbody">
        <div id="lt">
          <el-form ref="accountFormRef"
                   :rules="accountFormRules"
                   :model="accountForm"
                   label-width="100px">
            <el-form-item label="用户名："
                          prop="name">
              <el-input v-model="accountForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码："
                          prop="mobile">
              <el-input v-model="accountForm.mobile"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="accountForm.email"
                        prop="email"></el-input>
            </el-form-item>
            <el-form-item label="简介：">
              <el-input type="textarea"
                        v-model="accountForm.intro"></el-input>
            </el-form-item>
            <el-form-item label="简介：">
              <el-button type="primary"
                         @click="editAccount()">更新账户</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="rt">
          <el-upload action=""
                     :show-file-list="false"
                     :http-request="httpRequest">
            <img v-if="accountForm.photo"
                 :src="accountForm.photo"
                 class="avatar"
                 width="210px"
                 height="210px">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import bus from '@/utils/bus.js'
export default {
  name: 'account',
  data () {
    return {
      accountForm: {
        name: '',
        email: '',
        intro: '',
        photo: ''
      },
      accountFormRules: {
        accountFormRules: {
          name: [
            { required: true, message: '名字必填' },
            // 后端要求title长度介于1-7个字符
            {
              min: 1,
              max: 7,
              message: '名字长度介于1-7个字符之间'
            }
          ],
          email: [
            { required: true, message: '邮箱必填' },
            { type: 'email', message: '邮箱格式不正确' }
          ],
          mobile: [
            { required: true, message: '手机号码必填' },
            { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
          ]
        }
      }
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    httpRequest (res) {
      let fd = new FormData()
      fd.append('photo', res.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          bus.$emit('getPhoto', result.data.data.photo)
          this.accountForm.photo = result.data.data.photo
          this.$message.success('上传成功')
        })
    },
    getAccountList () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          bus.$emit('getName', result.data.data.name)
          bus.$emit('getPhoto', result.data.data.photo)
          this.accountForm = result.data.data
        })
    },
    editAccount () {
      let pro = this.$http.patch('/user/profile', this.accountForm)
      pro.then(result => {
        if (result.data.message === 'OK') {
          bus.$emit('getName', result.data.data.name)
          bus.$emit('getPhoto', result.data.data.photo)
          this.$message.success('更新成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
  }
  #rt {
    width: 30%;
  }
}
</style>
