import { api } from '../api/index.js';
import { useLoad } from '../hooks/useLoad.js';
import PageHeader from '../components/PageHeader.jsx';
import StateView from '../components/StateView.jsx';
import WeeklySchedule from '../components/WeeklySchedule.jsx';

/** Teacher: o'z darslari. Student: guruhining darslari. Ma'lumot backenddan rolga qarab keladi */
export default function MySchedule({ role }) {
  const { data, loading, error, reload } = useLoad(() => api.schedule.my(), [role]);
  const isTeacher = role === 'teacher';

  return (
    <>
      <PageHeader
        title={isTeacher ? 'Mening darslarim' : 'Dars jadvali'}
        subtitle={data?.group ? `${data.group.name} guruhi` : isTeacher ? 'Administrator biriktirgan darslar' : undefined}
      />
      <StateView loading={loading} error={error} onRetry={reload}>
        {data && <WeeklySchedule data={data} showWho={isTeacher ? 'group' : 'teacher'} />}
      </StateView>
    </>
  );
}
