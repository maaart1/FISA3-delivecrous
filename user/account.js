import jwt from 'jsonwebtoken'


function createToken(user) {
    const token = jwt.sign({
        id: user.id,
        login: user.login
    }, process.env.SECRET_KEY, {expiresIn: '1 hours'})

    return token
}

function decodeToken(request, response) {
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)
    const decoded_token = jwt.decode(token, {complete: false})
    return decoded_token;
}

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

function checkToken(request, response, next) {
    const token = request.headers.authorization && extractBearerToken(request.headers.authorization)

    if (!token) {
        return response.status(401).json({message: 'Error: You need token to access :/'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded_token) => {
        if (err) {
            response.status(401).json({message: 'Error: Bad token :('})
        } else {
            return next()
        }
    })
}


export {createToken, checkToken, decodeToken, extractBearerToken}
