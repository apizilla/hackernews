console.log(JSON.stringify({
    request: request,
    user: user,
    config: config,
    params: request.params
}))

try {
    setResult(commentNew(
        request.params.currentToken,
        request.params.newsId,
        request.params.comment,
        parseInt(request.params.parentCommentId)
    ))
} catch (e) {
    console.log('Error', JSON.stringify(e), e)
    throw e;
}

function commentNew(currentToken, newsId, comment, parentCommentId) {
    let hasParentComment = parentCommentId > 1;
    let runQueries = [
        {
            "query": "user-by-token",
            "params": {
                "currentToken": currentToken
            }
        },
        {
            "query": "news-single-select",
            "params": {
                "id": newsId
            }
        },
        {
            "query": "comments-count-by-news",
            "params": {
                "newsId": newsId
            }
        }
    ]

    if (hasParentComment) {
        runQueries.push({
            "query": "comments-get-by-id",
            "params": {
                "id": parentCommentId
            }
        })
    }

    let multiRunResponse = multiRun(runQueries);
    let currentUserResponse = multiRunResponse[0];
    let newsResponse = multiRunResponse[1];
    let commentsCount = multiRunResponse[2]
    let parentCommentResponse = hasParentComment ? multiRunResponse[3] : null;

    // console.log('multiRunResponse', JSON.stringify(multiRunResponse))

    //user
    if (currentUserResponse.Error !== null) {
        throw currentUserResponse.Error
    }

    if (parseInt(currentUserResponse.Data.id) < 1) {
        setStatusCode(403)
        throw {
            "msg": "You are not logged in"
        }
    }

    //comments
    if (commentsCount.Error !== null) {
        throw commentsCount.Error
    }

    //news
    if (newsResponse.Error !== null) {
        throw newsResponse.Error
    }

    if (newsResponse.Data.id === undefined) {
        setStatusCode(404)
        throw {
            msg: "News was not found"
        }
    }

    //parent comment
    if (hasParentComment && parentCommentResponse.Error !== null) {
        throw parentCommentResponse.Error
    }

    if (hasParentComment && parentCommentResponse.Data.id === undefined) {
        setStatusCode(404)
        throw {
            msg: "Parent comment was not found"
        }
    }

    //insert
    let newCommentResponse = run("comments-insert", {
        comment: comment,
        userId: currentUserResponse.Data.id,
        newsId: newsResponse.Data.id,
        parentCommentId: hasParentComment ? parentCommentResponse.Data.id : null
    })

    //update commentsCount
    let newsUpdateCommentsCount = run("news-update-comments-count", {
        id: newsId,
        commentsCount: commentsCount.Data.c + 1,
    })

    newsResponse.Data.comments_count++;

    return {
        news: newsResponse.Data,
        comment: newCommentResponse.Data,
    };
}