let
    commentTreeHelpers = require("./js/commentTree.js"),
    commentId = request.params.id
;

setResult(fetchComment(commentId));

function fetchComment(commentId) {
    let singleComment = run("comments-get-by-id", {"id": commentId})

    if (singleComment.id === undefined) {
        setStatusCode(404);
        throw {
            "msg": "Comment was not found"
        }
    }

    let multiRunOutput = multiRun([
        {
            "query": "news-single-select",
            "params": {"id": singleComment.news_id}
        }, {
            "query": "comments-query-builder",
            "params": {
                "news": singleComment.news_id,
                "paginated": false
            }
        },
    ])

    let newsResponse = multiRunOutput[0];
    let commentsResponse = multiRunOutput[1];

    if (newsResponse.Error !== null) {
        throw newsResponse.Error
    }

    if (commentsResponse.Error !== null) {
        throw newsResponse.Error
    }

    if (newsResponse.Data.id === undefined) {
        setStatusCode(404)
        throw {
            "msg": "News was not found"
        }
    }

    let fullComment = commentTreeHelpers.getBaseCommentWithChildren(singleComment, commentsResponse.Data)

    return {
        news: newsResponse.Data,
        comment: fullComment
    }
}