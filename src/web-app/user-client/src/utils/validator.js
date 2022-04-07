export const usernameIsValid = username => {
    return !isEmpty(username);
}

export const emailIsValid = email => {
    return !isEmpty(email);
}

export const passwordIsValid = password => {
    return !isEmpty(password);
}

export const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
}

export const postIsValid = text => {
    return !isEmpty(text);
}

const isEmpty = string => {
    return !string || string.length === 0 || /^\s*$/.test(string) || !string.trim()
}
