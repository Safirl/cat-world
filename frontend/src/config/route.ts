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
    fetchLetterUnread: "letter/getUnreadLetters/",
    fetchLetterRead: "letter/getReadLetters/",
    updateRead: "userLetter/updateUserLetter/"
}

export { routes, apiRoutes };
