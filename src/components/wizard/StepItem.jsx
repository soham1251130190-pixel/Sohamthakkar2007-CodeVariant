import itemsData from '../../data/items.json';

export default function StepItem({ item, onChange }) {
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    onChange({ categoryId });
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    onChange({ price: val === '' ? '' : Math.max(0, Number(val)) });
  };

  const handleAgeChange = (e) => {
    const val = e.target.value;
    onChange({ age: val === '' ? '' : Math.max(0, Number(val)) });
  };

  const handleIntentChange = (intent) => {
    onChange({ intent });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-forest mb-1">
          What item are you evaluating?
        </h2>
        <p className="text-sm text-muted">
          Select the item category and tell us about its condition and cost.
        </p>
      </div>

      <div className="space-y-4">
        {/* Category Select */}
        <div>
          <label htmlFor="category-select" className="block text-sm font-semibold text-ink mb-1.5">
            Item Category <span className="text-coral">*</span>
          </label>
          <select
            id="category-select"
            value={item.categoryId}
            onChange={handleCategoryChange}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-white text-ink text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
          >
            {itemsData.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (Typical replacement: ₹{cat.replacePrice.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {/* Condition / Intent Toggle */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Condition / Intent <span className="text-coral">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleIntentChange('damaged')}
              className={`min-h-[44px] p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-center ${
                item.intent === 'damaged'
                  ? 'border-forest bg-forest/10 ring-2 ring-forest'
                  : 'border-line bg-white hover:bg-mint/40'
              }`}
            >
              <span className="font-semibold text-ink text-sm sm:text-base">Broken / Damaged</span>
              <span className="text-xs text-muted mt-0.5">Has a fault, physical defect, or stopped working</span>
            </button>

            <button
              type="button"
              onClick={() => handleIntentChange('unwanted')}
              className={`min-h-[44px] p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-center ${
                item.intent === 'unwanted'
                  ? 'border-forest bg-forest/10 ring-2 ring-forest'
                  : 'border-line bg-white hover:bg-mint/40'
              }`}
            >
              <span className="font-semibold text-ink text-sm sm:text-base">Just Unwanted</span>
              <span className="text-xs text-muted mt-0.5">Still functions normally, but no longer needed</span>
            </button>
          </div>
        </div>

        {/* Replacement Price & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price-input" className="block text-sm font-semibold text-ink mb-1.5">
              Replacement Price (₹) <span className="text-coral">*</span>
            </label>
            <input
              id="price-input"
              type="number"
              min="1"
              step="50"
              value={item.price}
              onChange={handlePriceChange}
              placeholder="e.g. 2500"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-white text-ink text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            />
            <p className="text-xs text-muted mt-1">Cost to buy brand new or equivalent replacement.</p>
          </div>

          <div>
            <label htmlFor="age-input" className="block text-sm font-semibold text-ink mb-1.5">
              Age in Years <span className="text-xs text-muted font-normal">(optional)</span>
            </label>
            <input
              id="age-input"
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={item.age}
              onChange={handleAgeChange}
              placeholder="e.g. 2"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-white text-ink text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            />
            <p className="text-xs text-muted mt-1">Approximate years of ownership.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
