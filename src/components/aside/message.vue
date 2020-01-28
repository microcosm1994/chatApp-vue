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
        <div class="box-header">
          好友请求
        </div>
        <div class="box-list">
          <ul>
            <li class="box-list-item" v-for="(item, index) in friendsAskList" :key="index">
              <div class="item-avator">
                <el-avatar shape="square" :size="30" ></el-avatar>
              </div>
              <div class="item-name">
                {{item.sourceUid === user.id ? item.targetName : item.sourceName}}
              </div>
              <div class="item-btn">
                <span class="item-btn-ok">同意</span>
                <span class="item-btn-danger">拒绝</span>
                <span class="item-btn-ignore">忽略</span>
              </div>
            </li>
          </ul>
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
      friendsAskList: []
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
    // 处理好友请求
    addFriendsAsk (row) {
      console.log(row)
      console.log(this.user)
      let data = {
        sourceMark: '',
        sourceName: this.user.nickName,
        sourceUid: this.user.id,
        targetMark: '',
        targetName: row.nickName,
        targetUid: row.id
      }
      this.$api.friends.addFriendsAsk(data).then((res) => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取好友请求列表
    getFriendsAskList () {
      let data = {
        del: 0
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
    handleNodeClick (data) {
      console.log(data)
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
