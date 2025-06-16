import React from 'react'

interface Card {
  title: string
  desc: string
  data?: string
  footnote?: {
    text: string
    link: string
  }
}

interface CardGroupProps {
  cards: Card[]
  columns?: number
}

const CardGroup: React.FC<CardGroupProps> = ({ cards }) => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      <div
        className={`p-8 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 rounded-lg bg-linear-[-60deg,black_0%,red_100%]`}
      >
        {cards.map((card, i) => (
          <div key={i}>
            {card.data && <p className="text-6xl text-white font-semibold">{card.data}</p>}
            <h3 className="text-2xl font-bold mb-2 border-b border-white">{card.title}</h3>
            <p className="text-white mb-4">{card.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center text-white">
        {cards.map((card, i) => (
          <div key={i}>
            {card.footnote && (
              <p className="text-white text-sm">
                {card.footnote.text}{' '}
                {card.footnote.link && (
                  <a
                    href={card.footnote.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Source
                  </a>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardGroup
