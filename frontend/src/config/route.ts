

const routes = {
    landing: "/",
    home: "/home",
    letters: "/letters",
    login: "/login",
    register: "/register",
    account: "/account"
    
};

const apiRoutes = {
    getFriends: "friend/fetchAll/",
    getUser: "user/fetch/",
    login: "auth/login",
    register: "auth/register",
    status: "auth/status",
}

export { routes, apiRoutes };