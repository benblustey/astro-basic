'use client'
import React from 'react'

interface HeatmapData {
  date: string
  count: number
}

interface HeatmapProps {
  data: HeatmapData[]
  startDate: Date
  endDate: Date
  colorScale?: { color: string; label: number | string }[]
}

const Calendar: React.FC<HeatmapProps> = ({
  data,
  startDate,
  endDate,
  colorScale = [
    { color: '#fbe9e7', label: 0 },
    { color: '#ef9a9a', label: '>1' },
    { color: '#e57373', label: '>5' },
    { color: '#ef5350', label: '>10' },
    { color: '#c62828', label: '>20' },
  ],
}) => {
  const getColorForValue = (value: number) => {
    if (value > 20) {
      return colorScale[4].color
    } else if (value > 10) {
      return colorScale[3].color
    } else if (value > 5) {
      return colorScale[2].color
    } else if (value > 0) {
      return colorScale[1].color
    } else {
      return colorScale[0].color
    }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatMonthLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const generateMonthGrid = () => {
    const months: { month: Date; weeks: Date[][] }[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      // Adjust to start from Sunday
      const firstDayOfMonth = new Date(monthStart)
      const dayOfWeek = firstDayOfMonth.getDay()
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek)

      const weeks: Date[][] = []
      const tempDate = new Date(firstDayOfMonth)

      while (tempDate <= monthEnd) {
        const week: Date[] = []
        for (let i = 0; i < 7; i++) {
          week.push(new Date(tempDate))
          tempDate.setDate(tempDate.getDate() + 1)
        }
        weeks.push(week)
      }

      months.push({ month: monthStart, weeks })
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    return months
  }

  const months = generateMonthGrid()

  return (
    <>
      <div className="grid mx-auto grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {months.map(({ month, weeks }, monthIndex) => (
          <div key={monthIndex} className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{formatMonthLabel(month)}</h3>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="text-xs text-gray-500 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {weeks.flatMap((week, weekIndex) =>
                week.map((date, dayIndex) => {
                  const dateStr = formatDate(date)
                  const dataPoint = data.find((d) => d.date === dateStr)
                  const value = dataPoint?.count || 0
                  const isCurrentMonth = date.getMonth() === month.getMonth()

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`aspect-square rounded-sm group relative ${
                        !isCurrentMonth ? 'opacity-30' : ''
                      }`}
                      style={{
                        backgroundColor: getColorForValue(value),
                        cursor: 'pointer',
                      }}
                    >
                      {/* Date number */}
                      <div className="absolute top-0 left-0 text-[10px] p-0.5 text-gray-600">
                        {date.getDate()}
                      </div>

                      {/* Tooltip */}
                      <div
                        className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap"
                        style={{
                          left: '50%',
                          transform: 'translateX(-50%)',
                          top: '-30px',
                        }}
                      >
                        <div className="font-semibold">{formatDate(date)}</div>
                        <div>
                          {value} event{value !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Color scale legend */}
      <div className="flex justify-end mt-4 gap-1">
        {colorScale.map(({ color, label }, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-sm flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <div className={`text-xs text-gray-600 ${index !== 0 ? 'text-white' : ''}`}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Calendar
