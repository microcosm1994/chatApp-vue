import axios from '../axios'
/* 群组 */
// 添加群组
export const addGroup = (data) => {
  return axios({
    url: '/group/addGroup',
    method: 'post',
    data
  })
}

// 添加群成员
export const addGroupMember = (data) => {
  return axios({
    url: '/group/addGroupMember',
    method: 'post',
    data
  })
}

// 获取群组列表
export const getGroupList = (data) => {
  return axios({
    url: '/group/getGroupList',
    method: 'post',
    data
  })
}

// 获取群成员
export const getGroupUserList = (data) => {
  return axios({
    url: '/group/getGroupUserList',
    method: 'post',
    data
  })
}

// 移除群成员
export const delGroupUser = (data) => {
  return axios({
    url: '/group/delGroupUser',
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

/* 群组申请 */
// 新增群申请
export const addGroupAsk = (data) => {
  return axios({
    url: '/group/addGroupAsk',
    method: 'post',
    data
  })
}

// 获取群申请
export const getGroupAskList = (data) => {
  return axios({
    url: '/group/getGroupAskList',
    method: 'post',
    data
  })
}

// 获取群申请
export const putGroupAsk = (data) => {
  return axios({
    url: '/group/putGroupAsk',
    method: 'post',
    data
  })
}
