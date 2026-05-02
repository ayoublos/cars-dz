const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/40";

const labelClassName =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

export default function AddACar() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Add a car
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Fill in the details below. You can wire this form to Supabase later.
          </p>
        </header>

        <form className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelClassName}>
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. Renault Symbol"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>
              <input
                id="status"
                type="text"
                name="status"
                placeholder="new or used"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="color" className={labelClassName}>
                Color
              </label>
              <input
                id="color"
                type="text"
                name="color"
                placeholder="e.g. silver"
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="image" className={labelClassName}>
                Image URL
              </label>
              <input
                id="image"
                type="url"
                name="image"
                placeholder="https://…"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClassName}>
                Price (DZD)
              </label>
              <input
                id="price"
                type="text"
                name="price"
                inputMode="numeric"
                placeholder="1000000"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="mileage" className={labelClassName}>
                Mileage (km)
              </label>
              <input
                id="mileage"
                type="text"
                name="mileage"
                inputMode="numeric"
                placeholder="45000"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="year" className={labelClassName}>
                Year
              </label>
              <input
                id="year"
                type="text"
                name="year"
                inputMode="numeric"
                placeholder="2020"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:justify-end">
            <button
              type="reset"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Clear
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            >
              Add car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
