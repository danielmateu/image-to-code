import { Form } from "@/components/Form";
import { ModeToggle } from "@/components/mode-toggle";


export default function Home() {
  return (
    <div className="grid grid-cols-[400px_1fr]">
      <aside className="flex flex-col bg-gray-900 min-h-screen px-6 py-4 max-w-fit">
        <ModeToggle />
        <header className="text-center">
          <h1 className="text-3xl font-semibold">Image II code</h1>
          <h2 className="text-sm opacity-75">Pasa tus imágenes a código</h2>
        </header>

        <section>
          {/* { Aquí irán los filtros } */}
        </section>

        <footer>
          <p>{new Date().getFullYear()} &copy; Daniel Mateu</p>
        </footer>
      </aside>
      <main>
        <section className="mx-auto p-10 max-w-2xl">
          <Form />
        </section>
      </main>
    </div>
  )
}
