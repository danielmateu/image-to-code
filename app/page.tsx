'use client'

import { Form } from "@/components/Form";
import { Loader } from "@/components/Loader";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

const STEPS = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  PREVIEW: 'PREVIEW',
  ERROR: 'ERROR'
}

export default function Home() {
  const [result, setResult] = useState('')
  const [step, setStep] = useState(STEPS.INITIAL)

  const transformUrlToCode = async (url: string) => {
    setStep(STEPS.LOADING)
    const res = await fetch('api/generate-code-from-image', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok || res.body == null) {
      setStep(STEPS.ERROR)
      throw new Error('Error al transformar la imagen')
    }

    setStep(STEPS.PREVIEW)

    // Leer el streaming de datos
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      const chunk = decoder.decode(value)
      setResult(prevResult => prevResult + chunk)
      if (done) break
    }
  }

  return (
    <div className="grid grid-cols-[400px_1fr]">
      <aside className="flex flex-col dark:bg-gray-900 bg-gray-200 min-h-screen px-6 py-4 max-w-fit">
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
        <section className="mx-auto p-10 max-w-5xl">
          {
            step === STEPS.LOADING && (
              <Loader />
            )
          }
          {
            step === STEPS.INITIAL && (
              <Form transformUrlToCode={transformUrlToCode} />
            )
          }

          {
            step === STEPS.PREVIEW && (
              <div className="border-gray-700 rounded">
                <iframe srcDoc={result} className="w-full h-screen border-0 aspect-video" />
              </div>
            )
          }

        </section>
      </main>
    </div>
  )
}
