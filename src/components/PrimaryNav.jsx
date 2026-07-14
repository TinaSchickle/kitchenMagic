import { BookIcon, CalendarIcon } from './icons'

// Segmented control switching between the recipe library and the planner.
export default function PrimaryNav({ current, plannerCount, onNavigate }) {
  return (
    <div className="pt-6">
      <div className="inline-flex items-center gap-1 bg-white/70 rounded-full p-1 shadow-soft">
        <NavItem
          active={current === 'overview'}
          onClick={() => onNavigate('overview')}
          icon={<BookIcon width={18} height={18} />}
          label="Recipes"
        />
        <NavItem
          active={current === 'planner' || current === 'shopping'}
          onClick={() => onNavigate('planner')}
          icon={<CalendarIcon width={18} height={18} />}
          label="Planner"
          badge={plannerCount}
        />
      </div>
    </div>
  )
}

function NavItem({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${
        active
          ? 'bg-terracotta-500 text-white shadow-soft'
          : 'text-cocoa-600 hover:text-cocoa-800'
      }`}
    >
      {icon}
      {label}
      {badge > 0 && (
        <span
          className={`text-xs rounded-full px-1.5 py-0.5 ${
            active ? 'bg-white/25' : 'bg-terracotta-100 text-terracotta-600'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
