const routes = {
    landing: "/",
    home: "/home",
    letters: "/letters",
    createLetter: "/letters/create",
    showLetter: "/letters/show",
    login: "/login",
    register: "/register",
    account: "/account",
    showFriend: "/show-friend"
};

const apiRoutes = {
    getFriends: "friend/fetchAll/",
    getUser: "user/fetch/",
    login: "auth/login/",
    register: "auth/register/",
    status: "auth/status/",
    sendLetter: "letter/createletter/",
    showLetter: "letter/showletter/",
    getLetterImage: "letter/getImageUrl/",
    updateRead: "userLetter/updateUserLetter/",
    fetchLetterRead: "letter/getReadLetters/",
    fetchLetterUnread: "letter/getUnreadLetters/",
    addFriend: "friend/addfriend",
    changeCatColor: "user/colorcat/",
    logout: "auth/logout"
}

export { routes, apiRoutes };
