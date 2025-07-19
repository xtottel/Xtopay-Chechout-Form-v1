export default function EcediForm() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          eCedi Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
          We&apos;re currently awaiting official rollout and full integration support
          from the <strong>Bank of Ghana</strong> before enabling eCedi payments.
          {/* Stay tuned — Xtopay will support Ghana’s digital currency as soon as it’s ready. */}
        </p>
        <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-4 py-3 text-sm">
          eCedi support is under development and will be launched after regulatory approval.
        </div>
      </div>
    </div>
  );
}
