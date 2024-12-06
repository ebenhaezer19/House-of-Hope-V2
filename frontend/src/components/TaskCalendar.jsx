import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import id from 'date-fns/locale/id' // Menggunakan locale Indonesia
import { useState } from 'react'
import Modal from './Modal'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'id': id,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const TaskCalendar = ({ events }) => {
  const [selectedTask, setSelectedTask] = useState(null)

  // Mengubah format events untuk kalender
  const calendarEvents = events.map(task => ({
    id: task.id,
    title: `${task.task_name} - ${task.resident_name}`,
    start: new Date(`${task.schedule_date}T${task.start_time || '00:00'}`),
    end: new Date(`${task.schedule_date}T${task.end_time || '23:59'}`),
    resource: task
  }))

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#4F46E5', // indigo-600
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block'
    }

    if (event.resource.status === 'Completed') {
      style.backgroundColor = '#059669' // green-600
    } else if (event.resource.status === 'In Progress') {
      style.backgroundColor = '#D97706' // yellow-600
    }

    return {
      style
    }
  }

  const messages = {
    today: 'Hari Ini',
    previous: 'Sebelumnya',
    next: 'Berikutnya',
    month: 'Bulan',
    week: 'Minggu',
    day: 'Hari',
    agenda: 'Agenda',
    date: 'Tanggal',
    time: 'Waktu',
    event: 'Acara',
    noEventsInRange: 'Tidak ada tugas dalam rentang ini.'
  }

  const formatDateTime = (date, time) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return `${new Date(date).toLocaleDateString('id-ID', options)} - ${time}`
  }

  return (
    <>
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          messages={messages}
          views={['month', 'week', 'day', 'agenda']}
          popup
          selectable
          onSelectEvent={(event) => setSelectedTask(event.resource)}
        />
      </div>

      <Modal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)}
        title="Detail Tugas"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Nama Tugas</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedTask.task_name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Penghuni</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedTask.resident_name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Jenis Tugas</h4>
              <p className="mt-1 text-sm text-gray-900">{selectedTask.task_type}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Waktu</h4>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateTime(selectedTask.schedule_date, selectedTask.start_time)} s/d {selectedTask.end_time}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedTask.status === 'Completed' ? 'bg-green-100 text-green-800' :
                selectedTask.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedTask.status}
              </span>
            </div>

            {selectedTask.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Deskripsi</h4>
                <p className="mt-1 text-sm text-gray-900">{selectedTask.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default TaskCalendar 