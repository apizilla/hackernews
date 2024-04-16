module.exports = {
    commentTree: commentTree,
    getBaseCommentWithChildren: getBaseCommentWithChildren,
};

function commentTree(comments) {

    let commentMap = {}
    let topCommentMap = []

    comments.map(comment => {
        commentMap[comment.id] = []
    })

    comments.map(comment => {
        if (commentMap[comment.parent_comment_id] !== undefined) {
            commentMap[comment.parent_comment_id].push(comment)
        } else {
            topCommentMap.push(comment)
        }
    })

    return handleRecurringCommentTree(topCommentMap, commentMap);
}

function getBaseCommentWithChildren(baseComment, comments) {
    let commentMap = {}
    let baseCommentMap = [baseComment]

    comments.map(comment => {
        commentMap[comment.id] = []
    })

    comments.map(comment => {
        if (commentMap[comment.parent_comment_id] !== undefined) {
            commentMap[comment.parent_comment_id].push(comment)
        }
    })

    let commentList = handleRecurringCommentTree(baseCommentMap, commentMap)
    return commentList[0]
}


function handleRecurringCommentTree(comments, commentMap) {
    if (comments.length === 0) {
        return []
    }

    return comments.map(comment => {
        comment.children = handleRecurringCommentTree(commentMap[comment.id] !== undefined ? commentMap[comment.id] : [], commentMap)
        return comment;
    })
}