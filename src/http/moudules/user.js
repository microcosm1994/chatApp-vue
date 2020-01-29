import axios from '../axios'

// 搜索用户
export const searchUser = (data) => {
  return axios({
    url: '/user/searchUser',
    method: 'post',
    data
  })
}
