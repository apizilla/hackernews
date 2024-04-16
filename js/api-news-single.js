let
    commentTreeHelpers = require("./js/commentTree.js"),
    newsId = request.params.id
;

setResult(fetchData(newsId));

function fetchData(newsId) {
    let queries = [
        {
            "query": "news-single-select",
            "params": {"id": newsId}
        }, {
            "query": "comments-query-builder",
            "params": {
                "news": newsId,
                "paginated": false
            }
        },
    ];

    let multiRunOutput = multiRun(queries)
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

    let comments = commentTreeHelpers.commentTree(multiRunOutput[1].Data)

    return {
        news: newsResponse.Data,
        comments: comments
    }
}