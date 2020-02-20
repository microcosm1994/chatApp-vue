<template>
  <div class="board">
    <input type="text" v-model="val">
    <div class="board-tool">
      <el-button size="small" type="primary" icon="el-icon-edit" circle></el-button>
      <el-button size="small" type="primary" icon="el-icon-check" circle @click="sendChannel"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'board',
  props: ['localChannelMap', 'remoteChannelMap'],
  data () {
    return {
      val: '',
      dataArr: []
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    videoGroupId: function () {
      return this.$route.params.row.id
    }
  },
  mounted () {
    // 监听远程数据通道消息
    this.onChannel()
  },
  methods: {
    // 监听数据
    onChannel () {
      for (let key in this.localChannelMap) {
        this.localChannelMap[key].onmessage = (e) => {
        }
      }
      for (let key in this.remoteChannelMap) {
        this.remoteChannelMap[key].onmessage = (e) => {
        }
      }
    },
    // 使用local发送
    sendChannel () {
      if (Object.keys(this.localChannelMap).length) {
        for (let key in this.localChannelMap) {
          let channel = this.localChannelMap[key]
          if (channel && channel.readyState === 'open') {
            channel.send(this.val)
          } else {
            this.replyChannel()
          }
        }
      } else {
        this.replyChannel()
      }
    },
    // 使用remote发送（当local没有链接成功时使用）
    replyChannel () {
      for (let key in this.remoteChannelMap) {
        let channel = this.remoteChannelMap[key]
        if (channel && channel.readyState === 'open') {
          channel.send(this.val)
        } else {
          this.$message.error('数据通道未开启')
        }
      }
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/board/board.css";
</style>
