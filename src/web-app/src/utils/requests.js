export const handleRequestError = (error, dispatch, type) => {
    const {response} = error;
    if (response) {
        switch (response.status) {
            case 400:
            case 403:
            case 404:
                return dispatch({type, error: response.data});

            case 500:
                return dispatch({type, error: "Server Error"});
        }
    } else {
        return dispatch({type, error});
    }
}
