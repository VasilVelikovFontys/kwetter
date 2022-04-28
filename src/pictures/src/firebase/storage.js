const firebaseApp = require("./app");
require("firebase/compat/storage");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const fs = require("fs");

const addUserPicture = async (uid, file) => {
    const storage = getStorage(firebaseApp);

    const {mimetype} = file;

    const metadata = {
        contentType: mimetype
    };

    try {
        const userPictureRef = ref(storage, `${uid}`);

        const uploadResponse = await uploadBytes(userPictureRef, fs.readFileSync(file.path), metadata);
        const {error: uploadError} = uploadResponse;

        if (uploadError) return {error: uploadError};

    } catch (error) {
        return {error}
    }

    try {
        const urlResponse = await getUserPicture(uid);
        const {url, error: urlError} = urlResponse;

        if (urlError) return {error: urlError};

        return {url};
    } catch (error) {
        return {error};
    }
}

const getUserPicture = async uid => {
    const storage = getStorage(firebaseApp);

    const userPictureRef = ref(storage, `${uid}`);

    try {
        const url = await getDownloadURL(userPictureRef);

        return {url};
    } catch (error) {
        return {error}
    }
}

module.exports = {
    addUserPicture,
    getUserPicture
};
