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
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="item in channelList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker v-model="timetotime"
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
            <!--如果当前内容区域中多个标签都使用了 作用域插槽，
			可以优化为：提供一个父级的template标签统一使用作用域插槽-->
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
            <el-button type="primary"
                       size="mini">修改</el-button>
            <el-button type="danger"
                       size="mini">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  // 导出name名 方便代码调试
  name: 'getArticle',
  data () {
    return {
      tot: 0,
      searchForm: {
        status: '',
        channel_id: '',
        begin_time: '',
        end_time: '',
        page: 1,
        per_page: 10
      },
      channelList: [

      ],
      articleList: [],
      timetotime: []
    }
  },
  created () {
    this.getChannelList()
    this.getArticleList()
  },
  methods: {
    //   发送axios请求获得数据
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
    },
    getArticleList () {
      let searData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searData[i] = this.searchForm[i]
        }
      }
      console.log(searData)

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
        this.searchForm.begin_time = newTime[0]
        this.searchForm.end_time = newTime[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
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

<style>
.box-card {
  margin-bottom: 15px;
}
</style>
