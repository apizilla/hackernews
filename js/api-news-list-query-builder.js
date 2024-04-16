let joinConditions = []
let whereConditions = []
let orderBy = "";
let params = {
    limit: request.params.limit,
    offset: request.params.offset,
};

whereConditions.push("n.visible = 1")

if (request.params.type !== undefined && request.params.type.length > 0) {

    if (request.params.type === "new") {
        orderBy = "ORDER BY n.created_at DESC";
    } else {
        whereConditions.push("n.type = :type")
        params.type = request.params.type;
    }
}

if (request.params.type !== "new") {
    orderBy = "ORDER BY n.news_order DESC"
}

if (request.params.addedByUsername !== undefined && request.params.addedByUsername.length > 0) {
    whereConditions.push("u.username = :addedByUsername")
    params.addedByUsername = request.params.addedByUsername;
}

if (request.params.votedByUsername !== undefined && request.params.votedByUsername.length > 0) {
    whereConditions.push("ucr_u.username = :votedByUsername")
    joinConditions.push("JOIN user_content_rel ucr on ucr.news_id=n.id JOIN user ucr_u on ucr.user_id=ucr_u.id and ucr.type=:ucrType")
    params.votedByUsername = request.params.votedByUsername;
    params.ucrType = "favourite";
}

let query = "SELECT n.*, u.username FROM news n left join user u on u.id=n.user_id " + joinConditions.join(" ") + " where " + whereConditions.join(" AND ") + " " + orderBy + " limit :offset, :limit"
let queryCount = "SELECT count(*) as c FROM news n left join user u on u.id=n.user_id " + joinConditions.join(" ") + " where " + whereConditions.join(" AND ")

setParams(params)
setQuery(query)
setCountQuery(queryCount)