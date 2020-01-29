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
      friendsAskListShow: false
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.getFriendsAskList()
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
    handleLabelClick (labelName) {
      switch (labelName) {
        case 'friendsAsk':
          this.friendsAskListShow = !this.friendsAskListShow
          break
        default:
          break
      }
    },
    close () {
      this.closeCallback()
    }
  }
}
</script>

<style scoped>
  @import "../../assets/css/aside/message.css";
</style>
