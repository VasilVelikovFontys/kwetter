import React, {useEffect, useState} from "react";
import '../../styles/components/auth/authenticatedSearch.css';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/actions/authActions";
import algoliasearch from "algoliasearch/lite";
import {envGet} from "../../utils/envHelper";
import {SET_SEARCH_POSTS, SET_SEARCH_POSTS_ERROR, SET_SEARCH_POSTS_LOADING} from "../../constants";
import {useNavigate} from "react-router-dom";

const AuthenticatedSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user} = useSelector(state => state.currentUser);

    const [searchClient, setSearchClient] = useState(null);
    const [postsIndex, setPostsIndex] = useState(null);
    const [query, setQuery] = useState('');

    const handleLogOut = () => {
        dispatch(logOut());
    }

    const handleOptionSelect = e => {
        if(e.target.value === 'Log Out') {
            handleLogOut();
        }
    }

    const handleInput = async e => {
        setQuery(e.target.value);
    }

    const handleSearch = async () => {
        navigate('/start');

        dispatch({type: SET_SEARCH_POSTS_LOADING});

        try {
            const result = await postsIndex.search(query);
            const hits = result.hits;

            dispatch({type: SET_SEARCH_POSTS, posts: hits});
        } catch (error) {
            dispatch({type: SET_SEARCH_POSTS_ERROR, error});
        }
    }

    useEffect(() => {
        if (!searchClient) {
            const client = algoliasearch(envGet('ALGOLIA_APP_ID'), envGet('ALGOLIA_SEARCH_KEY'));
            setSearchClient(client);
        }
    }, []);

    useEffect(() => {
        if (searchClient) {
            const index = searchClient.initIndex('posts');
            setPostsIndex(index);
        }
    }, [searchClient]);

    return (
        <div id='authenticated-search'>
            <div>
                <input placeholder='Search' className='search' value={query} onChange={handleInput}/>
                <i className="fa-solid fa-magnifying-glass" onClick={handleSearch} />
            </div>

            <select onChange={handleOptionSelect}>
                <option>
                    {user ? user.username : 'Loading...'}
                </option>
                <option>
                    Log Out
                </option>
            </select>
        </div>
    )
}

export default AuthenticatedSearch
