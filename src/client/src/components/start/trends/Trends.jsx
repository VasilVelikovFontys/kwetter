import React, {useEffect, useState} from 'react'
import '../../../styles/components/start/trends/trends.css';
import {useDispatch, useSelector} from "react-redux";
import {getTrends} from "../../../store/actions/trendActions";
import {getPostsByTrend} from "../../../store/actions/trendPostActions";
import {POSTS_BY_TREND_LIST, TIMELINE_TAB} from "../../../constants";

const Trends = props => {
    const {setTimelineList, setSelectedTab} = props;

    const dispatch = useDispatch();
    const {jwt} = useSelector(state => state.auth);
    const {trends, loading: trendsLoading, error: trendsError} = useSelector(state => state.trends);

    const [styledTrends, setStyledTrends] = useState([]);

    const [error, setError] = useState('');

    const filterByTrend = trendId => {
        setTimelineList(POSTS_BY_TREND_LIST)
        setSelectedTab(TIMELINE_TAB);

        dispatch(getPostsByTrend(trendId))
            .then(() => {
                //No action needed
            });
    }

    useEffect(() => {
        if (jwt) {
            dispatch(getTrends())
                .then(() => {
                    //No action needed
                });
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        if (trendsError) return setError(trendsError);
    }, [trendsError]);

    useEffect(() => {
        const newTrends = trends.map(trend => (
            <div key={trend.id} className='trend' onClick={() => filterByTrend(trend.id)}>
                #{trend.title}
            </div>
        ));

        setStyledTrends(newTrends)
    }, [trends]);

    const displayTrends = () => {
        if (trendsLoading) return <div>Loading...</div>
        if (styledTrends.length === 0) return <div>No existing trends</div>
        return <div>{styledTrends}</div>
    }

    return (
        <>
            <div id='trends'>
                <div id='trends-title'>
                    Trends
                </div>

                {displayTrends()}

                {error && (
                    <div className="trends-error">{error}</div>
                )}
            </div>
        </>
    )
}

export default Trends;
