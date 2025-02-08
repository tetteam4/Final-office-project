import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPortfolioItems } from "../services/api"; // Import the API function
import CategoryList from "../Components/Portfolio/CategoryList";
import PortfolioCard from "../Components/Portfolio/PortfolioCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PortFolioSliderHero from "../Components/Portfolio/PortFolioSliderHero";
import ProjectNameList from "../Components/Portfolio/ProjectNameList";
import PortfolioFiltering from "../Components/Portfolio/PortfolioFiltering";
import LatestPortfolioWork from "../Components/Portfolio/LatestPortfolioWork";
import TopPortfolioList from "../Components/Portfolio/TopPortfolioList";

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const cardsPerPage = 6;

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPortfolioItems();
        setPortfolioData(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredData =
    selectedCategory === "All"
      ? portfolioData
      : portfolioData.filter(
          (project) => project.category.name === selectedCategory // Access category name
        );

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Function to handle sorting
  const handleSortChange = (sortOption) => {
    let sortedData = [...portfolioData];
    if (sortOption === "A-Z") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    }
    setPortfolioData(sortedData);
  };

  if (loading) {
    return <div>Loading portfolio items...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="mx-auto  max-w-7xl ">
      <div className="py-4">
        <h1 className="text-2xl font-bold">Our Works</h1>
      </div>
      <div className="grid grid-cols-4 max-w-7xl mx-auto h-auto items-start gap-x-3">
        <aside className="col-span-1 border h-auto bg-green-100/95 min-h-0 overflow-auto">
          <CategoryList />
        </aside>

        <div className="col-span-2 border h-[300px] min-h-0 overflow-auto">
          <PortFolioSliderHero Portfolio_Data={portfolioData} />
        </div>

        <aside className="col-span-1 border h-auto bg-green-100/95 min-h-0 overflow-auto">
          <ProjectNameList Portfolio_Data={portfolioData} />
        </aside>
      </div>
      <div>
        <PortfolioFiltering
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          Portfolio_Data={portfolioData}
          onSortChange={handleSortChange}
        />
      </div>
      <div className="grid grid-cols-3 max-w-7xl gap-5 mt-10 mx-auto">
        {currentCards.map((port, index) => (
          <PortfolioCard
            key={index}
            port={port}
            onClick={() =>
              navigate(
                `/portfolio/${port.id}`, // Use project.id here
                {
                  state: { port: port },
                }
              )
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-start items-center my-10 space-x-2">
          {currentPage > 1 && (
            <button
              onClick={handlePreviousPage}
              className="flex items-center px-3 text-sm py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-[#02DB81] hover:text-white transition-all shadow-sm"
            >
              <FaChevronLeft className="mr-2" /> Previous
            </button>
          )}

          {renderPaginationButtons()}

          {currentPage < totalPages && (
            <button
              onClick={handleNextPage}
              className="flex items-center px-3 py-1.5 hover:bg-[#02DB81] rounded-md text-sm bg-white border border-gray-300 text-gray-700 hover:text-white transition-all shadow-sm"
            >
              Next <FaChevronRight className="ml-2 " />
            </button>
          )}
        </div>
      )}

      <div className="mt-10">
        <LatestPortfolioWork Portfolio_Data={portfolioData} />
      </div>
      <div className="mt-10">
        <TopPortfolioList Portfolio_Data={portfolioData} />
      </div>
    </section>
  );

  function renderPaginationButtons() {
    const buttons = [];

    // Always show the first two pages
    for (let i = 1; i <= 2; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 text-xs rounded-md border border-gray-300 font-medium ${
            currentPage === i
              ? "bg-[#02DB81] text-white border-[#02DB81]"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } transition-all shadow-md`}
        >
          {i}
        </button>
      );
    }

    // Add "..." if currentPage is greater than 4 (to avoid overlapping with the first two pages)
    if (currentPage > 4) {
      buttons.push(
        <button
          key="ellipsis-start"
          className="px-2 py-1 text-xs rounded-md  border-gray-300  font-medium bg-white text-gray-700 cursor-default"
          disabled
        >
          ...
        </button>
      );
    }

    // Add current page and its immediate neighbors
    for (
      let i = Math.max(3, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 text-xs rounded-md border border-gray-300  font-medium ${
            currentPage === i
              ? "bg-[#02DB81] text-white border-[#02DB81]"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } transition-all shadow-md`}
        >
          {i}
        </button>
      );
    }

    // Add "..." if currentPage is less than totalPages - 3 (to avoid overlapping with the last two pages)
    if (currentPage < totalPages - 3) {
      buttons.push(
        <button
          key="ellipsis-end"
          className="px-2 py-1 text-xs rounded-md  border-gray-300  font-medium bg-white text-gray-700 cursor-default"
          disabled
        >
          ...
        </button>
      );
    }

    // Always show the last two pages
    for (let i = totalPages - 1; i <= totalPages; i++) {
      if (i > 2) {
        // Avoid duplicating pages already shown
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 py-1 text-xs rounded-md border  border-gray-300  font-medium ${
              currentPage === i
                ? "bg-[#02DB81] text-white border-[#02DB81]"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } transition-all shadow-md`}
          >
            {i}
          </button>
        );
      }
    }

    return buttons;
  }
};

export default Portfolio;
