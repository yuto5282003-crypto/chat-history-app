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

export type DemoEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  visibility: "busy_only" | "title" | "detail" | "hidden";
  memo?: string;
};

export type TicketEntry = {
  delta: number;
  reason: string;
  createdAt: string;
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

export function getSlots(): DemoSlot[] {
  return load<DemoSlot[]>("slots", DEMO_SLOTS);
}
export function addSlot(slot: DemoSlot) {
  const slots = getSlots();
  slots.unshift(slot);
  save("slots", slots);
}

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

export function getPosts(): DemoPost[] {
  return load<DemoPost[]>("posts", DEMO_POSTS);
}
export function addPost(p: DemoPost) {
  const posts = getPosts();
  posts.unshift(p);
  save("posts", posts);
}

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
