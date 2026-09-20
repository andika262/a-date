import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lazy, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, Camera, Copy, Heart, ImagePlus, LoaderCircle, LogIn, LogOut, Map, MapPin, MessageCircleHeart, Share2, Sparkles, Trash2, X } from "lucide-react";

import heroImage from "@/assets/dwi-asy-syafa-5Y3C87gHeq0-unsplash.jpg";
import alamImage from "@/assets/abdul-ridwan-zSS0FLR_Rbc-unsplash.jpg";
import bragaImage from "@/assets/image.png";
import buahBatuImage from "@/assets/heri-susilo-yONZh7w144k-unsplash.jpg";
import kelilingImage from "@/assets/hani-fildzah-30h0YG29W30-unsplash.jpg";
import secretImage from "@/assets/secret-place.jpg";
import museum from "@/assets/ca9i8fhloi1c1iu.jpeg";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { createRomanticMessage } from "@/lib/romance.functions";
import type { TripLocation } from "@/components/TripMap";

const TripMap = lazy(() => import("@/components/TripMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Weekend ke Bandung? | 3–4 Oktober" },
      { name: "description", content: "Sebuah ajakan romantis untuk menghabiskan dua hari bersama di Bandung." },
      { property: "og:title", content: "Weekend ke Bandung? | 3–4 Oktober" },
      { property: "og:description", content: "Dua hari, satu malam, dan cerita kecil yang ingin kubuat bersamamu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const plans = [
  {
    day: "01",
    storageKey: "02",
    date: "Sabtu, 3 Oktober",
    subtitle: "Hari paling penuh semoga juga jadi hari yang paling kita ingat.",
    items: [
      { time: "Pagi", title: "Jalan-jalan di Kota Bandung", description: "Mulai dari Jalan Asia Afrika, lalu menikmati sudut-sudut kota sambil berjalan beriringan dan mengumpulkan foto kecil tentang kita.", query: "Jalan Asia Afrika Bandung", image: kelilingImage, imageAlt: "Suasana jalan-jalan di Kota Bandung" },
      { time: "Sore", title: "Ke Tempat Secret", description: "Satu tempat spesial yang sengaja kurahasiakan cukup ikut denganku dan siapkan senyum terbaikmu.", image: secretImage, imageAlt: "Tempat kejutan yang masih dirahasiakan", secret: true },
      { time: "Malam", title: "Ngopi di Braga", description: "Duduk berdua ditemani kopi hangat, lampu-lampu Braga, dan obrolan yang semoga panjang.", query: "Jalan Braga Bandung", image: bragaImage, imageAlt: "Suasana malam dan kedai kopi di Braga" },
    ],
  },
  {
    day: "02",
    storageKey: "03",
    date: "Minggu, 4 Oktober",
    subtitle: "Sebelum pulang, aku ingin waktunya berjalan sedikit lebih lambat.",
    items: [
      { time: "Pagi · Siang", title: "Keliling Jalan-jalan", description: "Mulai dari Jalan Asia Afrika, lalu berhenti di tempat yang menarik hati, mengambil banyak foto, dan menikmati sisa waktu tanpa terburu-buru.", query: "Jalan Asia Afrika Bandung", image: museum, imageAlt: "Pemandangan hijau untuk jalan-jalan di Bandung" },
      { time: "Sore · Sebelum Pulang", title: "Jajan Sebelum Pulang", description: "Mencari camilan untuk dibawa pulang sebelum kita kembali melanjutkan aktivitas masing-masing.", query: "Tiramisusu Bandung Buah Batu", image: buahBatuImage, imageAlt: "Jajanan manis khas Bandung" },
    ],
  },
];

const tripLocations: TripLocation[] = [
  { order: 1, name: "Jalan Asia Afrika", moment: "Sabtu · Pagi", note: "Titik awal jalan santai dan mengumpulkan foto bersama.", lat: -6.9213, lng: 107.6092, query: "Jalan Asia Afrika Bandung" },
  { order: 2, name: "Secret Place", moment: "Sabtu · Sore", note: "Satu kejutan yang tetap menjadi rahasia sampai kita tiba.", lat: -6.9075, lng: 107.6115, secret: true },
  { order: 3, name: "Braga", moment: "Sabtu · Malam", note: "Kopi hangat dan obrolan berdua.", lat: -6.9178, lng: 107.6091, query: "Jalan Braga Bandung" },
  { order: 4, name: "Keliling Bandung", moment: "Minggu · Pagi", note: "Mulai dari Jalan Asia Afrika, lalu menikmati sisa waktu tanpa terburu-buru.", lat: -6.9213, lng: 107.6092, query: "Jalan Asia Afrika Bandung" },
  { order: 5, name: "Jajan di Buah Batu", moment: "Minggu · Sore", note: "Penutup manis sebelum kembali ke aktivitas masing-masing.", lat: -6.9539, lng: 107.6373, query: "Tiramisusu Bandung Buah Batu" },
];

const gallery = [
  { image: alamImage, title: "Alam Bandung", moment: "Sabtu siang", caption: "Udara dingin, pemandangan luas, dan kamu di sebelahku." },
  { image: bragaImage, title: "Braga", moment: "Sabtu malam", caption: "Berjalan di bawah lampu kota, tanpa perlu tahu harus pulang jam berapa." },
  { image: kelilingImage, title: "Keliling Kota", moment: "Minggu siang", caption: "Setiap sudut bisa jadi kenangan kalau kita menikmatinya bersama." },
  { image: buahBatuImage, title: "Penutup yang Manis", moment: "Sebelum pulang", caption: "Satu pencuci mulut, dua sendok, dan alasan kecil untuk kembali lagi." },
];

const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent("Jalan Asia Afrika Bandung")}&destination=${encodeURIComponent("Tiramisusu Bandung Buah Batu")}&waypoints=${encodeURIComponent(tripLocations.filter((location) => !location.secret && location.query).slice(1, -1).map((location) => location.query).join("|"))}&travelmode=driving`;

function Index() {
  const [wishlist, setWishlist] = useState("");
  const [phone, setPhone] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<Record<string, { id: string; url: string; storagePath: string; sortOrder: number }[]>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [managePhotos, setManagePhotos] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [busyPhoto, setBusyPhoto] = useState<string | null>(null);
  const [romanticNote, setRomanticNote] = useState("");
  const [romanticMessage, setRomanticMessage] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const generateRomance = useServerFn(createRomanticMessage);
  const touchStartX = useRef<number | null>(null);
  const activePhoto = lightboxIndex === null ? undefined : gallery[lightboxIndex];

  const loadGallery = async () => {
    const { data } = await supabase.from("trip_photos").select("id, plan_key, storage_path, sort_order").order("sort_order");
    if (!data) return;
    const grouped: Record<string, { id: string; url: string; storagePath: string; sortOrder: number }[]> = {};
    await Promise.all(data.map(async (photo) => {
      const { data: signed } = await supabase.storage.from("trip-photos").createSignedUrl(photo.storage_path, 3600);
      if (!signed?.signedUrl) return;
      const item = { id: photo.id, url: signed.signedUrl, storagePath: photo.storage_path, sortOrder: photo.sort_order };
      grouped[photo.plan_key] = [...(grouped[photo.plan_key] ?? []), item];
    }));
    Object.values(grouped).forEach((items) => items.sort((a, b) => a.sortOrder - b.sortOrder));
    setGalleryPhotos(grouped);
  };

  const refreshOwner = async (id: string | null) => {
    setUserId(id);
    if (!id) { setIsOwner(false); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", id);
    if (roles?.some((row) => row.role === "owner")) { setIsOwner(true); return; }
    await supabase.from("user_roles").insert({ user_id: id, role: "owner" });
    const { data: claimed } = await supabase.from("user_roles").select("role").eq("user_id", id);
    setIsOwner(Boolean(claimed?.some((row) => row.role === "owner")));
  };

  useEffect(() => {
    void loadGallery();
    void supabase.auth.getUser().then(({ data }) => refreshOwner(data.user?.id ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void refreshOwner(session?.user.id ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (createAccount: boolean) => {
    setAuthMessage("");
    const result = createAccount
      ? await supabase.auth.signUp({ email: authEmail, password: authPassword })
      : await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthMessage(result.error ? result.error.message : createAccount && !result.data.session ? "Periksa email untuk mengonfirmasi akun, lalu masuk." : "Berhasil masuk sebagai pemilik.");
  };

  const uploadPhoto = async (planKey: string, file?: File) => {
    if (!file || !userId || !isOwner) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) { setAuthMessage("Pilih gambar berukuran maksimal 8 MB."); return; }
    setBusyPhoto(planKey);
    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
    const storagePath = `${userId}/${planKey}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("trip-photos").upload(storagePath, file, { contentType: file.type });
    if (!uploadError) {
      const nextOrder = galleryPhotos[planKey]?.length ?? 0;
      await supabase.from("trip_photos").insert({ plan_key: planKey, storage_path: storagePath, sort_order: nextOrder, created_by: userId });
      await loadGallery();
    } else setAuthMessage(uploadError.message);
    setBusyPhoto(null);
  };

  const removePhoto = async (planKey: string, photoId: string, storagePath: string) => {
    if (!isOwner || !window.confirm("Hapus foto ini dari rencana?")) return;
    setBusyPhoto(photoId);
    await supabase.storage.from("trip-photos").remove([storagePath]);
    await supabase.from("trip_photos").delete().eq("id", photoId);
    await loadGallery();
    setBusyPhoto(null);
  };

  const movePhoto = async (planKey: string, photoId: string, direction: -1 | 1) => {
    const items = galleryPhotos[planKey] ?? [];
    const index = items.findIndex((photo) => photo.id === photoId);
    const target = items[index + direction];
    const current = items[index];
    if (!current || !target || !isOwner) return;
    setBusyPhoto(photoId);
    await Promise.all([
      supabase.from("trip_photos").update({ sort_order: target.sortOrder }).eq("id", current.id),
      supabase.from("trip_photos").update({ sort_order: current.sortOrder }).eq("id", target.id),
    ]);
    await loadGallery();
    setBusyPhoto(null);
  };

  const makeRomanticMessage = async () => {
    if (!romanticNote.trim()) return;
    setAiBusy(true); setAiError("");
    try {
      const result = await generateRomance({ data: { note: romanticNote } });
      setRomanticMessage(result.message);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Pesan belum berhasil dibuat.");
    } finally { setAiBusy(false); }
  };

  const closeLightbox = () => setLightboxIndex(null);
  const showPrevious = () => setLightboxIndex((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length);
  const showNext = () => setLightboxIndex((current) => current === null ? null : (current + 1) % gallery.length);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || Math.abs(start - end) < 45) return;
    if (start > end) showNext();
    else showPrevious();
  };

  const sendPlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destination = phone.replace(/\D/g, "");
    const text = `Aku mau ikut weekend ke Bandung sama kamu! 🤍\n\nWishlist-ku: ${wishlist || "Aku ikut rencana kamu aja—yang penting sama kamu."}`;
    const url = destination ? `https://wa.me/${destination}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-accent/50">
      <section className="coastal-mesh relative min-h-[92svh] overflow-hidden">
        <Heart className="float-heart absolute right-[8%] top-[8%] size-7 text-primary/40" strokeWidth={1.5} aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-12 lg:gap-14 lg:px-12">
          <div className="order-2 pb-6 lg:order-1 lg:col-span-5 lg:pb-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-secondary-foreground"><CalendarDays className="size-4" />3–4 Oktober · simpan tanggalnya, ya</div>
            <h1 className="font-display max-w-[12ch] text-4xl font-semibold leading-[1.02] text-balance sm:text-6xl lg:text-7xl">Mau menghabiskan satu weekend bersamaku?</h1>
            <p className="mt-5 max-w-[47ch] text-base leading-relaxed text-foreground/70 sm:text-lg">Aku menyiapkan perjalanan kecil ke Bandung. Dua hari, satu malam dan banyak waktu yang ingin kunikmati cuma bersamamu.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="getaway" size="getaway"><a href="#rencana">Lihat rencana kita <ArrowDown /></a></Button>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" /> Bandung, Jawa Barat</span>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative">
              <img src={heroImage} alt="Pemandangan perkebunan teh dan pegunungan Bandung" width={1440} height={1080} fetchPriority="high" className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl shadow-primary/10" />
              <div className="absolute -bottom-4 left-4 rounded-lg bg-background/90 px-4 py-3 shadow-lg backdrop-blur sm:-left-4"><p className="text-[11px] font-semibold uppercase text-primary">Pelarian kecil kita</p><p className="font-display text-sm font-medium">Bandung, tunggu kami berdua.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0"><p className="text-xs font-semibold uppercase text-primary">Tempat yang kupilih untuk kita</p><h2 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">Bandung, yuk?</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Bukan perjalanan yang kaku. Cuma udara dingin, kopi hangat, jalan santai, dan aku yang ingin punya lebih banyak waktu bersamamu.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[["01", "Udara adem", "Biar kepala lebih ringan dan kita bisa bicara dari hati ke hati."], ["02", "Ngopi berdua", "Bukan soal kopinya, tapi siapa yang duduk di seberang meja."], ["03", "Jalan tanpa buru-buru", "Karena bersamamu, tersesat sedikit pun mungkin tetap terasa menyenangkan."]].map(([number, title, copy], index) => (
            <article key={number} className={`rounded-lg p-6 ring-1 ring-border ${index === 1 ? "bg-accent/35" : "bg-secondary/65"}`}><p className="text-xs font-semibold text-primary">{number}</p><h3 className="font-display mt-5 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p></article>
          ))}
        </div>
      </section>

      <section id="rencana" className="bg-surface-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-semibold uppercase text-primary">Rencana kecil kita</p><h2 className="font-display mt-2 text-3xl font-semibold sm:text-5xl">2 hari, 1 malam, berdua</h2>
          {managePhotos && !userId && <div className="mt-5 grid gap-3 rounded-lg bg-background p-5 ring-1 ring-border sm:grid-cols-2"><input value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} type="email" placeholder="Email pemilik" className="rounded-lg bg-background px-4 py-3 text-sm ring-1 ring-border outline-none focus:ring-2 focus:ring-ring" /><input value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} type="password" placeholder="Kata sandi" className="rounded-lg bg-background px-4 py-3 text-sm ring-1 ring-border outline-none focus:ring-2 focus:ring-ring" /><div className="flex flex-wrap gap-2 sm:col-span-2"><Button type="button" variant="getaway" onClick={() => void signInWithEmail(false)}>Masuk</Button><Button type="button" variant="outline" onClick={() => void signInWithEmail(true)}>Buat akun pemilik</Button><Button type="button" variant="ghost" onClick={() => void lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })}>Masuk dengan Google</Button></div>{authMessage && <p className="text-sm text-muted-foreground sm:col-span-2">{authMessage}</p>}</div>}
          <div className="mt-12 space-y-14 sm:space-y-20">
            {plans.map((plan) => (
              <article key={plan.day} className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4"><div className="font-display flex items-baseline gap-3"><span className="text-5xl font-semibold text-primary">{plan.day}</span><span className="text-xs font-semibold uppercase text-muted-foreground">Hari</span></div><h3 className="font-display mt-3 text-xl font-semibold">{plan.date}</h3><p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p></div>
                <div className="lg:col-span-8"><ol className="grid gap-6 sm:grid-cols-2">{plan.items.map((item, index) => (
                  <li key={item.title} className="polaroid-card relative flex min-w-0 flex-col bg-card p-3 pb-5 ring-1 ring-border sm:p-4 sm:pb-6">
                    <span className="font-display absolute left-6 top-6 z-10 grid size-9 place-items-center rounded-full bg-background/90 text-sm font-semibold text-primary shadow-sm ring-1 ring-border">0{index + 1}</span>
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <img src={galleryPhotos[`${plan.storageKey}-${index + 1}`]?.[0]?.url ?? item.image} alt={item.imageAlt} width={704} height={528} loading="lazy" className={`h-full w-full object-cover ${item.secret && !galleryPhotos[`${plan.storageKey}-${index + 1}`]?.[0] ? "scale-110 blur-lg" : ""}`} />
                      {item.secret && !galleryPhotos[`${plan.storageKey}-${index + 1}`]?.[0] && <div className="absolute inset-0 grid place-items-center bg-primary/55"><Heart className="size-8 text-primary-foreground" aria-hidden="true" /></div>}
                    </div>
                    {isOwner && managePhotos && <div className="mt-3 space-y-2 border-b border-border pb-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-primary"><ImagePlus className="size-4" /> Tambah atau ganti foto<input type="file" accept="image/*" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => { void uploadPhoto(`${plan.storageKey}-${index + 1}`, event.target.files?.[0]); event.target.value = ""; }} /></label>
                      {(galleryPhotos[`${plan.storageKey}-${index + 1}`] ?? []).map((photo, photoIndex, photos) => <div key={photo.id} className="flex items-center gap-2 rounded-md bg-secondary/60 px-2 py-1.5 text-xs"><span className="min-w-0 flex-1 truncate">Foto {photoIndex + 1}</span><Button type="button" variant="ghost" size="icon" className="size-7" disabled={photoIndex === 0 || busyPhoto !== null} onClick={() => void movePhoto(`${plan.storageKey}-${index + 1}`, photo.id, -1)} aria-label="Naikkan urutan foto"><ArrowUp className="size-3.5" /></Button><Button type="button" variant="ghost" size="icon" className="size-7" disabled={photoIndex === photos.length - 1 || busyPhoto !== null} onClick={() => void movePhoto(`${plan.storageKey}-${index + 1}`, photo.id, 1)} aria-label="Turunkan urutan foto"><ArrowDown className="size-3.5" /></Button><Button type="button" variant="ghost" size="icon" className="size-7" disabled={busyPhoto !== null} onClick={() => void removePhoto(`${plan.storageKey}-${index + 1}`, photo.id, photo.storagePath)} aria-label="Hapus foto"><Trash2 className="size-3.5" /></Button></div>)}
                    </div>}
                    <div className="min-w-0 px-2 pt-5">
                      <p className="text-xs font-semibold uppercase text-primary">{item.time}</p>
                      <h4 className="font-display mt-1 text-xl font-semibold sm:text-2xl">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.description}</p>
                      {item.query ? <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.query)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-strong">Arahkan kita ke sana <ArrowUpRight className="size-4" /></a> : <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><Heart className="size-4" /> Lokasinya masih rahasia</p>}
                    </div>
                  </li>
                ))}</ol></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] md:items-end">
            <div><p className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Map className="size-4" /> Jejak perjalanan kita</p><h2 className="font-display mt-3 text-3xl font-semibold sm:text-5xl">Dari langkah pertama sampai oleh-oleh terakhir.</h2></div>
            <p className="text-sm leading-relaxed text-muted-foreground">Lima titik, satu urutan, dan semoga banyak alasan untuk tersenyum di sepanjang jalan.</p>
          </div>
          <div className="mt-10"><ClientOnly fallback={<div className="grid min-h-[32rem] place-items-center rounded-lg bg-secondary/50 text-sm text-muted-foreground ring-1 ring-border">Menyiapkan peta perjalanan kita…</div>}><TripMap locations={tripLocations} routeUrl={routeUrl} /></ClientOnly></div>
        </div>
      </section>

      <section className="bg-surface-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] md:items-end">
            <div><p className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Camera className="size-4" /> Sedikit bayangan</p><h2 className="font-display mt-3 text-3xl font-semibold sm:text-5xl">Mungkin nanti, galeri ini berisi foto kita.</h2></div>
            <p className="text-sm leading-relaxed text-muted-foreground">Untuk sekarang, ini baru gambaran kecil tentang tempat-tempat yang ingin kudatangi bersamamu.</p>
          </div>
          <div className="gallery-scroll mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-12">
            {gallery.map((photo, index) => (
              <Button key={photo.title} type="button" variant="ghost" onClick={() => setLightboxIndex(index)} className={`group relative h-auto min-w-[82%] snap-center overflow-hidden rounded-lg p-0 text-left shadow-sm ring-1 ring-border sm:min-w-0 ${index === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}`} aria-label={`Buka foto ${photo.title}`}>
                <img src={photo.image} alt={photo.title} width={1408} height={1056} loading="lazy" className={`w-full object-cover transition duration-500 group-hover:scale-[1.025] ${index === 0 ? "aspect-[4/3] h-full" : "aspect-[16/10]"}`} />
                <span className="absolute inset-x-0 bottom-0 bg-gallery-caption p-4 text-primary-foreground sm:p-5"><span className="block text-[11px] font-semibold uppercase opacity-80">{photo.moment}</span><span className="font-display mt-1 block text-xl font-semibold">{photo.title}</span><span className="mt-1 block whitespace-normal text-xs font-normal leading-relaxed opacity-90 sm:text-sm">{photo.caption}</span></span>
              </Button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">Geser untuk melihat cerita berikutnya</p>
        </div>
      </section>

      <section className="coastal-mesh relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-9 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6"><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Sparkles className="size-4" /> Sabtu sore</div><h2 className="font-display mt-3 text-3xl font-semibold sm:text-5xl">Special Secret Place</h2><p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/70">Ada satu tempat yang sengaja kusimpan untukmu. Yang ini belum boleh dibuka biar nanti senyummu datang tanpa aba-aba.</p><div className="mt-7 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground"><Heart className="size-4" /> Tetap rahasia sampai hari itu</div></div>
          <div className="lg:col-span-6"><div className="relative aspect-square w-full overflow-hidden rounded-lg bg-primary shadow-xl shadow-primary/10"><img src={secretImage} alt="Tempat kejutan yang masih dirahasiakan" width={1024} height={1024} loading="lazy" className="h-full w-full scale-110 object-cover blur-2xl" /><div className="absolute inset-0 grid place-items-center bg-primary/75 p-8 text-center"><div className="text-primary-foreground"><Heart className="mx-auto size-9" /><p className="font-display mt-4 text-2xl font-semibold">Nanti, ya.</p><p className="mt-2 text-sm opacity-80">Kejutan kecil ini hanya boleh dilihat saat kita sampai.</p></div></div></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-center">
          <div className="lg:col-span-5"><p className="text-xs font-semibold uppercase text-primary">Satu tempat impianmu?</p><h2 className="font-display mt-3 text-3xl font-semibold sm:text-5xl">Sekarang, boleh aku dengar keinginanmu?</h2><p className="mt-4 leading-relaxed ">Dari daftar di atas atau di luar itu, ada tempat atau makanan yang ingin sekali kamu kunjungi bersamaku?</p></div>
        </div>
      </section>

      <footer className="coastal-mesh px-5 py-16 text-center sm:py-20"><Heart className="mx-auto size-6 text-primary" /><p className="font-display mx-auto mt-5 max-w-2xl text-2xl font-medium leading-snug sm:text-3xl">Dibuat dengan sedikit keberanian, banyak harapan, dan satu rencana kecil ke Bandung.</p><p className="mt-5 text-sm text-muted-foreground">3–4 Oktober · semoga kamu bilang iya.</p></footer>

      {activePhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-lightbox p-3 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-label={`Foto ${activePhoto.title}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <Button type="button" variant="ghost" size="icon" onClick={closeLightbox} className="absolute right-4 top-4 z-10 rounded-full bg-background/15 text-primary-foreground hover:bg-background/25 hover:text-primary-foreground sm:right-7 sm:top-7" aria-label="Tutup galeri"><X /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={showPrevious} className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/15 text-primary-foreground hover:bg-background/25 hover:text-primary-foreground sm:inline-flex" aria-label="Foto sebelumnya"><ArrowLeft /></Button>
          <figure className="flex max-h-[92svh] w-full max-w-5xl flex-col items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={activePhoto.image} alt={activePhoto.title} width={1408} height={1056} className="max-h-[72svh] w-auto max-w-full rounded-lg object-contain shadow-2xl" />
            <figcaption className="mt-4 max-w-2xl text-center text-primary-foreground"><p className="text-xs font-semibold uppercase opacity-70">{activePhoto.moment} · {lightboxIndex + 1}/{gallery.length}</p><h3 className="font-display mt-1 text-2xl font-semibold">{activePhoto.title}</h3><p className="mt-1 text-sm leading-relaxed opacity-85">{activePhoto.caption}</p><p className="mt-3 text-xs opacity-60 sm:hidden">Geser ke kiri atau kanan</p></figcaption>
          </figure>
          <Button type="button" variant="ghost" size="icon" onClick={showNext} className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/15 text-primary-foreground hover:bg-background/25 hover:text-primary-foreground sm:inline-flex" aria-label="Foto berikutnya"><ArrowRight /></Button>
        </div>
      )}
    </main>
  );
}
