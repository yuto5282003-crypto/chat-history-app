"use client";

// ===== Types =====
export type DemoSlot = {
  id: string;
  category: string;
  mode: "call" | "in_person";
  startAt: string;
  endAt: string;
  durationMinutes: number;
  priceYen: number;
  areaValue: string | null;
  bookingType: "instant" | "approval";
  status: string;
  seller: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    verificationStatus: string;
    ratingAvg: number;
    ratingCount: number;
    cancelRate: number;
  };
};

export type DemoBooking = {
  id: string;
  slotId: string;
  slot: DemoSlot;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
};

export type DemoPost = {
  id: string;
  text: string;
  tags: string[];
  preferredMode: string;
  likeCount: number;
  createdAt: string;
  user: { id: string; displayName: string; avatarUrl: string | null };
};

export type DemoRequest = {
  id: string;
  fromUser: { id: string; displayName: string };
  toUser: { id: string; displayName: string };
  postId?: string;
  postText?: string;
  timing: string;
  mode: "call" | "in_person";
  durationMinutes: number;
  budgetYen: number;
  note: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export type EventKind = "busy" | "free" | "private" | "buffer";

export type DemoEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  visibility: "busy_only" | "title" | "detail" | "hidden";
  memo?: string;
  kind?: EventKind;
  nearbyExclude?: boolean;   // すれ違い対象外（デフォtrue）
  bufferBefore?: number;     // 前バッファ分
  bufferAfter?: number;      // 後バッファ分
};

export type TicketEntry = {
  delta: number;
  reason: string;
  createdAt: string;
};

export type DemoCheckin = {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  photoIndex: number;        // photos配列のindex
  mode: "call" | "in_person";
  durationMinutes: number;
  purpose: string;           // 目的テンプレ
  note: string;
  lat: number;
  lng: number;
  distanceRange: string;     // "〜500m" etc (丸め済み)
  expiresAt: string;
  createdAt: string;
};

export type DemoPing = {
  id: string;
  fromUser: { id: string; displayName: string; photoIndex: number };
  toUser: { id: string; displayName: string };
  checkinId: string;
  purpose: string;
  durationMinutes: number;
  mode: "call" | "in_person";
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export type DemoProfile = {
  bio: string;
  photos: string[];
  purposeTags: string[];
  hobbyTags: string[];
  job: string;
  workStyle: string;
  age: string;
  height: string;
  incomeRange: string;
  incomeVisibility: "all" | "match" | "private";
  lifeTags: string[];
};

// ===== localStorage helpers =====
function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`sloty_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`sloty_${key}`, JSON.stringify(value));
}

// ===== Store =====
import { DEMO_SLOTS, DEMO_POSTS, DEMO_TICKET_LEDGER } from "./demo-data";

// --- Tickets ---
export function getTicketBalance(): number {
  return load<number>("tickets", 18);
}
export function setTicketBalance(v: number) {
  save("tickets", v);
}
export function getTicketLedger(): TicketEntry[] {
  return load<TicketEntry[]>("ticket_ledger", DEMO_TICKET_LEDGER);
}
export function addTicketEntry(delta: number, reason: string) {
  const ledger = getTicketLedger();
  ledger.unshift({ delta, reason, createdAt: new Date().toISOString() });
  save("ticket_ledger", ledger);
  setTicketBalance(getTicketBalance() + delta);
}
export function consumeTickets(amount: number, reason: string): boolean {
  if (getTicketBalance() < amount) return false;
  addTicketEntry(-amount, reason);
  return true;
}

// --- Slots ---
export function getSlots(): DemoSlot[] {
  return load<DemoSlot[]>("slots", DEMO_SLOTS);
}
export function addSlot(slot: DemoSlot) {
  const slots = getSlots();
  slots.unshift(slot);
  save("slots", slots);
}

// --- Bookings ---
export function getBookings(): DemoBooking[] {
  return load<DemoBooking[]>("bookings", []);
}
export function addBooking(b: DemoBooking) {
  const bookings = getBookings();
  bookings.unshift(b);
  save("bookings", bookings);
}
export function updateBookingStatus(id: string, status: DemoBooking["status"]) {
  const bookings = getBookings();
  const b = bookings.find((x) => x.id === id);
  if (b) b.status = status;
  save("bookings", bookings);
}

// --- Posts ---
export function getPosts(): DemoPost[] {
  return load<DemoPost[]>("posts", DEMO_POSTS);
}
export function addPost(p: DemoPost) {
  const posts = getPosts();
  posts.unshift(p);
  save("posts", posts);
}

// --- Requests ---
export function getRequests(): DemoRequest[] {
  return load<DemoRequest[]>("requests", []);
}
export function addRequest(r: DemoRequest) {
  const reqs = getRequests();
  reqs.unshift(r);
  save("requests", reqs);
}
export function updateRequestStatus(id: string, status: DemoRequest["status"]) {
  const reqs = getRequests();
  const r = reqs.find((x) => x.id === id);
  if (r) r.status = status;
  save("requests", reqs);
}

// --- Private Events ---
export function getPrivateEvents(): DemoEvent[] {
  return load<DemoEvent[]>("private_events", []);
}
export function addPrivateEvent(e: DemoEvent) {
  const events = getPrivateEvents();
  events.push(e);
  save("private_events", events);
}
export function removePrivateEvent(id: string) {
  save("private_events", getPrivateEvents().filter((e) => e.id !== id));
}
export function updatePrivateEvent(id: string, updates: Partial<DemoEvent>) {
  const events = getPrivateEvents();
  const ev = events.find((e) => e.id === id);
  if (ev) Object.assign(ev, updates);
  save("private_events", events);
}

// --- Checkins ---
export function getCheckins(): DemoCheckin[] {
  return load<DemoCheckin[]>("checkins", []);
}
export function getMyCheckin(): DemoCheckin | null {
  const all = getCheckins();
  const mine = all.find((c) => c.userId === "demo-user-1");
  if (!mine) return null;
  if (new Date(mine.expiresAt).getTime() < Date.now()) {
    // expired — remove
    save("checkins", all.filter((c) => c.id !== mine.id));
    return null;
  }
  return mine;
}
export function addCheckin(c: DemoCheckin) {
  const all = getCheckins().filter((x) => x.userId !== c.userId); // replace existing
  all.unshift(c);
  save("checkins", all);
}
export function removeMyCheckin() {
  save("checkins", getCheckins().filter((c) => c.userId !== "demo-user-1"));
}
export function getCheckinCooldown(): number {
  // returns ms remaining until next checkin allowed (60s cooldown)
  const last = load<number>("checkin_last", 0);
  const remaining = (last + 60_000) - Date.now();
  return remaining > 0 ? remaining : 0;
}
export function setCheckinCooldown() {
  save("checkin_last", Date.now());
}

// --- Pings ---
export function getPings(): DemoPing[] {
  return load<DemoPing[]>("pings", []);
}
export function addPing(p: DemoPing) {
  const pings = getPings();
  pings.unshift(p);
  save("pings", pings);
}
export function updatePingStatus(id: string, status: DemoPing["status"]) {
  const pings = getPings();
  const p = pings.find((x) => x.id === id);
  if (p) p.status = status;
  save("pings", pings);
}
export function getPingCooldown(targetUserId: string): number {
  // 10min cooldown per target
  const key = `ping_cd_${targetUserId}`;
  const last = load<number>(key, 0);
  const remaining = (last + 10 * 60_000) - Date.now();
  return remaining > 0 ? remaining : 0;
}
export function setPingCooldown(targetUserId: string) {
  save(`ping_cd_${targetUserId}`, Date.now());
}

// --- Profile ---
const DEFAULT_PROFILE: DemoProfile = {
  bio: "", photos: [], purposeTags: [], hobbyTags: [],
  job: "", workStyle: "", age: "", height: "",
  incomeRange: "", incomeVisibility: "private", lifeTags: [],
};
export function getProfile(): DemoProfile {
  return load<DemoProfile>("profile", DEFAULT_PROFILE);
}
export function saveProfile(p: DemoProfile) {
  save("profile", p);
}
export function hasPhotos(): boolean {
  return getProfile().photos.length > 0;
}

// --- Friend events (shared busy/free) ---
export type FriendEvent = {
  startAt: string; endAt: string;
  type: "busy" | "free"; title?: string;
};
export function getFriendEvents(friendId: string): FriendEvent[] {
  return load<FriendEvent[]>(`friend_events_${friendId}`, []);
}
export function getCalendarVisibility(): { showFriends: boolean; selectedFriends: string[] } {
  return load("cal_vis", { showFriends: false, selectedFriends: [] });
}
export function setCalendarVisibility(v: { showFriends: boolean; selectedFriends: string[] }) {
  save("cal_vis", v);
}
// --- Common free time ---
export function calcCommonFree(friendId: string): { start: string; end: string; minutes: number }[] {
  const myEvents = getPrivateEvents().filter(e => (e.kind ?? "busy") !== "free");
  const friendEvents = getFriendEvents(friendId).filter(e => e.type === "busy");
  const now = Date.now();
  const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);
  const eod = endOfDay.getTime();

  // Build blocked intervals
  const blocked: { s: number; e: number }[] = [];
  for (const ev of myEvents) {
    const buf = ((ev.bufferBefore ?? 10) + (ev.bufferAfter ?? 10)) * 60_000;
    blocked.push({ s: new Date(ev.startAt).getTime() - (ev.bufferBefore ?? 10) * 60_000, e: new Date(ev.endAt).getTime() + (ev.bufferAfter ?? 10) * 60_000 });
  }
  for (const ev of friendEvents) {
    blocked.push({ s: new Date(ev.startAt).getTime(), e: new Date(ev.endAt).getTime() });
  }
  blocked.sort((a, b) => a.s - b.s);

  // Merge intervals
  const merged: { s: number; e: number }[] = [];
  for (const b of blocked) {
    if (merged.length && b.s <= merged[merged.length - 1].e) {
      merged[merged.length - 1].e = Math.max(merged[merged.length - 1].e, b.e);
    } else {
      merged.push({ ...b });
    }
  }

  // Find gaps from now to end of day
  const gaps: { start: string; end: string; minutes: number }[] = [];
  let cursor = now;
  for (const m of merged) {
    if (m.s > cursor && m.s <= eod) {
      const gapMin = Math.floor((m.s - cursor) / 60_000);
      if (gapMin >= 15) {
        gaps.push({ start: new Date(cursor).toISOString(), end: new Date(m.s).toISOString(), minutes: gapMin });
      }
    }
    cursor = Math.max(cursor, m.e);
  }
  if (cursor < eod) {
    const gapMin = Math.floor((eod - cursor) / 60_000);
    if (gapMin >= 15) {
      gaps.push({ start: new Date(cursor).toISOString(), end: new Date(eod).toISOString(), minutes: gapMin });
    }
  }
  return gaps.slice(0, 5);
}

// --- Free time calculation ---
export function calcFreeMinutes(): { freeMinutes: number; nextEventTitle: string | null; nextEventAt: string | null } {
  const now = Date.now();
  const events = getPrivateEvents();

  // Get events that block time (everything except free and hidden)
  const blockers = events
    .filter((e) => {
      const kind = e.kind ?? "busy";
      if (kind === "free") return false;
      if (e.nearbyExclude === false) return false; // explicitly opted-in to nearby
      return true;
    })
    .map((e) => {
      const bufBefore = (e.bufferBefore ?? 10) * 60_000;
      const bufAfter = (e.bufferAfter ?? 10) * 60_000;
      return {
        start: new Date(e.startAt).getTime() - bufBefore,
        end: new Date(e.endAt).getTime() + bufAfter,
        title: e.title,
        originalStart: e.startAt,
      };
    })
    .filter((b) => b.end > now)
    .sort((a, b) => a.start - b.start);

  // Check if currently in a blocking event
  const currentBlocker = blockers.find((b) => b.start <= now && b.end > now);
  if (currentBlocker) {
    // Find next free gap after this blocker
    const afterCurrent = blockers.filter((b) => b.start > currentBlocker.end);
    if (afterCurrent.length === 0) {
      return { freeMinutes: 0, nextEventTitle: currentBlocker.title, nextEventAt: new Date(currentBlocker.end).toISOString() };
    }
    return { freeMinutes: 0, nextEventTitle: currentBlocker.title, nextEventAt: currentBlocker.originalStart };
  }

  // Find next future blocker
  const nextBlocker = blockers.find((b) => b.start > now);
  if (!nextBlocker) {
    return { freeMinutes: 180, nextEventTitle: null, nextEventAt: null }; // 3h+ free
  }

  const freeMs = nextBlocker.start - now;
  return {
    freeMinutes: Math.floor(freeMs / 60_000),
    nextEventTitle: nextBlocker.title,
    nextEventAt: nextBlocker.originalStart,
  };
}

// ===== Conflict check =====
export function checkConflict(startAt: string, endAt: string): DemoEvent | null {
  const events = getPrivateEvents();
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  return events.find((ev) => {
    if (ev.visibility === "hidden") return false;
    const es = new Date(ev.startAt).getTime();
    const ee = new Date(ev.endAt).getTime();
    return s < ee && e > es;
  }) ?? null;
}
