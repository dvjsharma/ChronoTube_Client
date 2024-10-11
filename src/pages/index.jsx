import React, { useEffect, useState } from "react";
import { fetchVideosService } from "../api/youtubeService";
import { cronServiceButton } from "../api/cronService";

const VideoLibraryApp = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [totalVideos, setTotalVideos] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVideos = async (isSearch = false) => {
        setIsLoading(true);

        try {
            const response = await fetchVideosService(
                page,
                limit,
                sortOrder,
                isSearch ? searchQuery : ""
            );
            setVideos(response.data.videos);
            setTotalVideos(response.data.total);
        } catch (error) {
            console.error("Error fetching videos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [page, limit, sortOrder]);

    const handleSearch = () => {
        setPage(1);
        fetchVideos(true);
    };

    const resetSearch = () => {
        setSearchQuery("");
        setPage(1);
        fetchVideos();
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        setPage(1);
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    };

    const startCronJob = async () => {
        try {
            await cronServiceButton(`query=${searchQuery}`, "start");
            alert("Cron job started!");
        } catch (error) {
            console.error("Error starting cron job:", error);
            alert("Failed to start cron job.");
        }
    };

    const stopCronJob = async () => {
        try {
            await cronServiceButton("", "stop");
            alert("Cron job stopped!");
        } catch (error) {
            console.error("Error stopping cron job:", error);
            alert("Failed to stop cron job.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-screen-xl p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
                    ChronoTube
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md md:col-span-1">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            Dashboard
                        </h2>
                        <div className="flex space-x-4 mb-6">
                            <button
                                className="inline-block bg-gray-800 border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-[12px] font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-white hover:text-gray-800 focus:bg-white focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900"
                                onClick={startCronJob}
                            >
                                Start Cron
                            </button>
                            <button
                                className="inline-block bg-gray-800 border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-[12px] font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-white hover:text-gray-800 focus:bg-white focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900"
                                onClick={stopCronJob}
                            >
                                Stop Cron
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search videos..."
                            className="border rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="flex space-x-4 mb-4">
                            <button
                                className="inline-block bg-gray-900 border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-[12px] font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-white hover:text-gray-900 focus:bg-white focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                            <button
                                className="inline-block bg-gray-900 border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-[12px] font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-white hover:text-gray-900 focus:bg-white focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900"
                                onClick={resetSearch}
                            >
                                Reset
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-gray-900">
                                Sort by:
                            </label>
                            <select
                                className="bg-gray-900 border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="desc">Ascending</option>
                                <option value="asc">Descending</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-gray-900">
                                Videos per page:
                            </label>
                            <select
                                className="bg-gray-900 border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={limit}
                                onChange={handleLimitChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {/* Videos section taking more space */}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="text-center col-span-1 md:col-span-2">
                                <div
                                    role="status"
                                    className="inline-flex items-center w-12 h-12 border-b-4 border-blue-600 rounded-full animate-spin"
                                >
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-2 text-gray-600">Loading...</p>
                            </div>
                        ) : (
                            videos.map((video) => (
                                <div
                                    key={video.videoId}
                                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
                                >
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="rounded-lg mb-4"
                                    />
                                    <h2 className="text-xl font-semibold mb-2 text-gray-900">
                                        {video.title}
                                    </h2>
                                    <p className="mb-2 text-gray-600">
                                        {video.description}
                                    </p>
                                    <p className="text-gray-800">
                                        {new Date(
                                            video.publishedAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        className=" hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-l-lg transition duration-200"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className=" text-gray-900 font-bold py-2 px-4 flex items-center">
                        Page {page} of {Math.ceil(totalVideos / limit)}
                    </span>
                    <button
                        className=" hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-r-lg transition duration-200"
                        onClick={() => setPage(page + 1)}
                        disabled={page * limit >= totalVideos}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoLibraryApp;
