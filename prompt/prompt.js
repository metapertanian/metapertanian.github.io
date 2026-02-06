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
          { title: "Scene 5", display: "Jesika: Tapi sering kali kita lupa, siapa yang sebenarnya bertanggung jawab menjaga kelas ini.", prompt: `Scene 5

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
          { title: "Scene 6", display: "Najwa: Hari ini jadwal piket kita, dan menurutku ini bukan cuma soal tugas.", prompt: `Scene 6
Najwa stands near the classroom door, holding a broom and looking determined. The classroom is tidy but still has small messes.
Her uniform has a large bold name text: "NAJWA".
Visible on walls: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: slow push-in, soft natural lighting, sense of responsibility awakening.
Voice over (Indonesian):
“Hari ini jadwal piket kita, dan menurutku ini bukan cuma soal tugas.”
AI note:
Dialogue must remain in Indonesian. Focus on character determination and subtle school environment details.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 7", display: "Salsa: Iya, daripada nunggu atau saling berharap, lebih baik kita mulai sekarang.", prompt: `Scene 7
Salsa steps forward beside Najwa, smiling slightly, ready to help. Classroom feels inviting.
Her uniform shows large bold name text: "SALSA".
School signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: gentle side tracking shot, warm lighting to show collaboration.
Voice over (Indonesian):
“Iya, daripada nunggu atau saling berharap, lebih baik kita mulai sekarang.”
AI note:
Highlight teamwork beginning and proactive attitude.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 8", display: "Diyah: Kalau dikerjain bareng-bareng, pasti terasa lebih ringan.", prompt: `Scene 8
Dyah joins, holding a cloth and looking cheerful. She starts wiping a desk with Najwa nearby.
Her uniform shows large bold name text: "DYAH".
Class signs remain visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft animated lighting, collaborative mood.
Voice over (Indonesian):
“Kalau dikerjain bareng-bareng, pasti terasa lebih ringan.”
AI note:
Focus on teamwork and light-hearted energy among students.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 9", display: "Angel: Dan kelas juga bisa langsung dipakai dengan nyaman.", prompt: `Scene 9
Angel picks up a trash bag, smiling, as she moves toward a corner. Classroom looks noticeably tidier.
Her uniform shows large bold name text: "ANGEL".
Background still shows: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: tracking shot following Angel, soft sunlight through windows.
Voice over (Indonesian):
“Dan kelas juga bisa langsung dipakai dengan nyaman.”
AI note:
Show visible classroom improvement and satisfaction.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 10", display: "Jesika: Oke, kita bagi tugas biar lebih rapi dan cepat.", prompt: `Scene 10
Jesika stands near the front of the classroom, holding a checklist and pointing to areas that need attention.
Her uniform shows large bold name text: "JESIKA".
Classroom signage visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, slightly elevated angle, organized and motivational.
Voice over (Indonesian):
“Oke, kita bagi tugas biar lebih rapi dan cepat.”
AI note:
Highlight planning and leadership. Emphasize cooperative spirit.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 11–15 (Pembagian Tugas)",
        scenes: [
          { title: "Scene 11", display: "Najwa: Kita kerjain sesuai bagian masing-masing, tapi tetap saling bantu.", prompt: `Scene 11
Najwa stands at the center of the classroom, gesturing toward desks while talking to friends.
Her uniform has large bold name text: "NAJWA".
Background signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, soft warm lighting, encouraging collaborative energy.
Voice over (Indonesian):
“Kita kerjain sesuai bagian masing-masing, tapi tetap saling bantu.”
AI note:
Focus on teamwork and organization. Classroom should feel inviting and motivating.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 12", display: "Salsa: Aku bagian menyapu lantai dan membersihkan area depan kelas.", prompt: `Scene 12
Salsa sweeps the classroom floor, smiling and focused. Dust particles subtly catch sunlight.
Her uniform shows large bold name text: "SALSA".
School signs visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: low-angle tracking shot along the floor, warm lighting highlighting activity.
Voice over (Indonesian):
“Aku bagian menyapu lantai dan membersihkan area depan kelas.”
AI note:
Emphasize movement, energy, and satisfaction from cleaning.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 13", display: "Diyah: Kalau aku akan merapikan meja dan kursi supaya tertata rapi.", prompt: `Scene 13
Dyah arranges desks and chairs neatly in rows. She looks content, focused on order.
Her uniform has large bold name text: "DYAH".
Visible classroom signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: overhead medium shot, gentle lighting to highlight orderliness.
Voice over (Indonesian):
“Kalau aku akan merapikan meja dan kursi supaya tertata rapi.”
AI note:
Show clear visual improvement in classroom setup. Emphasize care in organizing.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 14", display: "Angel: Aku buang sampah dan bersihin sudut kelas yang sering terlewat.", prompt: `Scene 14
Angel collects trash, tying small bags with a satisfied smile. Corners of classroom look cleaner.
Her uniform shows large bold name text: "ANGEL".
Background signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft focus on hands and trash bag, sunny side light through windows.
Voice over (Indonesian):
“Aku buang sampah dan bersihin sudut kelas yang sering terlewat.”
AI note:
Highlight care for details and sense of accomplishment.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 15", display: "Jesika: Papan tulis dan jendela biar aku yang urus.", prompt: `Scene 15
Jesika wipes the whiteboard and cleans the windows, smiling at progress.
Her uniform shows large bold name text: "JESIKA".
Classroom signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, sunlight streaming in, reflective and uplifting mood.
Voice over (Indonesian):
“Papan tulis dan jendela biar aku yang urus.”
AI note:
Focus on finishing touches, leadership, and care for the environment.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 16–20 (Proses & Kerja Sama)",
        scenes: [
          { title: "Scene 16", display: "Najwa: Kelihatan ya, kalau semua bergerak, suasana kelas mulai berubah.", prompt: `Scene 16
Najwa observes the classroom, now looking noticeably cleaner and more organized. She smiles proudly.
Her uniform shows large bold name text: "NAJWA".
Background: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, soft lighting highlighting the improved classroom atmosphere.
Voice over (Indonesian):
“Kelihatan ya, kalau semua bergerak, suasana kelas mulai berubah.”
AI note:
Focus on visible transformation and Najwa’s satisfaction.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 17", display: "Salsa: Ternyata nyapu nggak capek kalau dilakukan dengan niat.", prompt: `Scene 17
Salsa continues sweeping with energy and a cheerful expression. Floor is now shining slightly.
Her uniform shows large bold name text: "SALSA".
Class signage visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: low-angle tracking shot along the floor, capturing movement and reflection of light.
Voice over (Indonesian):
“Ternyata nyapu nggak capek kalau dilakukan dengan niat.”
AI note:
Emphasize physical activity, happiness, and sense of accomplishment.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 18", display: "Diyah: Meja yang rapi bikin kelas kelihatan lebih teratur.", prompt: `Scene 18
Dyah stands back from the neatly arranged desks and chairs, nodding in approval.
Her uniform shows large bold name text: "DYAH".
Visible school signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, slightly overhead angle, warm and orderly mood.
Voice over (Indonesian):
“Meja yang rapi bikin kelas kelihatan lebih teratur.”
AI note:
Highlight visual clarity and satisfaction in tidiness.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 19", display: "Angel: Sampah kecil kalau dibersihkan sekarang, nggak akan jadi masalah besar.", prompt: `Scene 19
Angel picks up the last bits of trash, giving a small thumbs-up. Classroom corners look spotless.
Her uniform shows large bold name text: "ANGEL".
Background signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft focus on Angel’s expression and cleaned corners.
Voice over (Indonesian):
“Sampah kecil kalau dibersihkan sekarang, nggak akan jadi masalah besar.”
AI note:
Show attention to detail and proactive habit forming.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 20", display: "Jesika: Papan tulis bersih bikin pelajaran nanti lebih jelas.", prompt: `Scene 20
Jesika wipes the final streaks from the whiteboard, smiling as sunlight falls through the window.
Her uniform shows large bold name text: "JESIKA".
Classroom signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, soft backlight, uplifting and satisfying finish.
Voice over (Indonesian):
“Papan tulis bersih bikin pelajaran nanti lebih jelas.”
AI note:
Emphasize finishing touches, care for detail, and classroom readiness.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 21–25 (Makna Piket Kelas)",
        scenes: [
          { title: "Scene 21", display: "Najwa: Dari piket kelas, kita belajar melakukan sesuatu tanpa harus disuruh.", prompt: `Scene 21
Najwa stands in the middle of the now-clean classroom, looking thoughtfully around at her friends.
Her uniform has large bold name text: "NAJWA".
Background signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft reflective lighting, gentle focus on Najwa’s expression.
Voice over (Indonesian):
“Dari piket kelas, kita belajar melakukan sesuatu tanpa harus disuruh.”
AI note:
Focus on reflection and subtle emotional insight. Classroom should feel calm and organized.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 22", display: "Salsa: Bukan karena takut ditegur, tapi karena sadar itu tanggung jawab.", prompt: `Scene 22
Salsa leans on a desk, smiling warmly at her friends, conveying awareness and responsibility.
Her uniform shows large bold name text: "SALSA".
Visible classroom signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, warm light highlighting her thoughtful expression.
Voice over (Indonesian):
“Bukan karena takut ditegur, tapi karena sadar itu tanggung jawab.”
AI note:
Emphasize personal growth and sense of responsibility.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 23", display: "Dyah: Kebiasaan kecil seperti ini membentuk sikap kita.", prompt: `Scene 23
Dyah arranges a few remaining items on desks, smiling slightly with satisfaction.
Her uniform shows large bold name text: "DYAH".
Background signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft light on her hands and face, calm and reflective mood.
Voice over (Indonesian):
“Kebiasaan kecil seperti ini membentuk sikap kita.”
AI note:
Highlight the small yet meaningful actions and their impact.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 24", display: "Angel: Kalau satu orang malas, yang lain akan merasa terbebani.", prompt: `Scene 24
Angel observes her friends finishing tasks, looking thoughtful. Classroom is spotless.
Her uniform shows large bold name text: "ANGEL".
Class signage remains visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, side angle, warm natural light to convey reflection.
Voice over (Indonesian):
“Kalau satu orang malas, yang lain akan merasa terbebani.”
AI note:
Focus on interdependence among students and empathy.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 25", display: "Jesika: Tapi kalau semua peduli, semuanya terasa adil.", prompt: `Scene 25
Jesika smiles as she looks at the finished classroom, giving a small nod of approval.
Her uniform shows large bold name text: "JESIKA".
Background: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, soft warm light, uplifting and harmonious mood.
Voice over (Indonesian):
“Tapi kalau semua peduli, semuanya terasa adil.”
AI note:
Highlight teamwork, fairness, and satisfaction from shared responsibility.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 26–30 (Dampak & Nilai Kehidupan)",
        scenes: [
          { title: "Scene 26", display: "Najwa: Kelas yang bersih membuat suasana belajar lebih nyaman.", prompt: `Scene 26
Najwa sits at her desk, looking around the clean classroom with a satisfied smile.
Her uniform has large bold name text: "NAJWA".
Background signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, soft natural lighting, warm and comfortable classroom atmosphere.
Voice over (Indonesian):
“Kelas yang bersih membuat suasana belajar lebih nyaman.”
AI note:
Emphasize the visible improvement and emotional comfort from cleanliness.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 27", display: "Salsa: Dan membuat kita lebih menghargai tempat ini.", prompt: `Scene 27
Salsa adjusts a chair while looking at the classroom, smiling gently with appreciation.
Her uniform shows large bold name text: "SALSA".
Visible classroom signage: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, soft sunlight streaming in, calm and reflective mood.
Voice over (Indonesian):
“Dan membuat kita lebih menghargai tempat ini.”
AI note:
Highlight respect for shared spaces and personal reflection.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 28", display: "Dyah: Karena sekolah bukan hanya tempat belajar pelajaran.", prompt: `Scene 28
Dyah gazes out the window, thoughtful. Classroom looks orderly and peaceful.
Her uniform shows large bold name text: "DYAH".
Background signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, warm lighting, slightly pensive but serene mood.
Voice over (Indonesian):
“Karena sekolah bukan hanya tempat belajar pelajaran.”
AI note:
Emphasize broader life lessons beyond academics.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 29", display: "Angel: Tapi juga tempat belajar sikap dan tanggung jawab.", prompt: `Scene 29
Angel stands near the whiteboard, looking at her friends, smiling proudly.
Her uniform shows large bold name text: "ANGEL".
Visible signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, soft backlight highlighting camaraderie.
Voice over (Indonesian):
“Tapi juga tempat belajar sikap dan tanggung jawab.”
AI note:
Highlight moral lesson and collaborative growth.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 30", display: "Jesika: Apa yang kita biasakan di sini, akan terbawa ke kehidupan nanti.", prompt: `Scene 30
Jesika looks around at the group of friends, smiling warmly at their teamwork.
Her uniform shows large bold name text: "JESIKA".
Background: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium wide shot, soft warm sunlight, uplifting and reflective mood.
Voice over (Indonesian):
“Apa yang kita biasakan di sini, akan terbawa ke kehidupan nanti.”
AI note:
Focus on life lesson and forward-looking perspective.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      },
      {
        subjudul: "Scene 31–33 (Penutup)",
        scenes: [
          { title: "Scene 31", display: "Najwa: Piket kelas memang terlihat sederhana.", prompt: `Scene 31
Najwa stands in the center of the classroom, looking directly at camera with a calm, reflective expression.
Her uniform shows large bold name text: "NAJWA".
Visible classroom signs: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium close-up, soft cinematic lighting, reflective and calm tone.
Voice over (Indonesian):
“Piket kelas memang terlihat sederhana.”
AI note:
Emphasize simplicity and introduction to closing reflection.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 32", display: "Salsa: Tapi dari kebiasaan sederhana itulah karakter dibentuk.", prompt: `Scene 32
Salsa stands near Najwa, looking at her friends and smiling gently, showing understanding and warmth.
Her uniform shows large bold name text: "SALSA".
Background: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: medium shot, soft warm backlight, emotional and calm.
Voice over (Indonesian):
“Tapi dari kebiasaan sederhana itulah karakter dibentuk.”
AI note:
Highlight moral conclusion and emotional resonance.
Aspect ratio 9:16, Disney-style cartoon.` },
          { title: "Scene 33", display: "Semua / VO: Piket kelas adalah kebiasaan kecil yang membentuk karakter besar.", prompt: `Scene 33
All five students (Najwa, Salsa, Dyah, Angel, Jesika) stand together in the middle of the clean classroom, smiling proudly at the camera.
Uniforms show large bold name texts on each character.
Classroom signage clearly visible: "SMA 2 Kotabumi" and "Kelas 10.6".
Camera: wide shot, soft fade-out lighting, calm and confident atmosphere.
Voice over (Indonesian, fade out, calm & firm):
“Piket kelas adalah kebiasaan kecil yang membentuk karakter besar.”
AI note:
End scene with unity, reflection, and emotional closure.
Aspect ratio 9:16, Disney-style cartoon.` }
        ]
      }
    ]
  }
];