import { useEffect, useState } from 'react';

export interface ActivityNoteStatus {
  note: string;
  is_done: boolean;
}

export interface ActivityNotesMap {
  [key: string]: ActivityNoteStatus;
}

export function useActivityNotes(tripId: number | string | undefined, token: string | undefined) {
  const [notes, setNotes] = useState<ActivityNotesMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tripId || !token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/activity-notes/${tripId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const notesObj: ActivityNotesMap = {};
        data.forEach((note: any) => {
          notesObj[`${note.day_index}-${note.activity_index}`] = {
            note: note.note,
            is_done: note.is_done ?? false,
          };
        });
        setNotes(notesObj);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId, token]);

  return { notes, setNotes, loading };
}