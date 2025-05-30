import Cookies from 'js-cookie';

export async function saveNote({
  tripId,
  dayIndex,
  activityIndex,
  note,
  is_done,
  token,
}: {
  tripId: number | string,
  dayIndex: number,
  activityIndex: number,
  note: string,
  is_done: boolean,
  token: string,
}) {
  const csrfToken = Cookies.get('csrftoken');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity-note/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': csrfToken || '',
    },
    credentials: 'include',
    body: JSON.stringify({
      trip: tripId,
      day_index: dayIndex,
      activity_index: activityIndex,
      ...(note !== undefined ? { note } : {}),
      ...(is_done !== undefined ? { is_done } : {}),
    }),
  });
  if (!res.ok) throw new Error('Failed to save ');
  return await res.json();
} 