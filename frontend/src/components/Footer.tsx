export default function Footer() {
  return (
    <div className="px-4 sm:px-0">
      <hr className="border-t border-gray-300 dark:border-gray-700 mx-72" />
      <div className="hidden sm:flex sm:items-center sm:justify-center py-4 text-sm gap-2">
        <p className="text-sm leading-5 text-gray-500 dark:text-gray-300 italic text-center">
          &copy; 2023, a Community Center project - all assets and rights
          reserved to ConcernedApe
        </p>
        <img
          className="h-3 w-auto mt-1"
          src="../assets/heart.png"
          alt="Community Center"
        />
      </div>
      <div className="block sm:hidden sm:items-center sm:justify-center py-4 text-sm gap-2">
        <p className="text-sm leading-5 text-gray-500 dark:text-gray-300 italic text-center">
          &copy; 2023, a Community Center project -
        </p>
        <div className="flex items-center justify-center">
          <p className="text-sm leading-5 text-gray-500 dark:text-gray-300 italic text-center">
            all assets and rights reserved to ConcernedApe
          </p>
          <img
            className="h-3 w-auto mt-1 ml-1"
            src="../assets/heart.png"
            alt="Community Center"
          />
        </div>
      </div>
    </div>
  );
}
