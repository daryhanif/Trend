# 🚀 TRENDS — Social Media untuk Freelancer, Developer, dan Mahasiswa

**TRENDS** adalah platform sosial media lintas perangkat yang memungkinkan pengguna untuk:

- Mempamerkan project yang sedang dikerjakan
- Berinteraksi dengan sesama developer, freelancer, atau pelajar
- Mendapatkan inspirasi, feedback, dan kolaborasi

---

## 🧱 Tech Stack

### 🖥️ Frontend

- [Next.Js](https://vitejs.dev/)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.IO](https://socket.io/)

### 🛠️ Backend

- [Express](https://expressjs.com/)
- TypeScript
- [Drizzle ORM](https://orm.drizzle.team/)
- MySQL & MongoDB (kombinasi relational dan document store)
- [Mongoose](https://mongoosejs.com/)
- [Zod](https://zod.dev/) untuk schema validation
- [JWT](https://jwt.io/) untuk authentication

---

## 🔐 Authentication (OAuth & JWT)

Platform menggunakan kombinasi OAuth dan JWT:

- Login menggunakan OAuth (Google, GitHub — opsional)
- Backend mengembalikan token JWT untuk client
- Token digunakan untuk mengakses route yang dilindungi

```env
# .env contoh
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
JWT_SECRET=supersecretkey
```
