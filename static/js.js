function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkAuth(forceRedirect = true) {
    return fetch("/api/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": getCookie('token')
        }
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
    }).then(data => {

        if (data.json.id === undefined || data.json.id === null) {
            if (forceRedirect) {
                window.location.href = "/login.html";
            }
        }

        return data;

    }).catch(error => {
        console.log("err", error)
        alert("Something went wrong")
    });
}


function fetchNews(page, newsType, addedByUsername) {
    const params = {
        page: page,
        limit: 30,
    };

    if (addedByUsername !== null && addedByUsername !== undefined && addedByUsername !== "") {
        params.addedByUsername = addedByUsername;
    }

    if (newsType !== null && newsType !== undefined && newsType !== "") {
        params.type = newsType;
    }

    return fetch(
        "/api/news?" + new URLSearchParams(
            params
        ),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
        return new Promise((resolve) => response.json()
            .then((json) => resolve({
                status: response.status,
                ok: response.ok,
                json,
            }))
        );
    });
}


function addComment(id, commentId, content) {

    let jsonBody = {
        newsId: newsId,
        comment: content,
    };

    if (commentId > 0) {
        jsonBody["parentCommentId"] = commentId;
    }

    return fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": getCookie('token')
        },
        body: JSON.stringify(jsonBody)
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
    });
}


function fetchByComment(id) {
    return fetch("/api/comments/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
    })
}

function fetchSingleNews(id) {
    return fetch("/api/news/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
    });
}


function vote(newsId, commentId) {

    let jsonBody = {
        newsId: newsId,
        type: "vote"
    };

    if (commentId > 0) {
        jsonBody["commentId"] = commentId;
    }

    return fetch("/api/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": getCookie('token')
        },
        body: JSON.stringify(jsonBody)
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => resolve({
            status: response.status,
            ok: response.ok,
            json,
        })));
    });
}

function fetchVotes(ids, withComments) {

    return fetch("/api/vote?" + new URLSearchParams({
        "newsId": ids,
        "comments": parseInt(withComments)
    }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": getCookie('token')
        },
    }).then((response) => {
        return new Promise((resolve) => response.json().then((json) => {
                let newsIds = json.filter(row => row.newsId !== null && row.commentId === null).map(row => row.newsId)
                let commentIds = json.filter(row => row.newsId !== null && row.commentId !== null).map(row => row.commentId)

                resolve({
                    newsIds: newsIds,
                    commentIds: commentIds
                })
            })
        );
    });
}