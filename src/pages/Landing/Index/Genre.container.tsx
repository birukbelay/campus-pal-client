import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootS} from "../../../app/rootReducer";
// import {Query, Status} from "../../../../features/utils";
import {ItemFilter} from "../../../features/Item/itemModel";
import {fetchItems} from "../../../features/Item/item.reducer";
import {fetchTags} from "../../../features/tags/tags.reducer";

import {Link} from "react-router-dom";


const GenreContainer = () => {
    const dispatch = useDispatch();
    const { tags} = useSelector(
        (state: RootS) => state.tags
    )
    const [queryCtr, setQueryCtr] = useState(0)
    useEffect(() => {
        if (tags.length < 1 && queryCtr < 5) {
            dispatch(fetchTags())
            setQueryCtr(queryCtr + 1)
            // dispatch(LOG_g("questions", questions))
        }
        // Since we may have the issue already, ensure we're scrolled to the top
        window.scrollTo({top: 0})
    }, [dispatch, tags])


    // const {filter} =useSelector(
    //     (state:RootS)=> state.items
    // )
    // let validQuery= !!(queryType === Query.CREATE || Query.UPDATE)
    // let loading = loadingStatus === Status.LOADING && validQuery

    const setFilter = (id) => {
        const set = () => {
        }
        const query: ItemFilter = {
            // ...filter,
            tags: id,
            page: 1,
            lastPageReached: false
        }
        dispatch(fetchItems(query, set))

    }

    return (
        <div className=" m-2 px-6 mx-4">

            <div className="mx-auto flex flex-col items-center  justify-center h-full">
                <h2> Tags</h2>
                <div className="grid grid-cols-2 items-center sm:grid-cols-3 md:grid-cols-5 justify-around  lg:grid-cols-7 gap-8">
                    {
                        tags.map(genre =>
                            <GenresItem
                                key={genre._id}
                                genre={genre}
                                setFilter={setFilter}
                            />
                        )
                    }

                </div>
            </div>
        </div>
    )
}

const GenresItem = ({genre, setFilter}) => {
    return (

        <>
            <Link onClick={() => setFilter(genre.id)} to={`/items?genres=${genre.id}`}>
                <div className="p-1 flex flex-col items-center  rounded-xl justify-center  items-center hover:shadow-lg ease-in duration-300">
                    <img
                        className=" p-1 shadow-xl shadow-gray-400 rounded-full hover:scale-110 ease-in duration-300 catagory-im"
                        src={genre.poster} alt=""/><br/>
                    <span className="">{genre.name}</span>

                </div>
            </Link>
        </>


    )
}
export default GenreContainer