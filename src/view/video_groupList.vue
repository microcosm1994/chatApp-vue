<template>
  <div class="video_group">
    <div class="video_group-header">
      <el-input size="small" placeholder="请输入会议室名称" v-model="searchVal" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="video_group-container">
      <div class="video_group-container-list">
        <ul>
          <li class="list-item">
            <span class="el-icon-plus"></span>
            <span class="el-icon-text">新建会议室</span>
          </li>
          <li class="list-item">
            <div class="item-name">
              小会议室小会议室小会议室小会
            </div>
            <div class="item-des">
              说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说明说
            </div>
            <div class="item-mp">
              创建人：小宇宙
            </div>
            <div class="item-btn">
              <el-button size="mini" type="success" @click="joinRoom">加入</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </div>
          </li>
          <li class="list-item">
            <div class="item-name">
              小会议室
            </div>
            <div class="item-des">
              说明说明说明说明说
            </div>
            <div class="item-mp">
              创建人：小宇宙
            </div>
            <div class="item-btn">
              <el-button size="mini" type="success">加入</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video_groupList',
  data () {
    return {
      searchVal: ''
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {

  },
  sockets: {},
  methods: {
    // 加入会议室
    joinRoom () {
      this.$router.push({
        path: '/index/video_group'
      })
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/video_groupList.css";
</style>
