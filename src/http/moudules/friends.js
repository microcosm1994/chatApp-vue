import axios from '../axios'

// 添加好友请求
export const addFriendsAsk = (data) => {
  return axios({
    url: '/friends/addFriendsAsk',
    method: 'post',
    data
  })
}

// 获取好友请求列表
export const getFriendsAskList = (data) => {
  return axios({
    url: '/friends/getFriendsAskList',
    method: 'post',
    data
  })
}

// 添加好友
export const addFriends = (data) => {
  return axios({
    url: '/friends/addFriends',
    method: 'post',
    data
  })
}

// 获取好友列表
export const getFriendsList = (data) => {
  return axios({
    url: '/friends/getFriendsList',
    method: 'post',
    data
  })
}
