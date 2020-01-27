import axios from '../axios'

// 登陆方法
export const searchUser = (data) => {
  return axios({
    url: '/user/searchUser',
    method: 'post',
    data
  })
}
