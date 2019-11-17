<template>
  <el-select v-model="chid"
             placeholder="请选择"
             clearable
             @change="gaibian">
    <el-option v-for="item in channelList"
               :key="item.id"
               :label="item.name"
               :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'channel',

  data () {
    return {
      chid: '',
      channelList: []
    }
  },

  created () {
    this.getChannelList()
  },
  methods: {
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把获得的频道信息赋予给channelList成员
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获得频道错误：' + err)
        })
    },
    gaibian () {
      // 给父传参
      this.$emit('select', this.chid)
    }
  }
}
</script>

<style>
</style>
