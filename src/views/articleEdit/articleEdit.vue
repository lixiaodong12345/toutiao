<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>修改文章</span>
      </div>
      <div class="text item">
        <el-form ref="editFormRef"
                 :model="editForm"
                 label-width="120px"
                 :rules="editFormRules">
          <el-form-item label="标题"
                        prop="title">
            <el-input v-model="editForm.title" :style="{width:'300px'}"></el-input>
          </el-form-item>
          <el-form-item label="内容："
                        prop="content">
            <quillEditor v-model="editForm.content"></quillEditor>
          </el-form-item>
          <el-form-item label="封面：">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道："
                        prop="channel_id">
            <el-select v-model="editForm.channel_id"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in channelList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="editarticle(false)">发布</el-button>
            <el-button @click="editarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'articleEdit',
  components: {
    quillEditor
  },
  data () {
    return {
      editFormRules: {
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
      editForm: {
        content: '',
        title: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: []
      },
      channelList: []
    }
  },
  created () {
    this.getChannelList()
    this.getEditArticle()
  },
  computed: {
    // 在这里得到传递的参数封装
    aid () {
      return this.$route.params.id
    }
  },
  methods: {
    // 获取频道列表数据
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.put(`/articles/${this.aid}`, this.editForm, { params: { draft: flag } })
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                alert('修改成功')
                this.$router.push('/getArticle')
              }
            })
        }
      })
    },
    getChannelList () {
      var pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得文章频道错误：' + err)
        })
    },
    // 获得文章id信息
    getEditArticle () {
      let pro = this.$http.get(`articles/${this.aid}`)
      pro
        .then(result => {
          this.editForm = result.data.data
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
