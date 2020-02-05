<template>
  <div class="contacts">
    <div class="contacts-header">
      <div class="contacts-header-title">
        群组
      </div>
      <div class="contacts-header-add">
        <el-popover
          placement="top"
          width="160"
          trigger="click"
          v-model="visible">
          <div class="item-name-input" style="width: 140px;">
            <el-input
              placeholder="群名称"
              v-model="group.groupName"
              size="mini"
              :maxlength="10"
              clearable>
            </el-input>
            <el-input
              placeholder="群说明"
              v-model="group.groupDes"
              size="mini"
              :maxlength="10"
              style="margin-top: 5px;"
              clearable>
            </el-input>
          </div>
          <div class="item-name-btn" style="text-align: center;">
            <el-button size="mini" type="success" style="width: 100%;margin-top: 10px;" @click="addGroup" >创建</el-button>
          </div>
          <span slot="reference" class="el-icon-plus"></span>
        </el-popover>
      </div>
      <div class="contacts-header-close">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="contacts-container">
      <div class="contacts-container-box">
        <div class="box-list">
          <ul v-if="groupList.length">
            <li class="box-list-item" v-for="(item, index) in groupList" :key="index">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                <p style="line-height: 24px;font-size: 14px;color:#333;">{{item.group.groupName}}</p>
                <p>{{item.group.groupDes}}</p>
              </div>
              <div class="item-btn">
                <span class="el-icon-chat-dot-round" @click="openWindow(item)"></span>
              </div>
            </li>
          </ul>
          <div class="box-list-null" v-else>您还没有群组</div>
        </div>
      </div>
      <div class="contacts-search">
        <div class="contacts-search-top">
          <div class="contacts-search-input">
            <el-input
              size="mini"
              placeholder="搜索群组"
              v-model="searchVal"
              clearable>
            </el-input>
          </div>
          <div class="contacts-search-btn">
            <el-button size="mini" icon="el-icon-search" @click="searchGroup"></el-button>
          </div>
        </div>
        <div class="contacts-search-container" v-if="searchContainerShow">
          <ul v-if="searchList.length">
            <li class="box-list-item" v-for="(item, index) in searchList" :key="index">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                {{item.groupName}}
              </div>
              <div class="item-btn" v-if="item.groupMpId !== user.id">
                <span class="el-icon-plus" @click="addGroupAsk(item)"></span>
              </div>
            </li>
          </ul>
          <div class="contacts-search-null" v-else>没有这个用户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'group',
  props: ['closeCallback', 'openGroupChatWindow', 'closeGroupChatWindow'],
  data () {
    return {
      visible: false,
      popoverValue: '',
      group: {
        groupName: '',
        groupDes: ''
      },
      searchVal: '',
      searchContainerShow: false,
      searchList: [],
      groupList: []
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.getGroupList()
  },
  methods: {
    // 搜索群组
    searchGroup () {
      this.searchList = []
      if (!this.searchVal) {
        this.searchContainerShow = false
        return false
      }
      let data = {
        groupName: this.searchVal
      }
      this.$api.group.searchGroup(data).then(res => {
        if (res.status) {
          this.searchContainerShow = true
          this.searchList = res.data
          this.$message.success(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增群组
    addGroup () {
      if (!this.group.groupName) {
        return false
      }
      let data = {
        groupMpId: this.user.id,
        groupName: this.group.groupName,
        groupDes: this.group.groupDes
      }
      this.$api.group.addGroup(data).then((res) => {
        if (res.status) {
          this.visible = false
          this.getGroupList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增群申请
    addGroupAsk (row) {
      let data = {
        groupMpId: row.groupMpId,
        user: {
          id: this.user.id
        },
        group: {
          id: row.id
        },
        groupDes: this.group.groupDes
      }
      this.$api.group.addGroupAsk(data).then((res) => {
        if (res.status) {
          this.visible = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取群组列表
    getGroupList () {
      let data = {
        user: {
          id: this.user.id
        }
      }
      this.groupList = []
      this.$api.group.getGroupList(data).then((res) => {
        if (res.status) {
          this.groupList = res.groupList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 关闭侧边栏
    close () {
      this.closeCallback()
    },
    // 打开群聊天窗口
    openWindow (row) {
      let groupData = row.group
      this.$store.commit('setGroupMemberId', row.id)
      this.$store.commit('setGroup', groupData)
      let data = {
        groupId: groupData.id,
        userId: row.userId
      }
      this.$socket.emit('JoinGroupRoom', data)
      this.openGroupChatWindow()
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/aside/contacts.css";
</style>
