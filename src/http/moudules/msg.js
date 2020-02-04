import axios from '../axios'
/* 消息 */
// 添加消息
export const addMsg = (data) => {
  return axios({
    url: '/msg/addMsg',
    method: 'post',
    data
  })
}

// 获取好友请求列表
export const getMsgList = (data) => {
  return axios({
    url: '/msg/getMsgList',
    method: 'post',
    data
  })
}
