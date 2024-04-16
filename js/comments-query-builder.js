// console.log("query builder test", JSON.stringify(request.params))

let whereConditions = [];
let params = {
    offset: parseInt(request.params.offset),
    limit: parseInt(request.params.limit)
}

if (request.params.username !== undefined && request.params.username.length > 0) {
    whereConditions.push("u.username = :username");
    params.username = request.params.username;
}

if (request.params.news !== undefined) {
    whereConditions.push("n.id = :news");
    params.news = parseInt(request.params.news);
}

let whereConditionsString = whereConditions.length > 0 ? " where " + whereConditions.join(" AND ") : '';
let query = "SELECT c.*, u.username FROM comment c left join user u on u.id=c.user_id  left join news n on c.news_id = n.id" + whereConditionsString + " order by id asc "
let queryCount = "SELECT count(*) as count FROM comment as c left join user u on u.id=c.user_id  left join news n on c.news_id = n.id " + whereConditionsString

if(request.params.paginated) {
    query += " limit :offset, :limit"
}

// console.log(query)

setParams(params)
setQuery(query)

if (request.params.paginated) {
    setCountQuery(queryCount)
}