let newsTypes = [
    'news', 'ask', 'show', 'job'
];

let urlValidationTypes = [
    'news', 'show'
];

let titleValidationTypes = [
    'news', 'ask'
];

// console.log(JSON.stringify({
//     request: request,
//     user: user,
//     config: config,
//     params: request.params
// }))

setResult(addNews(
    request.params.token,
    request.params.type,
    request.params.title,
    request.params.url,
    request.params.description,
))

function addNews(currentToken, type, title, url, description) {
    let currentUserData = run("user-by-token", {
        "currentToken": currentToken
    })

    if (parseInt(currentUserData.id) < 1) {
        setStatusCode(403)
        throw {
            "msg": "You are not logged in"
        }
    }

    if (!newsTypes.includes(type)) {
        throw {
            "msg": "Invalid news type provided"
        }
    }

    if (urlValidationTypes.includes(type)) {
        if (!isUrlValid(url)) {
            throw {
                "msg": "Invalid url"
            }
        }
    } else {
        url = ""
    }

    if (titleValidationTypes.includes(type) && !isTitleValid(title)) {
        throw {
            "msg": "Invalid title. Must be at least 10 to 255 characters long"
        }
    }

    let result = run("news-insert", {
        userId: currentUserData.id,
        title: title,
        description: description,
        url: url,
        type: type,
    }).Data

    return result
}

function isUrlValid(url) {
    let regex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/
    return regex.test(url)
}

function isTitleValid(title) {
    return (typeof title === "string" && title.length >= 10 && title.length < 255)
}