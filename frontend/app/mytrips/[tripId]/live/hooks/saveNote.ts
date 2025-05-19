export async function saveNote({
    tripId,
    dayIndex,
    activityIndex,
    note,
    token,
  }: {
    tripId: number | string,
    dayIndex: number,
    activityIndex: number,
    note: string,
    token: string,
  }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/activity-note/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        trip: tripId,
        day_index: dayIndex,
        activity_index: activityIndex,
        note,
      }),
    });
    if (!res.ok) throw new Error('Failed to save note');
    return await res.json();
  }