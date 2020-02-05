<template>
  <div class="contacts">
    <div class="contacts-header">
      <div class="contacts-header-title">
        系统消息
      </div>
      <div class="contacts-header-close">
        <span class="el-icon-close" @click="close"></span>
      </div>
    </div>
    <div class="contacts-container">
      <div class="contacts-container-box">
        <div class="box-header" @click="handleLabelClick('friendsAsk')">
          好友请求
        </div>
        <div class="box-list" v-show="friendsAskListShow">
          <ul v-if="friendsAskList.length">
            <li class="box-list-item" v-for="(item, index) in friendsAskList" :key="index">
              <div class="item-left">
                <div class="item-avator">
                  <el-avatar shape="square" :size="40" ></el-avatar>
                </div>
              </div>
              <div class="item-right">
                <div class="item-name">
                  {{item.sourceUid === user.id ? item.targetName : item.sourceName}}
                </div>
                <div class="item-time">
                  {{item.createTime | timeFormat}}
                </div>
                <div class="item-btn" v-if="item.isAgree === 0">
                  <span class="item-btn-ok" @click="putFriendsAsk(item, 1)">同意</span>
                  <span class="item-btn-danger" @click="putFriendsAsk(item, 2)">拒绝</span>
                  <span class="item-btn-ignore" @click="delFriendsAsk(item)">忽略</span>
                </div>
                <div class="item-status" v-if="item.isAgree !== 0">
                  <span :style="{color: item.isAgree === 1 ? '#67c23a' : '#f56c6c'}">
                    {{item.isAgree | isAgree}}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <div class="box-list-null" v-else>您还没有好友请求</div>
        </div>
      </div>
      <div class="contacts-container-box">
        <div class="box-header" @click="handleLabelClick('groupAsk')">
          群组申请
        </div>
        <div class="box-list" v-show="groupAskListShow">
          <ul v-if="groupAskList.length">
            <li class="box-list-item" v-for="(item, index) in groupAskList" :key="index">
              <div class="item-left">
                <div class="item-avator">
                  <el-avatar shape="square" :size="40" ></el-avatar>
                </div>
              </div>
              <div class="item-right">
                <div class="item-name">
                  <span>{{item.user.nickName + '申请加入您的群组(' + item.group.groupName + ')'}}</span>
                </div>
                <div class="item-time">
                  {{item.createTime | timeFormat}}
                </div>
                <div class="item-btn" v-if="item.isAgree === 0">
                  <span class="item-btn-ok" @click="putGroupAsk(item, 1)">同意</span>
                  <span class="item-btn-danger" @click="putGroupAsk(item, 2)">拒绝</span>
                  <span class="item-btn-ignore" @click="delGroupAsk(item)">忽略</span>
                </div>
                <div class="item-status" v-if="item.isAgree !== 0">
                  <span :style="{color: item.isAgree === 1 ? '#67c23a' : '#f56c6c'}">
                    {{item.isAgree | isAgree}}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <div class="box-list-null" v-else>您还群组申请</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: ['closeCallback'],
  data () {
    return {
      searchVal: '',
      friendsAskList: [],
      friendsAskListShow: false,
      groupAskList: [],
      groupAskListShow: false
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.getFriendsAskList()
    this.getGroupAskList()
  },
  methods: {
    // 添加好友
    addFriends (row) {
      let data = {
        sourceName: row.sourceName,
        sourceUid: row.sourceUid,
        targetName: row.targetName,
        targetUid: row.targetUid
      }
      this.$api.friends.addFriends(data).then((res) => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改好友请求,同意好友请求
    putFriendsAsk (row, handler) {
      let data = {
        id: row.id,
        sourceMark: '',
        sourceName: row.sourceName,
        sourceUid: row.sourceUid,
        targetMark: '',
        targetName: row.targetName,
        targetUid: row.targetUid,
        isAgree: handler
      }
      // 添加好友
      if (handler === 1) {
        this.addFriends(row)
      }
      // 修改好友请求
      this.$api.friends.putFriendsAsk(data).then((res) => {
        if (res.status) {
          this.getFriendsAskList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除好友请求
    delFriendsAsk (row) {
      let data = {
        id: row.id,
        del: 1
      }
      this.$api.friends.putFriendsAsk(data).then((res) => {
        if (res.status) {
          this.getFriendsAskList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取好友请求列表
    getFriendsAskList () {
      let data = {
        del: 0,
        targetUid: this.user.id
      }
      this.friendsAskList = []
      this.$api.friends.getFriendsAskList(data).then((res) => {
        if (res.status) {
          this.friendsAskList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /* 群组 */
    // 获取群组申请列表
    getGroupAskList () {
      let data = {
        del: 0,
        groupMpId: this.user.id
      }
      this.groupAskList = []
      this.$api.group.getGroupAskList(data).then((res) => {
        if (res.status) {
          this.groupAskList = res.groupAskList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改好友请求,同意好友请求
    putGroupAsk (row, handler) {
      let data = {
        id: row.id,
        isAgree: handler
      }
      // 添加群成员
      if (handler === 1) {
        this.addGroupMember(row)
      }
      // 修改好友请求
      this.$api.group.putGroupAsk(data).then((res) => {
        if (res.status) {
          this.getGroupAskList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加群成员
    addGroupMember (row) {
      let data = {
        user: {
          id: row.user.id
        },
        group: {
          id: row.group.id
        }
      }
      this.$api.group.addGroupMember(data).then((res) => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除群申请
    delGroupAsk (row) {
      let data = {
        id: row.id,
        del: 1
      }
      this.$api.group.putGroupAsk(data).then((res) => {
        if (res.status) {
          this.getGroupAskList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示/隐藏列表
    handleLabelClick (labelName) {
      switch (labelName) {
        case 'friendsAsk':
          this.friendsAskListShow = !this.friendsAskListShow
          break
        case 'groupAsk':
          this.groupAskListShow = !this.groupAskListShow
          break
        default:
          break
      }
    },
    // 关闭侧边栏
    close () {
      this.closeCallback()
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/aside/message.css";
</style>
