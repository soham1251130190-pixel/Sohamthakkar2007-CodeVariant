import Layout from './components/Layout.jsx';
import Card from './components/Card.jsx';
import Button from './components/Button.jsx';
import itemsData from './data/items.json';
import { options, safetyFlags } from './config/scoring.js';
import { optionTemplates } from './data/templates.js';

export default function App() {
  const categoryCount = itemsData.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Foundation Status / Placeholder Card */}
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
            <div>
              <span className="inline-block text-xs uppercase tracking-wider font-semibold text-forest bg-forest/10 px-2.5 py-1 rounded-full mb-1">
                Slot 2: Design Foundation &amp; Data
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-forest">
                Item Catalog &amp; Config Loaded
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Categories:</span>
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold bg-amber text-ink rounded-full">
                {categoryCount} loaded
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-ink">
            The design tokens, scoring configuration, and option templates are ready.
            The placeholder confirms all {categoryCount} mock categories are loaded and valid.
          </p>

          {/* Catalog Pills */}
          <div>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
              Configured Categories ({categoryCount})
            </h3>
            <div className="flex flex-wrap gap-2">
              {itemsData.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-white border border-line text-ink"
                >
                  <strong className="text-forest mr-1.5">{item.name}</strong>
                  <span className="text-xs text-muted">₹{item.replacePrice.toLocaleString('en-IN')}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Component Showcase: Buttons */}
          <div className="pt-2 border-t border-line">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
              Interactive Touch Targets (Min 44px)
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary (Forest)</Button>
              <Button variant="accent">Accent (Amber)</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>

          {/* Safety Flag Demonstration (Coral Usage) */}
          <div className="pt-2 border-t border-line">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
              Safety Warning Rules (Coral Accent)
            </h3>
            <div className="p-3.5 rounded-xl border border-coral/30 bg-coral/10 text-coral text-sm">
              <p className="font-semibold">⚠️ Safety Protocol Active</p>
              <p className="text-xs mt-0.5 text-ink">
                Coral colour token is strictly reserved for safety warnings ({safetyFlags.length} flags configured: {safetyFlags.map(f => f.id).join(', ')}).
              </p>
            </div>
          </div>
        </Card>

        {/* Overview of 5 Evaluated Paths */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-forest">
            Evaluation Paths ({options.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((optKey) => {
              const tmpl = optionTemplates[optKey];
              return (
                <div
                  key={optKey}
                  className="bg-white border border-line rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-forest capitalize">{tmpl.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-mint text-forest font-medium">
                        {tmpl.pointerType}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-2">{tmpl.tagline}</p>
                  </div>
                  <p className="text-[11px] text-muted italic border-t border-line/60 pt-2">
                    {tmpl.fallback}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
