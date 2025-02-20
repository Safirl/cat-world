const routes = {
    landing: "/",
    home: "/home",
    letters: "/letters",
    createLetter: "/letters/create",
    showLetter: "/letters/show",
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
    sendLetter: "letter/createletter/",
    showLetter: "letter/showletter/",
    fetchUserLetterUnread: "userLetter/fetchUserLetterUnread/",
    fetchUserLetterRead: "userLetter/fetchUserLetterRead/"
}

export { routes, apiRoutes };
