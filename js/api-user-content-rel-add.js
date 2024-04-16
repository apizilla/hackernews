let output = {}

console.log(JSON.stringify({
    request: request,
    user: user,
    config: config,
    params: request.params
}))

let firstQuery = {
    "params": {
        token: request.params.token,
        type: request.params.type,
        newsId: request.params.newsId,
        commentId: request.params.commentId,
    }
}

if (parseInt(request.params.newsId) > 0 && parseInt(request.params.commentId) > 0) {
    firstQuery.query = "user-content-rel-fetch-single-comment-by-token"
} else {
    firstQuery.query = "user-content-rel-fetch-single-news-by-token"
}

let multiRunOutput = multiRun([
    firstQuery,
    {
        "query": "user-by-token",
        "params": {"token": request.params.token}
    },
    {
        "query": "comments-get-by-id",
        "params": {"id": request.params.commentId}
    },
    {
        "query": "news-single-select",
        "params": {"id": request.params.newsId}
    },
])

if (multiRunOutput[1].Error !== null) {
    throw multiRunOutput[1].Error;
}

let userContentRelData = multiRunOutput[0].Data;
let userData = multiRunOutput[1].Data;
let commentData = multiRunOutput[2].Data;
let newsData = multiRunOutput[3].Data;

if (
    (commentData.id === undefined || commentData.id === null) &&
    (newsData.id === undefined || newsData.id === null)
) {
    setStatusCode(404)
    throw {
        "msg": "Neither news nor comment was found"
    }
}

if (userContentRelData.id !== undefined && userContentRelData.id !== null) {
    setStatusCode(400);
    userContentRelData.msg = "You already voted on this piece of content";
    throw userContentRelData
}

let currentTransaction = transaction("hacker-news-sql")
try {

    let insertData = {
        "userId": userData.id,
        "newsId": null,
        "commentId": null,
        "vote": 1,
        "report": null
    };

    if (commentData.id !== undefined && commentData.id !== null) {
        insertData.commentId = commentData.id;
    }
    if (newsData.id !== undefined && newsData.id !== null) {
        insertData.newsId = newsData.id;
    }

    let insertOutput = currentTransaction.run("user-content-rel-insert-insert", insertData).Data

    output = insertOutput;

    currentTransaction.commit()
} catch (e) {
    currentTransaction.rollback()
    throw {"error": "an error had occurred"}
}

setStatusCode(200)
setResult(output)