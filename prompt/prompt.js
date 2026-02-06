const prompts = [
  {
    judul: "Bukan Sekadar Piket",
    sections: [
      {
        subjudul: "Scene 1–5 (Hook Kuat & Kondisi Awal)",
        scenes: [
          { title: "Scene 1", display: "Najwa: Setiap hari kita belajar di kelas ini, tapi pernah nggak kita benar-benar memperhatikan keadaannya?", prompt: `Scene 1

A bright Indonesian high school classroom in the morning. Five female students wear school uniforms with hijab. One student, NAJWA, stands near the window. 
On her uniform, a large bold name text on the chest reads: "NAJWA".
On the classroom wall, visible text reads: "SMA 2 Kotabumi" and "Kelas 10.6".

Camera: slow cinematic push-in, soft natural lighting, calm and reflective mood.

Voice over (Indonesian):
“Setiap hari kita belajar di kelas ini, tapi pernah nggak kita benar-benar memperhatikan keadaannya?”

AI note:
Dialogue must remain in Indonesian.
Prioritize clear character focus, school environment, and emotional opening hook.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 2", display: "Salsa: Kadang masuk kelas, meja berantakan, sampah masih ada, dan suasananya jadi nggak nyaman.", prompt: `Scene 2

The camera pans across a slightly messy classroom: scattered papers, unaligned desks, a trash bin not emptied.
SALSA enters the frame, looking around with a concerned expression.
Her uniform shows a large bold name text: "SALSA".
Background still shows: "SMA 2 Kotabumi" and "Kelas 10.6".

Camera: gentle handheld feel, realistic school atmosphere.

Voice over (Indonesian):
“Kadang masuk kelas, meja berantakan, sampah masih ada, dan suasananya jadi nggak nyaman.”

AI note:
Dialogue must remain in Indonesian.
Emphasize visual contrast between ideal and real classroom condition.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 3", display: "Diyah: Kalau kelas kayak gini, rasanya semangat belajar juga ikut turun.", prompt: `Scene 3

DIYAH sits at her desk, resting her chin on her hand, looking unmotivated.
The classroom feels dull and quiet.
Her uniform has a large bold name text: "DIYAH".
Class signs "SMA 2 Kotabumi" and "Kelas 10.6" remain visible.

Camera: medium close-up, slightly muted colors to show low motivation.

Voice over (Indonesian):
“Kalau kelas kayak gini, rasanya semangat belajar juga ikut turun.”

AI note:
Dialogue must remain in Indonesian.
Use facial expression and lighting to support emotional tone.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 4", display: "Angel: Padahal kelas ini tempat kita menghabiskan waktu hampir seharian.", prompt: `Scene 4

ANGEL stands near the classroom door, looking around thoughtfully.
Other students are visible in the background.
Her uniform displays a large bold name text: "ANGEL".
School identity text "SMA 2 Kotabumi" and "Kelas 10.6" is clearly shown.

Camera: slow side tracking shot, thoughtful and calm mood.

Voice over (Indonesian):
“Padahal kelas ini tempat kita menghabiskan waktu hampir seharian.”

AI note:
Dialogue must remain in Indonesian.
Highlight emotional connection between students and classroom space.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 5", display: "Jesika: Tapi sering kali kita lupa, siapa yang sebenarnya bertanggung jawab menjaga kelas ini.", prompt: "Scene 5

JESIKA stands at the front of the classroom, looking directly toward the camera with a serious but gentle expression.
Her uniform shows a large bold name text: "JESIKA".
Classroom signage reads clearly: "SMA 2 Kotabumi" and "Kelas 10.6".

Camera: steady frontal shot, building awareness and anticipation.

Voice over (Indonesian):
“Tapi sering kali kita lupa, siapa yang sebenarnya bertanggung jawab menjaga kelas ini.”

AI note:
Dialogue must remain in Indonesian.
End the scene with a reflective pause to set up the next scenes.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 6–10 (Kesadaran & Keputusan)",
        scenes: [
          { title: "Scene 6", display: "Najwa: Hari ini jadwal piket kita, dan menurutku ini bukan cuma soal tugas.", prompt: `` },
          { title: "Scene 7", display: "Salsa: Iya, daripada nunggu atau saling berharap, lebih baik kita mulai sekarang.", prompt: `` },
          { title: "Scene 8", display: "Diyah: Kalau dikerjain bareng-bareng, pasti terasa lebih ringan.", prompt: `` },
          { title: "Scene 9", display: "Angel: Dan kelas juga bisa langsung dipakai dengan nyaman.", prompt: `` },
          { title: "Scene 10", display: "Jesika: Oke, kita bagi tugas biar lebih rapi dan cepat.", prompt: `` }
        ]
      },
      {
        subjudul: "Scene 11–15 (Pembagian Tugas)",
        scenes: [
          { title: "Scene 11", display: "Najwa: Kita kerjain sesuai bagian masing-masing, tapi tetap saling bantu.", prompt: `` },
          { title: "Scene 12", display: "Salsa: Aku bagian menyapu lantai dan membersihkan area depan kelas.", prompt: `` },
          { title: "Scene 13", display: "Diyah: Kalau aku akan merapikan meja dan kursi supaya tertata rapi.", prompt: `` },
          { title: "Scene 14", display: "Angel: Aku buang sampah dan bersihin sudut kelas yang sering terlewat.", prompt: `` },
          { title: "Scene 15", display: "Jesika: Papan tulis dan jendela biar aku yang urus.", prompt: `` }
        ]
      },
      {
        subjudul: "Scene 16–20 (Proses & Kerja Sama)",
        scenes: [
          { title: "Scene 16", display: "Najwa: Kelihatan ya, kalau semua bergerak, suasana kelas mulai berubah.", prompt: `` },
          { title: "Scene 17", display: "Salsa: Ternyata nyapu nggak capek kalau dilakukan dengan niat.", prompt: `` },
          { title: "Scene 18", display: "Diyah: Meja yang rapi bikin kelas kelihatan lebih teratur.", prompt: `` },
          { title: "Scene 19", display: "Angel: Sampah kecil kalau dibersihkan sekarang, nggak akan jadi masalah besar.", prompt: `` },
          { title: "Scene 20", display: "Jesika: Papan tulis bersih bikin pelajaran nanti lebih jelas.", prompt: `` }
        ]
      },
      {
        subjudul: "Scene 21–25 (Makna Piket Kelas)",
        scenes: [
          { title: "Scene 21", display: "Najwa: Dari piket kelas, kita belajar melakukan sesuatu tanpa harus disuruh.", prompt: `` },
          { title: "Scene 22", display: "Salsa: Bukan karena takut ditegur, tapi karena sadar itu tanggung jawab.", prompt: `` },
          { title: "Scene 23", display: "Diyah: Kebiasaan kecil seperti ini membentuk sikap kita.", prompt: `` },
          { title: "Scene 24", display: "Angel: Kalau satu orang malas, yang lain akan merasa terbebani.", prompt: `` },
          { title: "Scene 25", display: "Jesika: Tapi kalau semua peduli, semuanya terasa adil.", prompt: `` }
        ]
      },
      {
        subjudul: "Scene 26–30 (Dampak & Nilai Kehidupan)",
        scenes: [
          { title: "Scene 26", display: "Najwa: Kelas yang bersih membuat suasana belajar lebih nyaman.", prompt: `` },
          { title: "Scene 27", display: "Salsa: Dan membuat kita lebih menghargai tempat ini.", prompt: `` },
          { title: "Scene 28", display: "Diyah: Karena sekolah bukan hanya tempat belajar pelajaran.", prompt: `` },
          { title: "Scene 29", display: "Angel: Tapi juga tempat belajar sikap dan tanggung jawab.", prompt: `` },
          { title: "Scene 30", display: "Jesika: Apa yang kita biasakan di sini, akan terbawa ke kehidupan nanti.", prompt: `` }
        ]
      },
      {
        subjudul: "Scene 31–33 (Penutup)",
        scenes: [
          { title: "Scene 31", display: "Najwa: Piket kelas memang terlihat sederhana.", prompt: `` },
          { title: "Scene 32", display: "Salsa: Tapi dari kebiasaan sederhana itulah karakter dibentuk.", prompt: `` },
          { title: "Scene 33", display: "Semua / VO: Piket kelas adalah kebiasaan kecil yang membentuk karakter besar.", prompt: `` }
        ]
      }
    ]
  }
];