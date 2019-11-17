<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addFormRef"
                 :model="addForm"
                 label-width="120px"
                 :rules="addFormRules">
          <el-form-item label="标题"
                        prop="title">
            <el-input v-model="addForm.title"
                      :style="{width:'300px'}"></el-input>
          </el-form-item>
          <el-form-item label="内容："
                        prop="content">
            <quillEditor v-model="addForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面：">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li class="uploadbox"
                  v-for="item in covernum"
                  @click="shouPhoto"
                  :key="item">
                <span>点击图标选择图片</span>
                <img v-if="addForm.cover.images[item-1]"
                     :src="addForm.cover.images[item-1]"
                     alt="没有图片" />
                <div v-else
                     class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="频道："
                        prop="channel_id">
            <channel @select="sele"></channel>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog title="素材图片"
               :visible.sync="dialogVisible">
      <ul>
        <li class="image-box"
            v-for="item in imgList"
            :key="item.id"><img :src="item.url"
               alt="没有图片"
               @click="imgDorder"></li>
      </ul>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import channel from '@/components/channel.vue'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'articleadd',
  components: {
    quillEditor,
    channel
  },
  data () {
    return {
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      imgList: [],
      querycdt: {
        collect: false,
        page: 1,
        per_page: 12
      },
      addForm: {
        content: '',
        title: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: []
      },
      dialogVisible: false
    }
  },
  methods: {
    // 获取频道列表数据
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.post('http://ttapi.research.itcast.cn/mp/v1_0/articles',
            this.addForm, { params: { draft: flag } })
          pro
            .then(result => {
              this.$message.success('文章发布成功')
              this.$router.push('/getArticle')
            })
        }
      })
    },
    // 如果不传参数 则返回一个事件对象
    imgDorder (e) {
      var lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
        e.target.parentNode.style.border = '3px solid red'
      }
    },
    getImgList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imgList = result.data.data.results
          }
        })
    },
    shouPhoto () {
      this.dialogVisible = true
    },
    sele (val) {
      // 获取子组件值
      this.addForm.channel_id = val
    }
  },
  computed: {
    covernum () {
      if (this.addForm.cover.type >= 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  created () {
    this.getImgList()
  }
}
</script>
<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
</style>
