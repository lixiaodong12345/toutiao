<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>全部图文</span>
      </div>
      <div>
        <el-form ref="searchFormRef"
                 :model="searchForm">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="searchForm.status"
                            @change="getArticleList()">
              <el-radio v-model="searchForm.status"
                        label="">全部</el-radio>
              <el-radio v-model="searchForm.status"
                        label="0">草稿</el-radio>
              <el-radio v-model="searchForm.status"
                        label="1">待审核</el-radio>
              <el-radio v-model="searchForm.status"
                        label="2">审核通过</el-radio>

              <el-radio v-model="searchForm.status"
                        label="3">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <channel-com @select="sele"></channel-com>
            
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker v-model="timetotime"
                            value-format="yyyy-MM-dd"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList"
                  style="width:100%;">
          <el-table-column label="图标">
            <img :src="Data.row.cover.images[0]"
                 slot-scope="Data"
                 alt="没有图标"
                 width="150"
                 height="100">
          </el-table-column>
          <el-table-column label="标题"
                           prop="title"
                           width="300"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1"
                      type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2"
                      type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3"
                      type="warning">审核失败</el-tag>
              <el-tag v-else
                      type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button type="primary"
                         size="mini"
                         @click="$router.push(`/articleEdit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger"
                         size="mini"
                         @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="searchForm.page"
                   :page-sizes="[10, 20, 30]"
                   :page-size="searchForm.per_page"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="tot">
    </el-pagination>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel.vue'

export default {
  // 导出name名 方便代码调试
  name: 'getArticle',
  components: {
    ChannelCom
  },
  data () {
    return {
      tot: 0,
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      articleList: [],
      timetotime: []
    }
  },

  created () {
    this.getArticleList()
  },
  methods: {
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getArticleList()
    },
    sele (val) {
      this.searchForm.channel_id = val
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getArticleList()
    },
    //   发送axios请求获得数据
    del (id) {
      if (confirm('确定要删除?')) {
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
            alert('删除成功')
            this.getArticleList()
          })
      }
    },
    getArticleList () {
      let searData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searData[i] = this.searchForm[i]
        }
      }
      console.dir(searData)
      let pro = this.$http.get('/articles', { params: searData })
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            // console.log(result)

            this.tot = result.data.data.total_count
          }
        })
    }
  },
  watch: {
    timetotime (newTime) {
      //   console.log(newTime)
      if (newTime) {
        this.searchForm.begin_pubdate = newTime[0]
        this.searchForm.end_pubdate = newTime[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }

      this.getArticleList()
    },
    searchForm: {
      handler: function (news) {
        if (news) {
          this.getArticleList()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
