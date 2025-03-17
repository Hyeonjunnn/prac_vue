import axios from 'axios';

// const pathsToRoles = [
//     {path: '/', role: ['USER', 'ADMIN']},
// ]

// userInfo가 null이면 로컬 스로리지 삭제
const setUserInfo = (userInfo) => {
    if (userInfo && userInfo.accessToken) {
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else{
        window.localStorage.removeItem('userInfo');
    }
}

const getUserInfo = () => {
    let strUserInfo = window.localStorage.getItem('userInfo');
    console.log(strUserInfo);
    if (!strUserInfo) {
        return { authenticated: false };
    } else {
        return JSON.parse(strUserInfo);
    }
}

const loginProcess = async (username, password, successCallback, failCallback) => {
    const url = "http://localhost:8087/auth/login";
    const data = {username, password};

    const response = await axios.post(url, data);
    const user = response.data;
    if (user) {
        let userInfo = {
            authenticated: true,
            accessToken: user.accessToken
        };
        setUserInfo(userInfo);
        successCallback();
    } else {
        if (failCallback) failCallback();
    }
}

const logoutProcess = async (callback) => {
    const url = "http://localhost:8087/auth/logout";
    const token = getUserInfo().accessToken;
    console.log('123');
    const config = {
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`,
        },
    };

    const response = await axios.post(url, {}, config);
    console.log(response);

    setUserInfo(null);  // 로컬 스토리지 삭제
    callback();
}

// // 경로와 사용자 정보의 role을 기반으로 접근 허가 여부 결정(true/false)
// const isMatchToRole = (reqPath) => {
//     // { path: '/', role: ['USER', 'ADMIN'] 
//     const path = pathsToRoles.find((path) => path.path === reqPath);
//     // 경로가 없다면 접근 불가
//     if (!path) return false;

//     const userInfo = getUserInfo();
//     // 인증되지 않앗다면 everybody 가 지정된 경로만 접근 가능
//     if (userInfo.authenticated === false) {
//         return path.role.find((p) => p === 'EVERYBODY') ? true : false;
//     } else {
//         // 인증이 되었다면 userInfo의 role와 path.role에 동일한 것이 있어야 함.
//         let isAccessible = false;
//         if (path.role.indexOf('everybody') > -1) {
//             isAccessible = true;
//         } else {

//         }
//         return isAccessible;
//     }
// }

// const refreshToken = () => {
//     const url = "http://localhost:8087/auth/refresh";
//     const token = getUserInfo().accessToken;
//     const config = {
//         headers: {
//             'Content-Type': 'text/plain',
//             'Authorization': `Bearer ${token}`,
//         },
//     };

//     axios.post(url, {}, config).then((response) => {
//         const user = response.data;
//         if (user) {
//             let userInfo = {
//                 authenticated: true,
//                 accessToken: user.accessToken
//             };
//             setUserInfo(userInfo);
//         } else {
//             setUserInfo(null);
//         }
//     }).catch((error) => {
//         console.error(error);
//         setUserInfo(null);
//     });

// }

export { isMatchToRole, getUserInfo, loginProcess, logoutProcess }