import { WorkshopItem } from '../types';

/**
 * Robust date parser for workshops.
 * Handles:
 * - ISO formats: "2026-06-30", "2026-05-25T10:00:00Z"
 * - Indian/UK text formats: "25 May, 2026", "01 June 2026", "15 July 2026", "29 June, 2025"
 * - Fallbacks with month names
 */
export function parseWorkshopDate(dateStr?: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date();

  const clean = dateStr.replace(/[,|]/g, ' ').replace(/\s+/g, ' ').trim();
  const directParsed = new Date(clean);
  if (!isNaN(directParsed.getTime())) {
    return directParsed;
  }

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const parts = clean.toLowerCase().split(' ');
  let day = 1;
  let month = 0;
  let year = new Date().getFullYear();

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (!isNaN(num)) {
      if (num > 31) {
        year = num;
      } else if (day === 1) {
        day = num;
      }
    } else {
      const idx = months.findIndex(m => part.startsWith(m));
      if (idx !== -1) month = idx;
    }
  }

  const d = new Date(year, month, day, 23, 59, 59);
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Checks if a workshop's scheduled event date has already passed.
 * Compares event day against the start of today (local time).
 * Also returns true if the status is explicitly set to 'past'.
 */
export function isWorkshopPast(workshop?: { date?: string; status?: string } | null): boolean {
  if (!workshop) return false;
  if (workshop.status === 'past') return true;
  if (!workshop.date) return false;

  const eventDate = parseWorkshopDate(workshop.date);
  if (!eventDate || isNaN(eventDate.getTime())) return false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Consider it past if the event end of day was before today
  return eventDate.getTime() < todayStart.getTime();
}

export interface WorkshopGlimpseItem {
  url: string;
  workshopId?: string;
  workshopTitle?: string;
}

/**
 * Aggregates all uploaded photos from individual workshops plus general gallery images.
 * Guarantees NO default/mock Unsplash images are ever shown.
 */
export function getAllWorkshopGlimpses(
  workshops: WorkshopItem[] = [],
  galleryImages: string[] = []
): WorkshopGlimpseItem[] {
  const list: WorkshopGlimpseItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Photos attached to individual workshops
  workshops.forEach(w => {
    if (Array.isArray(w.images)) {
      w.images.forEach(img => {
        if (img && typeof img === 'string' && img.trim() && !seenUrls.has(img)) {
          seenUrls.add(img);
          list.push({
            url: img,
            workshopId: w.id,
            workshopTitle: w.title
          });
        }
      });
    }
    // Also include workshop cover image if not already in gallery and valid
    if (w.image && typeof w.image === 'string' && w.image.trim() && !seenUrls.has(w.image)) {
      // Don't duplicate if already added
      seenUrls.add(w.image);
      list.push({
        url: w.image,
        workshopId: w.id,
        workshopTitle: w.title
      });
    }
  });

  // 2. Standalone gallery images from CMS
  if (Array.isArray(galleryImages)) {
    galleryImages.forEach(img => {
      if (img && typeof img === 'string' && img.trim() && !seenUrls.has(img)) {
        seenUrls.add(img);
        list.push({
          url: img,
          workshopTitle: 'Workshop Highlights'
        });
      }
    });
  }

  return list;
}
