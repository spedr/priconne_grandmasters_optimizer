const PageModal = ({
    showModal,
    setShowModal,
    desiredPage,
    handleDesiredPageChange,
    goToDesiredPage,
  }) => {
    return (
      showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="mb-4 text-lg font-semibold">Enter the desired page:</h3>
            <div className="flex items-center">
              <input
                type="number"
                value={desiredPage}
                onChange={handleDesiredPageChange}
                className="border-2 border-gray-300 p-1 rounded-md mr-4 w-20"
              />
              <button
                className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md mr-2"
                onClick={goToDesiredPage}
              >
                Go
              </button>
              <button
                className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  
  export default PageModal;