console.log(JSON.stringify({
    // request: request,
    // user: user,
    // config: config,
    params: request.params
}))

const newsId = request.params.newsId;
const type = "vote";
const withComments = parseInt(request.params.comments) === 1;
const isNewsIdList = newsId != null && newsId.constructor.name === "Array";
let whereCondition = "";
let params = {}

if(isNewsIdList) {
    params.newsId = newsId.map(newsId => {
        return parseInt(newsId)
    })
} else {
    params.newsId = newsId
}

if (!withComments) {
    whereCondition = " AND comment_id IS NULL"
}

let query = "SELECT ucr.comment_id as commentId, ucr.news_id as newsId FROM user_content_rel as ucr where news_id IN(:newsId) AND `type` = :type  " + whereCondition + " limit 300"

params.type = type;
params.name = request.params.name;

setParams(params)
setQuery(query)
