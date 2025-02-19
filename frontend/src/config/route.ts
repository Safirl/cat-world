

const routes = {
    landing: "/",
    home: "/home",
    letters: "/letters",
    createLetter: "/letters/create",
    login: "/login",
    register: "/register",
    account: "/account"
    
};

const apiRoutes = {
    getFriends: "friend/fetchAll/",
    getUser: "user/fetch/",
    login: "auth/login/",
    register: "auth/register/",
    status: "auth/status/",
    sendLetter: "letter/createletter/"
}

export { routes, apiRoutes };