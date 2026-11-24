import { useState } from 'react';
import { api } from '../../api/index.js';
import { useLoad } from '../../hooks/useLoad.js';
import PageHeader from '../../components/PageHeader.jsx';
import StateView from '../../components/StateView.jsx';
import LessonModal from '../../components/LessonModal.jsx';

export default function ScheduleGrid() {
  const [date, setDate] = useState(undefined); // undefined -> backend bugungi sanani tanlaydi
  const [modal, setModal] = useState(null); // { teacher, pair, lesson }

  const meta = useLoad(() => api.schedule.meta(), []);
  const grid = useLoad(() => api.schedule.grid(date), [date]);
  const refs = useLoad(() => Promise.all([api.groups.list(), api.subjects.list()]), []);

  const activeDate = date ?? grid.data?.date;
  const [groups, subjects] = refs.data || [[], []];

  const changed = () => {
    setModal(null);
    grid.reload();
  };

  return (
    <>
      <PageHeader
        title="Dars jadvali"
        subtitle="Katakni bosib dars biriktiring yoki mavjud darsni ko'ring. Faqat kecha va bugun uchun dars qo'shish mumkin"
      />

      <div className="tabs">
        {(meta.data?.allowedDates || []).map((d) => (
          <button
            key={d.date}
            className={`tab ${activeDate === d.date ? 'active' : ''}`}
            onClick={() => setDate(d.date)}
          >
            {d.isToday ? 'Bugun' : 'Kecha'}
            <small className="tab-date">
              {d.name}, {d.label}
            </small>
          </button>
        ))}
      </div>

      <div className="legend">
        <span>
          <i className="dot dot-busy" /> Dars bor
        </span>
        <span>
          <i className="dot dot-free" /> Bo'sh
        </span>
        {grid.data && <span className="muted">Jami: {grid.data.totalLessons} ta dars</span>}
      </div>

      <StateView
        loading={grid.loading && !grid.data}
        error={grid.error}
        onRetry={grid.reload}
        empty={grid.data && grid.data.rows.length === 0}
        emptyText="Hali o'qituvchi qo'shilmagan. «O'qituvchilar» bo'limidan qo'shing."
      >
        {grid.data && (
          <div className="card table-wrap">
            <table className="grid">
              <thead>
                <tr>
                  <th className="sticky-col">O'qituvchi</th>
                  {grid.data.pairs.map((p) => (
                    <th key={p.number}>
                      <div>{p.number}-para</div>
                      <small>
                        {p.start}–{p.end}
                      </small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.data.rows.map((row) => (
                  <tr key={row.teacher.id}>
                    <th className="sticky-col teacher-cell">
                      {row.teacher.fullName}
                      {row.teacher.department && <small>{row.teacher.department}</small>}
                    </th>
                    {row.cells.map((c) => (
                      <td key={c.pair}>
                        <button
                          className={`cell ${c.lesson ? 'cell-busy' : 'cell-free'}`}
                          onClick={() => setModal({ teacher: row.teacher, pair: c.pair, lesson: c.lesson })}
                          title={c.lesson ? `${c.lesson.group.name} — ${c.lesson.subject.name}` : "Dars biriktirish"}
                        >
                          {c.lesson ? (
                            <>
                              <b>{c.lesson.group.name}</b>
                              <small>{c.lesson.subject.name}</small>
                            </>
                          ) : (
                            <span className="plus">+</span>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </StateView>

      {modal && grid.data && (
        <LessonModal
          key={`${modal.teacher.id}-${modal.pair}`}
          date={grid.data.date}
          dateText={`${grid.data.dayName}, ${grid.data.dateLabel}`}
          pairInfo={grid.data.pairs.find((p) => p.number === modal.pair)}
          teacher={modal.teacher}
          teachers={grid.data.rows.map((r) => r.teacher)}
          lesson={modal.lesson}
          groups={groups}
          subjects={subjects}
          onClose={() => setModal(null)}
          onChanged={changed}
        />
      )}
    </>
  );
}
