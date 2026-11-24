import { useState } from 'react';

/**
 * Teacher va student uchun joriy hafta jadvali (sana bo'yicha).
 * data: { today: 'YYYY-MM-DD', pairs, days:[{date, name, label, lessons}] }
 * showWho: 'group' (o'qituvchiga — qaysi guruh) | 'teacher' (talabaga — qaysi o'qituvchi)
 */
export default function WeeklySchedule({ data, showWho }) {
  const [date, setDate] = useState(data.today);
  const current = data.days.find((d) => d.date === date) || data.days[0];
  const who = (l) => (showWho === 'group' ? l.group?.name : l.teacher?.name);

  return (
    <>
      <div className="tabs">
        {data.days.map((d) => (
          <button key={d.date} className={`tab ${d.date === date ? 'active' : ''}`} onClick={() => setDate(d.date)}>
            <span>
              {d.name}
              <small className="tab-date">{d.label}</small>
            </span>
            {d.lessons.length > 0 && <span className="count">{d.lessons.length}</span>}
            {d.date === data.today && <span className="today-dot" title="Bugun" />}
          </button>
        ))}
      </div>

      {current.lessons.length === 0 ? (
        <div className="state">
          {current.name}, {current.label} kuni darslar yo'q
        </div>
      ) : (
        <div className="lesson-list">
          {current.lessons.map((l) => (
            <div key={l.id} className="lesson-card">
              <div className="lesson-time">
                <strong>{l.pair}-para</strong>
                <span>
                  {l.start}–{l.end}
                </span>
              </div>
              <div className="lesson-body">
                <h3>{l.subject?.name}</h3>
                <p>
                  {showWho === 'group' ? 'Guruh: ' : "O'qituvchi: "}
                  <strong>{who(l)}</strong>
                  {l.room && <span className="room"> · Xona {l.room}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">Haftalik ko'rinish</h2>
      <div className="card table-wrap">
        <table className="grid week">
          <thead>
            <tr>
              <th>Para</th>
              {data.days.map((d) => (
                <th key={d.date} className={d.date === data.today ? 'today' : ''}>
                  {d.name}
                  <small>{d.label}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.pairs.map((p) => (
              <tr key={p.number}>
                <th>
                  <div>{p.number}-para</div>
                  <small>
                    {p.start}–{p.end}
                  </small>
                </th>
                {data.days.map((d) => {
                  const l = d.lessons.find((x) => x.pair === p.number);
                  return (
                    <td key={d.date}>
                      <div className={`cell static ${l ? 'cell-busy' : 'cell-free'}`}>
                        {l && (
                          <>
                            <b>{l.subject?.name}</b>
                            <small>{who(l)}</small>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
