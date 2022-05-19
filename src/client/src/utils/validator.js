export const nameIsValid = name => {
    return !isEmpty(name);
}

export const locationIsValid = location => {
    return !isEmpty(location);
}

export const websiteIsValid = website => {
    return !isEmpty(website);
}

export const bioIsValid = bio => {
    return !isEmpty(bio) && bio.length <= 160;
}

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
    return !isEmpty(text) && text.length <= 140;
}

const isEmpty = string => {
    return !string || string.length === 0 || /^\s*$/.test(string) || !string.trim()
}
