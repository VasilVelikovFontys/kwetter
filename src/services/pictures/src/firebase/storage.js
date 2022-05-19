const firebaseApp = require("./app");
require("firebase/compat/storage");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const fs = require("fs");
const {handleError} = require("../utils/errorHandler");

const addUserPicture = async (userId, file) => {
    const storage = getStorage(firebaseApp);

    const {mimetype} = file;

    const metadata = {
        contentType: mimetype
    };

    try {
        const userPictureRef = ref(storage, `${userId}`);

        const {error: uploadError} = await uploadBytes(userPictureRef, fs.readFileSync(file.path), metadata);
        if (uploadError) return handleError(uploadError);

    } catch (error) {
        return handleError(error);
    }

    try {
        const {url, error: urlError} = await getUserPicture(userId);
        if (urlError) return handleError(urlError);

        return {url};

    } catch (error) {
        return handleError(error);
    }
}

const getUserPicture = async userId => {
    const storage = getStorage(firebaseApp);

    const userPictureRef = ref(storage, `${userId}`);

    try {
        const url = await getDownloadURL(userPictureRef);
        return {url};

    } catch (error) {
        return handleError(error);
    }
}

const deleteUserPicture = async userId => {
    const storage = getStorage(firebaseApp);

    const userPictureRef = ref(storage, `${userId}`);

    try {
        await deleteObject(userPictureRef);

    } catch (error) {
        return handleError(error);
    }
    return {};
}

module.exports = {
    addUserPicture,
    getUserPicture,
    deleteUserPicture
};
