import { redirect } from 'wix-router';

const BOOKING_TARGET = 'https://www.berlinwalk.com/book-berlin-walking-tour/berlin-free-walking-tour-tip-based?utm_source=short_url&utm_medium=pdf_print&utm_campaign=berlin_first_day_planner&utm_content=book';

export function book_Router(request) {
  return redirect(BOOKING_TARGET, '301');
}
