import axios from 'axios'


async function authorization() {
  if(localStorage.getItem('email.myblog') === null) {
    localStorage.clear();
    return [ false, null ]
  }
  let hasLogin = true;
  const currentTime = (new Date()).getTime();
  const expiredTime = Number(localStorage.getItem('expiredTime.myblog'));
  // 如果access token过期则重新更新token
  if(expiredTime <= currentTime) {
    try {
      let response = await axios.post('/api/token/refresh/', {refresh: localStorage.getItem('refresh.myblog')});
      const expiredTime = Date.parse(response.headers.date) + 1000 * 60 * 60 * 10;
      localStorage.setItem('expiredTime.myblog', expiredTime);
      localStorage.setItem('access.myblog', response.data.access);
      hasLogin = true;
    }
    catch(err) {
        console.log(err);
        hasLogin = false;
        localStorage.clear()
    }
  }
  return [ hasLogin, localStorage.getItem('access.myblog') ]
}

export default authorization;