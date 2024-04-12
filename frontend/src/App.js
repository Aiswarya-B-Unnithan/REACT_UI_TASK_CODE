import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [allPagesLoaded, setAllPagesLoaded] = useState(false);
  const fetchCalled = useRef(false); 

  const formatDate = (dateString) => {
    return moment(dateString).format("MMM DD, YYYY hh:mm A [IST]");
  };

  const toggleFullTitle = (index) => {
    const updatedArticles = articles.map((article, i) => {
      if (i === index) {
        return { ...article, showFullTitle: !article.showFullTitle };
      }
      return article;
    });
    setArticles(updatedArticles);
  };

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchData();
      fetchCalled.current = true;
    }
  }, []); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/photo-gallery-feed/${page}`
      );
      const data = await response.json();
      console.log(data);
      if (data.nodes.length === 0) {
        setAllPagesLoaded(true);
      } else {
        setArticles((prevArticles) => [
          ...prevArticles,
          ...data.nodes.map((item) => item.node),
        ]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 mx-auto max-w-xl">
      {articles.map((article, index) => (
        <div key={article.nid} className="flex justify-center my-12 w-full">
          <div className="flex items-center overflow-hidden">
            <img
              src={article.field_photo_image_section}
              alt={article.title}
              className="w-56 h-56 mr-4 object-fill"
              style={{ borderRadius: "45px" }}
            />
            <div className="flex flex-col">
              <h3
                onClick={() => toggleFullTitle(index)}
                className="cursor-pointer text-lg font-bold text-gray-900 mb-1"
                style={{ fontSize: "1.4rem" }}
              >
                {article.showFullTitle
                  ? article.title
                  : article.title
                  ? article.title.slice(0, 50) + "..."
                  : ""}
              </h3>
              <p className="text-gray-900" style={{ paddingTop: "5px",fontSize:'1.2rem' }}>
                {formatDate(article.last_update)}
              </p>
              <a href={article.path}>Read More</a>
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-center my-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      )}
      {allPagesLoaded && !loading && (
        <p className="text-center mt-8 text-gray-500 font-bold text-xl">END</p>
      )}
      {!allPagesLoaded && (
        <InfiniteScroll
          dataLength={articles.length} 
          next={fetchData}
          hasMore={!allPagesLoaded}
        />
      )}
    </div>
  );
};

export default App;
