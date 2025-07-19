export default function PaySmallSmall() {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Pay Small Small
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
          Can’t pay the full amount at once? With Xtopay’s <strong>Pay Small Small</strong> option,
          you can split your payment into convenient parts and pay over time — no stress.
        </p>
        <div className="rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-3 text-sm">
          Flexible installments. Easy setup. Available for MoMo users only. Full support coming soon!
        </div>
      </div>
    </div>
  );
}
