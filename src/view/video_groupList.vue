<template>
  <div class="video_group">
    <div class="video_group-header">
      <el-input size="small" placeholder="请输入会议室名称" v-model="searchVal" clearable class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchVideoGroup"></el-button>
      </el-input>
    </div>
    <div class="video_group-container">
      <div class="video_group-container-list" v-if="searchList.length">
        <ul>
          <li class="list-item" v-for="(item, index) in searchList" :key="index">
            <div class="item-name">
              {{item.groupName}}
            </div>
            <div class="item-des">
              {{item.groupDes}}
            </div>
            <div class="item-mp">
              {{item.createTime | timeFormat}}
            </div>
            <div class="item-btn">
              <el-button size="mini" type="success" @click="joinRoom">加入</el-button>
              <el-button size="mini" type="danger" v-if="item.groupMpId === user.id" @click="delVideoGroup(item)">删除</el-button>
            </div>
          </li>
        </ul>
        <el-divider>⇧搜索结果</el-divider>
      </div>
      <div class="video_group-container-list">
        <ul>
          <li class="list-item" @click="dialogVisible = true">
            <span class="el-icon-plus"></span>
            <span class="el-icon-text">新建会议室</span>
          </li>
          <li class="list-item" v-for="(item, index) in groupList" :key="index">
            <div class="item-name">
              {{item.groupName}}
            </div>
            <div class="item-des">
              {{item.groupDes}}
            </div>
            <div class="item-mp">
             {{item.createTime | timeFormat}}
            </div>
            <div class="item-btn">
              <el-button size="mini" type="success" @click="joinRoom">加入</el-button>
              <el-button size="mini" type="danger" v-if="item.groupMpId === user.id" @click="delVideoGroup(item)">删除</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      title="新建会议室"
      :visible.sync="dialogVisible"
      width="300px">
      <div class="dialog">
        <el-input
          size="mini"
          placeholder="会议室名称"
          v-model="group.name"
          maxlength="14"
          clearable>
        </el-input>
        <el-input
          style="margin-top: 5px;"
          size="mini"
          maxlength="40"
          placeholder="会议室说明"
          v-model="group.des"
          clearable>
        </el-input>
      </div>
      <div class="dialog-footer" style="text-align: center;margin-top: 10px;">
    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
    <el-button size="mini" type="primary" @click="addVideoGroup">确 定</el-button>
  </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'video_groupList',
  data () {
    return {
      searchVal: '',
      dialogVisible: false,
      groupList: [],
      searchList: [],
      group: {
        name: '',
        des: ''
      }
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.getVideoGroupList()
  },
  sockets: {},
  methods: {
    // 获取会议室列表
    getVideoGroupList () {
      this.$api.videoGroup.getVideoGroupList().then((res) => {
        if (res.status) {
          this.groupList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加会议室
    addVideoGroup () {
      if (!this.group.name) {
        this.$message.error('请输入会议室名称')
        return false
      }
      if (!this.group.name) {
        this.$message.error('请输入会议室说明')
        return false
      }
      let data = {
        groupName: this.group.name,
        groupDes: this.group.des,
        groupMpId: this.user.id
      }
      this.$api.videoGroup.addVideoGroup(data).then((res) => {
        if (res.status) {
          this.getVideoGroupList()
          this.dialogVisible = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除会议室
    delVideoGroup (row) {
      this.$api.videoGroup.delVideoGroup({
        id: row.id
      }).then((res) => {
        if (res.status) {
          this.getVideoGroupList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 搜索会议室
    searchVideoGroup () {
      if (!this.searchVal) {
        this.searchList = []
        return false
      }
      this.$api.videoGroup.searchVideoGroup({
        groupName: this.searchVal
      }).then((res) => {
        if (res.status) {
          this.searchList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 加入会议室
    joinRoom () {
      this.$router.push({
        path: '/index/video_group'
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>
  @import "../assets/css/video_groupList.css";
</style>
