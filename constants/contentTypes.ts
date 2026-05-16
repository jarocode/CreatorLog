import type { Platform } from './platforms';

export interface ContentType {
  id: string;
  label: string;
  icon: string; // Ionicons name
}

export const PLATFORM_CONTENT_TYPES: Record<Platform, ContentType[]> = {
  linkedin: [
    { id: 'text', label: 'Text', icon: 'document-text-outline' },
    { id: 'carousel', label: 'Carousel', icon: 'grid-outline' },
    { id: 'video', label: 'Video', icon: 'videocam-outline' },
    { id: 'poll', label: 'Poll', icon: 'bar-chart-outline' },
  ],
  tiktok: [
    { id: 'video', label: 'Video', icon: 'videocam-outline' },
    { id: 'live', label: 'LIVE', icon: 'radio-outline' },
    { id: 'story', label: 'Story', icon: 'ellipse-outline' },
  ],
  youtube: [
    { id: 'longform', label: 'Long-form', icon: 'film-outline' },
    { id: 'short', label: 'Short', icon: 'phone-portrait-outline' },
    { id: 'community', label: 'Community', icon: 'chatbox-outline' },
    { id: 'live', label: 'LIVE', icon: 'radio-outline' },
  ],
};
