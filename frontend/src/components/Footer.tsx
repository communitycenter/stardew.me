export default function Footer() {
    return (
      <footer className="bg-white" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-12 lg:px-8 text-center">
          <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
            <div className="flex justify-center mx-auto gap-1">
              <p className="text-sm leading-5 text-gray-500 italic">&copy; 2023, a Community Center project - all assets and rights reserved to ConcernedApe</p>
              <img className="h-3 w-auto mt-1" src="../assets/heart.png" alt="Community Center" />
            </div>
          </div>
        </div>
      </footer>
    )
  }
  