// console.log(JSON.stringify({
//     request: request,
//     user: user,
//     config: config,
//     params: request.params
// }))


setResult(register(
    false, //enable if you'd like to enable emails too
    request.params.email,
    request.params.username,
    request.params.password
))

function register(useEmail, email, username, password) {

    let currentToken = uuid(),
        salt = md5(uuid()),
        usernameOk = (typeof username === "string" && username.length >= 4),
        passwordOk = (typeof password === "string" && password.length >= 4),
        emailOk = (typeof email === "string" && email.length >= 5) && isEmailValid(email);

    if (!passwordOk) {
        throw {
            "msg": "Password must have at least 4 characters"
        }
    }

    if (!usernameOk) {
        throw {
            "msg": "Username must have at least 4 characters"
        }
    }


    if (useEmail && !emailOk) {
        throw {
            "msg": "Email is invalid"
        }
    }

    let existingUser = run("user-register-select", {
        "email": useEmail ? email : '',
        "username": username,
    })

    console.log(JSON.stringify(existingUser))

    if (existingUser.id !== undefined) {
        throw {
            "msg": "User with this email or login already exist"
        }
    }

    let userInsert = run("user-register-insert", {
        "username": username,
        "email": useEmail ? email : '',
        "salt": salt,
        "password": md5(salt + password),
        "currentToken": currentToken
    })

    return {
        id: userInsert.Data.id,
        currentToken: userInsert.Data.current_token
    }
}

function isEmailValid(input) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(input)
}