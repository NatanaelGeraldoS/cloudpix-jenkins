const LoadingScreen = () => (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Please wait...</p>
    </div>
  </div>
);

export default LoadingScreen;
