import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const pathsToRoles = [
//     {path: '/', role: ['USER', 'ADMIN']},
// ]

// userInfo가 null이면 로컬 스로리지 삭제
const setUserInfo = (userInfo) => {
    if (userInfo && userInfo.accessToken && userInfo.refreshToken) {
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else{
        window.localStorage.removeItem('userInfo');
    }
}

const getUserInfo = () => {
    let strUserInfo = window.localStorage.getItem('userInfo');
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
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
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
    const config = {
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`,
        },
    };

    const response = await axios.post(url, {}, config);

    setUserInfo(null);  // 로컬 스토리지 삭제
    callback();
}

const refreshToken = async () => {
    const url = "http://localhost:8087/auth/refresh";
    const refreshToken = getUserInfo().refreshToken;
    const config = {
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${refreshToken}`,
        },
    };

    try {
        const response = await axios.post(url, {}, config);
        const user = response.data;
        if (user) {
            let newUserInfo = {
                authenticated: true,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken
            };
            setUserInfo(newUserInfo);
        } else {
            setUserInfo(null);
        }
    } catch (error) {
        setUserInfo(null);
    }
}

const getUsernameFromToken = () => {
    const userInfo = getUserInfo();
    const token = userInfo?.accessToken;

    if (!token) {
        console.warn("❗ 토큰이 존재하지 않습니다.");
        return null;
    }

    try {
        const decoded = jwtDecode(token);  // 🔥 JWT 디코딩
        console.log("🔎 디코딩된 JWT 정보:", decoded);  // 🔥 디버깅 포인트
        return decoded.username || null;     // 🔥 username 반환
    } catch (error) {
        console.warn("❗ JWT 디코딩 실패:", error);
        return null;
    }
}


export { getUserInfo, loginProcess, logoutProcess, refreshToken, getUsernameFromToken }