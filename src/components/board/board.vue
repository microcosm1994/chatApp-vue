<template>
  <div class="board">
    <input type="text" v-model="val">
    <div class="board-tool">
      <el-button size="small" type="primary" icon="el-icon-edit" circle></el-button>
      <el-button size="small" type="primary" icon="el-icon-check" circle @click="sendChannel"></el-button>
      <el-button size="small" type="primary" icon="el-icon-refresh-left" circle @click="replyChannel"></el-button>
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
  watch: {
    localChannelMap: {
      handler: function (n, o) {
        console.log(n)
        console.log(o)
      },
      deep: true
    }
  },
  mounted () {
    console.log(this.localChannelMap)
    console.log(this.remoteChannelMap)
    // 监听远程数据通道消息
    this.onChannel()
  },
  methods: {
    onChannel () {
      for (let key in this.remoteChannelMap) {
        this.remoteChannelMap[key].onmessage = (e) => {
          console.log(e)
        }
      }
    },
    sendChannel () {
      for (let key in this.localChannelMap) {
        let channel = this.localChannelMap[key]
        if (channel && channel.readyState === 'open') {
          channel.send('localChannel', key, this.val)
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
