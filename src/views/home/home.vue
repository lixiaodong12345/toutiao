<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">

      <el-menu background-color="#333744"
               :style="{width:isCollapse?'65px':'200px'}"
               text-color="#fff"
               :collapse="isCollapse"
               :collapse-transition="false"
               active-text-color="#ffd04b"
               :router="true">
        <el-menu-item index="/welcome"
                      :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2"
                    :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/articleadd">发布文章</el-menu-item>
          <el-menu-item index="/getArticle">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3"
                      :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/account"
                      :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>

    </el-aside>
    <el-container>
      <el-header>
        <div id="lt">
          <i slot="prefix"
             :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
             style="cursor:pointer;"
             @click="isCollapse=!isCollapse"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div id="rt">
          <el-input type="text"
                    placeholder="请输入搜索的文章内容"
                    style="width:300px;">
            <i slot="prefix"
               class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo"
                   alt
                   width="40"
                   height="40">
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <el-dropdown-item @click.native="loginOut()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import bus from '@/utils/bus.js'
export default {

  data () {
    return {
      tmpName: '', // 声明一个临时账户名称
      tmpPhoto: '', // 声明一个临时图片名称
      isCollapse: false
    }
  },

  computed: {
    name () {
      return this.tmpName || JSON.parse(window.localStorage.getItem('token')).name
    },
    photo () {
      return this.tmpPhoto || JSON.parse(window.localStorage.getItem('token')).photo
    }
  },
  methods: {
    loginOut () {
      if (confirm('你真的要退出?')) {
        window.localStorage.clear()
        this.$router.push('/login')
      }
    }
  },
  created () {
    bus.$on('getName', nm => {
      let getToken = JSON.parse(window.localStorage.getItem('token'))
      getToken.name = nm
      window.localStorage.setItem('token', JSON.stringify(getToken))
      this.tmpName = nm
    })
    bus.$on('getPhoto', ph => {
      let getToken = JSON.parse(window.localStorage.getItem('token'))
      getToken.photo = ph
      window.localStorage.setItem('token', JSON.stringify(getToken))
      this.tmpPhoto = ph
    })
  }
}

</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    min-width: 950px;
    #lt {
      height: 100%;
      width: 40%;
      display: flex;
      font-size: 18px;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
        img {
          border-radius: 50%;
        }
      }
    }
  }
  .el-main {
    background-color: #f2f3f5;
  }
}
</style>
