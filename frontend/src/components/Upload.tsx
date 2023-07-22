import Select from './Select'

export default function Upload() {
  return (
    <div className="mt-48 mx-auto max-w-2xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition ease-in-out duration-150">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">drag a Stardew Valley save file here, or click to upload</p>
            </div>
            <input id="dropzone-file" type="file" accept=".XML" className="hidden" />
        </label>
      </div>
      <div className="flex gap-4 justify-center mt-4 h-9">
        <Select />
        <button
          type="button"
          className="rounded-md px-3 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-700 text-white transition ease-in-out duration-150"
        >
          Generate Farmer
        </button>
      </div>
    </div>
  )
}