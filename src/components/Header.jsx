import { isCloud } from '../lib/storage'
import { PlusIcon, SparkleIcon } from './icons'

export default function Header({ onLogoClick, onAdd, showAdd }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-cream-50/80 border-b border-cream-200/70">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group"
          aria-label="Go to all recipes"
        >
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-terracotta-500 text-white shadow-soft group-active:scale-95 transition">
            <SparkleIcon width={20} height={20} />
          </span>
          <span className="font-display text-2xl font-semibold text-cocoa-800 tracking-tight">
            kitchen<span className="text-terracotta-500">Magic</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline-flex chip bg-white/70 text-cocoa-400 text-xs"
            title={
              isCloud
                ? 'Synced across your devices via Supabase'
                : 'Saved on this device — connect Supabase for cross-device sync'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${isCloud ? 'bg-sage-400' : 'bg-terracotta-300'}`}
            />
            {isCloud ? 'Synced' : 'On this device'}
          </span>

          {showAdd && (
            <button className="btn-primary" onClick={onAdd}>
              <PlusIcon width={18} height={18} />
              <span className="hidden sm:inline">New recipe</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
