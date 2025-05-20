export async function saveNoteOrStatus({
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
    note?: string,
    is_done?: boolean,
    token: string,
  }) {
    const body: any = {
      trip: tripId,
      day_index: dayIndex,
      activity_index: activityIndex,
    };
    if (note !== undefined) body.note = note;
    if (is_done !== undefined) body.is_done = is_done;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/activity-note/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to save note/status');
    return await res.json();
  }