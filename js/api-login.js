// console.log(JSON.stringify({
    // request: request,
    // user: user,
    // config: config,
    // params: request.params
// }))

setResult(login(
    request.params.username,
    request.params.password
))

function login(username, password) {
    let loginData = run("user-login-select", {
        "username": username
    })

    if (loginData.id === undefined) {
        throw {
            "msg": "Invalid login data"
        }
    }

    if (md5(loginData.salt + password) !== loginData.password) {
        throw {
            "msg": "Invalid login data2"
        }
    }

    let currentToken = uuid();
    run("user-login-success", {
        "id": loginData.id,
        "currentToken": currentToken,
    })

    return {
        "currentToken": currentToken
    }
}