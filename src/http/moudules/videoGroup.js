import axios from '../axios'
/* 群组 */
// 添加会议室
export const addVideoGroup = (data) => {
  return axios({
    url: '/group/addVideoGroup',
    method: 'post',
    data
  })
}

// 搜索会议室
export const searchVideoGroup = (data) => {
  return axios({
    url: '/group/searchVideoGroup',
    method: 'post',
    data
  })
}

// 获取会议室列表
export const getVideoGroupList = (data) => {
  return axios({
    url: '/group/getVideoGroupList',
    method: 'post',
    data
  })
}

// 删除会议室
export const delVideoGroup = (data) => {
  return axios({
    url: '/group/delVideoGroup',
    method: 'post',
    data
  })
}

// 新增视频会议成员
export const addVideoGroupMember = (data) => {
  return axios({
    url: '/group/addVideoGroupMember',
    method: 'post',
    data
  })
}

// 获取视频会议成员
export const getVideoGroupUserList = (data) => {
  return axios({
    url: '/group/getVideoGroupUserList',
    method: 'post',
    data
  })
}

// 移除视频会议成员
export const delVideoGroupUser = (data) => {
  return axios({
    url: '/group/delVideoGroupUser',
    method: 'post',
    data
  })
}
