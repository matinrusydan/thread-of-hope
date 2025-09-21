"use client"

import { useMemo, useState } from 'react'

type EventItem = { id: string; title: string; event_date: string; location?: string; description?: string; imagePath?: string | null }

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export default function Calendar({ events }: { events: EventItem[] }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    events.forEach((e) => {
      const key = new Date(e.event_date).toISOString().slice(0, 10)
      const arr = map.get(key) || []
      arr.push(e)
      map.set(key, arr)
    })
    return map
  }, [events])

  const days = [] as Date[]
  const start = startOfMonth(visibleMonth)
  const end = endOfMonth(visibleMonth)
  const startWeekDay = start.getDay()
  for (let i = 0; i < startWeekDay; i++) days.push(new Date(start.getFullYear(), start.getMonth(), i - startWeekDay + 1))
  for (let d = 1; d <= end.getDate(); d++) days.push(new Date(start.getFullYear(), start.getMonth(), d))
  while (days.length % 7 !== 0) days.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + (days.length % 7)))

  const prevMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))
  const nextMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))

  const closeModal = () => setSelectedDate(null)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg border border-border hover:bg-accent hover:border-accent-foreground transition-colors"
        >
          ←
        </button>
        <div className="font-bold text-lg text-foreground">
          {visibleMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg border border-border hover:bg-accent hover:border-accent-foreground transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map((d) => (
          <div key={d} className="font-semibold text-muted-foreground py-2 text-sm">{d}</div>
        ))}

        {days.map((dt, idx) => {
          const key = dt.toISOString().slice(0, 10)
          const dayEvents = eventsByDate.get(key) || []
          const isCurrentMonth = dt.getMonth() === visibleMonth.getMonth()
          const isToday = key === new Date().toISOString().slice(0, 10)
          const hasEvents = dayEvents.length > 0

          return (
            <div key={idx} className="relative">
              <button
                onClick={() => hasEvents && setSelectedDate(key)}
                onMouseEnter={() => hasEvents && setHoveredDate(key)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`w-full aspect-square rounded-lg border transition-all duration-200 flex flex-col items-center justify-center text-sm font-medium ${
                  isCurrentMonth
                    ? isToday
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : hasEvents
                        ? 'hover:bg-accent hover:border-accent-foreground border-border bg-background'
                        : 'hover:bg-muted border-transparent'
                    : 'text-muted-foreground/50 border-transparent'
                } ${hasEvents ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={isToday ? 'font-bold' : ''}>{dt.getDate()}</span>
                {hasEvents && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-primary rounded-full"></div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground ml-0.5">+</div>
                    )}
                  </div>
                )}
              </button>

              {/* Hover tooltip */}
              {hoveredDate === key && hasEvents && (
                <div className="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg p-3 min-w-48">
                  <div className="text-sm font-semibold mb-2">Events pada {dt.getDate()}</div>
                  <div className="space-y-2">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="text-xs">
                        <div className="font-medium truncate">{event.title}</div>
                        {event.location && (
                          <div className="text-muted-foreground truncate">{event.location}</div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2} event lainnya
                      </div>
                    )}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Compact Modal */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="bg-card border border-border rounded-xl shadow-2xl z-10 max-w-md w-full max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h4 className="font-semibold text-card-foreground">
                Event {new Date(selectedDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              >
                ✕
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {(eventsByDate.get(selectedDate) || []).map((event) => (
                <div key={event.id} className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors">
                  <div className="font-semibold text-card-foreground mb-1">{event.title}</div>
                  <div className="text-sm text-muted-foreground mb-1">
                    🕐 {new Date(event.event_date).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {event.location && (
                    <div className="text-sm text-muted-foreground mb-1">
                      📍 {event.location}
                    </div>
                  )}
                  {event.description && (
                    <div className="text-sm text-card-foreground/80 line-clamp-2">
                      {event.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
