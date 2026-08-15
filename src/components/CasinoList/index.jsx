import { Link } from 'react-router-dom'
import './style.css'

const casinoGames = [
  { id: 'goal2', name: 'Goal 2', code: 'goal2', ext: 'jpg' },
  { id: 'worli3', name: 'Matka', code: 'worli3', ext: 'gif' },
  { id: 'teen62', name: 'V VIP Teenpatti 1-day', code: 'teen62', ext: 'gif' },
  { id: 'dolidana', name: 'Dolidana', code: 'dolidana', ext: 'gif' },
  { id: 'mogambo', name: 'Mogambo', code: 'mogambo', ext: 'gif' },
  { id: 'teen20v1', name: '20-20 Teenpatti VIP1', code: 'teen20v1', ext: 'jpg' },
  { id: 'lucky5', name: 'Lucky 6', code: 'lucky5', ext: 'jpg' },
  { id: 'roulette12', name: 'Beach Roulette', code: 'roulette12', ext: 'jpg' },
  { id: 'roulette13', name: 'Roulette', code: 'roulette13', ext: 'jpg' },
  { id: 'roulette11', name: 'Golden Roulette', code: 'roulette11', ext: 'jpg' },
  { id: 'poison', name: 'Teenpatti Poison One Day', code: 'poison', ext: 'jpg' },
  { id: 'teenunique', name: 'Unique Teenpatti', code: 'teenunique', ext: 'jpg' },
  { id: 'poison20', name: 'Teenpatti Poison 20-20', code: 'poison20', ext: 'jpg' },
  { id: 'joker120', name: 'Unlimited Joker 20-20', code: 'joker120', ext: 'jpg' },
  { id: 'joker20', name: 'Teenpatti Joker 20-20', code: 'joker20', ext: 'jpg' },
  { id: 'joker1', name: 'Unlimited Joker Oneday', code: 'joker1', ext: 'jpg' },
  { id: 'teen20c', name: '20-20 Teenpatti C', code: 'teen20c', ext: 'jpg' },
  { id: 'btable2', name: 'Bollywood Casino 2', code: 'btable2', ext: 'jpg' },
  { id: 'ourroullete', name: 'Unique Roulette', code: 'ourroullete', ext: 'jpg' },
  { id: 'superover3', name: 'Mini Superover', code: 'superover3', ext: 'jpg' },
  { id: 'goal', name: 'Goal', code: 'goal', ext: 'jpg' },
  { id: 'ab4', name: 'ANDAR BAHAR 150 cards', code: 'ab4', ext: 'jpg' },
  { id: 'lucky15', name: 'Lucky 15', code: 'lucky15', ext: 'jpg' },
  { id: 'superover2', name: 'Super Over2', code: 'superover2', ext: 'jpg' },
  { id: 'teen41', name: 'Queen Top Open Teenpatti', code: 'teen41', ext: 'jpg' },
  { id: 'teen42', name: 'Jack Top Open Teenpatti', code: 'teen42', ext: 'jpg' },
  { id: 'sicbo2', name: 'Sic Bo2', code: 'sicbo2', ext: 'jpg' },
  { id: 'teen33', name: 'Instant Teenpatti 3.0', code: 'teen33', ext: 'jpg' },
  { id: 'sicbo', name: 'Sic Bo', code: 'sicbo', ext: 'jpg' },
  { id: 'ballbyball', name: 'Ball by Ball', code: 'ballbyball', ext: 'jpg' },
  { id: 'teen32', name: 'Instant Teenpatti 2.0', code: 'teen32', ext: 'jpg' },
  { id: 'teen', name: 'Teenpatti 1-day', code: 'teen', ext: 'jpg' },
  { id: 'teen20', name: '20-20 Teenpatti', code: 'teen20', ext: 'jpg' },
  { id: 'teen9', name: 'Teenpatti Test', code: 'teen9', ext: 'jpg' },
  { id: 'teen8', name: 'Teenpatti Open', code: 'teen8', ext: 'jpg' },
  { id: 'poker', name: 'Poker 1-Day', code: 'poker', ext: 'jpg' },
  { id: 'poker20', name: '20-20 Poker', code: 'poker20', ext: 'jpg' },
  { id: 'poker6', name: 'Poker 6 Players', code: 'poker6', ext: 'jpg' },
  { id: 'baccarat', name: 'Baccarat', code: 'baccarat', ext: 'jpg' },
  { id: 'baccarat2', name: 'Baccarat 2', code: 'baccarat2', ext: 'jpg' },
  { id: 'dt20', name: '20-20 Dragon Tiger', code: 'dt20', ext: 'jpg' },
  { id: 'dt6', name: '1 Day Dragon Tiger', code: 'dt6', ext: 'jpg' },
  { id: 'dtl20', name: '20-20 D T L', code: 'dtl20', ext: 'jpg' },
  { id: 'dt202', name: '20-20 Dragon Tiger 2', code: 'dt202', ext: 'jpg' },
  { id: 'card32', name: '32 Cards A', code: 'card32', ext: 'jpg' },
  { id: 'card32eu', name: '32 Cards B', code: 'card32eu', ext: 'jpg' },
  { id: 'ab20', name: 'Andar Bahar', code: 'ab20', ext: 'jpg' },
  { id: 'abj', name: 'Andar Bahar 2', code: 'abj', ext: 'jpg' },
  { id: 'lucky7', name: 'Lucky 7 - A', code: 'lucky7', ext: 'jpg' },
  { id: 'lucky7eu', name: 'Lucky 7 - B', code: 'lucky7eu', ext: 'jpg' },
  { id: '3cardj', name: '3 Cards Judgement', code: '3cardj', ext: 'jpg' },
  { id: 'war', name: 'Casino War', code: 'war', ext: 'jpg' },
  { id: 'worli', name: 'Worli Matka', code: 'worli', ext: 'jpg' },
  { id: 'worli2', name: 'Instant Worli', code: 'worli2', ext: 'jpg' },
  { id: 'aaa', name: 'Amar Akbar Anthony', code: 'aaa', ext: 'jpg' },
  { id: 'btable', name: 'Bollywood Casino', code: 'btable', ext: 'jpg' },
  { id: 'lottcard', name: 'Lottery', code: 'lottcard', ext: 'jpg' },
  { id: 'cricketv3', name: '5Five Cricket', code: 'cricketv3', ext: 'jpg' },
  { id: 'cmatch20', name: 'Cricket Match 20-20', code: 'cmatch20', ext: 'jpg' },
  { id: 'cmeter', name: 'Casino Meter', code: 'cmeter', ext: 'jpg' },
  { id: 'teen6', name: 'Teenpatti - 2.0', code: 'teen6', ext: 'jpg' },
  { id: 'queen', name: 'Queen', code: 'queen', ext: 'jpg' },
  { id: 'race20', name: 'Race20', code: 'race20', ext: 'jpg' },
  { id: 'lucky7eu2', name: 'Lucky 7 - C', code: 'lucky7eu2', ext: 'jpg' },
  { id: 'superover', name: 'Super Over', code: 'superover', ext: 'jpg' },
  { id: 'trap', name: 'The Trap', code: 'trap', ext: 'jpg' },
  { id: 'patti2', name: '2 Cards Teenpatti', code: 'patti2', ext: 'jpg' },
  { id: 'teensin', name: '29Card Baccarat', code: 'teensin', ext: 'jpg' },
  { id: 'teenmuf', name: 'Muflis Teenpatti', code: 'teenmuf', ext: 'jpg' },
  { id: 'race17', name: 'Race To 17', code: 'race17', ext: 'jpg' },
  { id: 'teen20b', name: '20-20 Teenpatti B', code: 'teen20b', ext: 'jpg' },
  { id: 'trio', name: 'Trio', code: 'trio', ext: 'jpg' },
  { id: 'notenum', name: 'Note Number', code: 'notenum', ext: 'jpg' },
  { id: 'teen120', name: '1 CARD 20-20', code: 'teen120', ext: 'jpg' },
  { id: 'teen1', name: '1 CARD ONE-DAY', code: 'teen1', ext: 'jpg' },
  { id: 'ab3', name: 'ANDAR BAHAR 50 cards', code: 'ab3', ext: 'jpg' },
  { id: 'aaa2', name: 'Amar Akbar Anthony 2', code: 'aaa2', ext: 'jpg' },
  { id: 'race2', name: 'Race to 2nd', code: 'race2', ext: 'jpg' },
  { id: 'teen3', name: 'Instant Teenpatti', code: 'teen3', ext: 'jpg' },
  { id: 'dum10', name: 'Dus ka Dum', code: 'dum10', ext: 'jpg' },
  { id: 'cmeter1', name: '1 Card Meter', code: 'cmeter1', ext: 'jpg' }
]

export default function CasinoList({ items = casinoGames }) {
  return (
    <div className="casino-list mt-2">
      {items.map((item) => {
        const bgUrl = `https://dataobj.ecoassetsservice.com/casino-icons/lc/${item.code}.${item.ext || 'jpg'}`
        const fallbackUrl = `https://dataobj.ecoassetsservice.com/casino-icons/default.jpg`

        return (
          <div className="casino-list-item" key={item.id}>
            <Link to={`/casino/${item.id}`}>
              <div 
                className="casino-list-item-banner"
                style={{ backgroundImage: `url("${bgUrl}"), url("${fallbackUrl}")` }}
              ></div>
              <div className="casino-list-name">{item.name}</div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
