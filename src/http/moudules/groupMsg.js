import axios from '../axios'
/* 群组 */
// 添加群消息
export const addGroupMsg = (data) => {
  return axios({
    url: '/group/addGroupMsg',
    method: 'post',
    data
  })
}

// 获取群组列表
export const getGroupMsgList = (data) => {
  return axios({
    url: '/group/getGroupMsgList',
    method: 'post',
    data
  })
}

// 按群名称搜索群
export const searchGroup = (data) => {
  return axios({
    url: '/group/searchGroup',
    method: 'post',
    data
  })
}
