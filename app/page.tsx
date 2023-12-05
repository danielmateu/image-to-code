'use client'

import { DragAndDrop } from "@/components/DragAndDrop";
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

const toBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

async function* streamReader(res: Response) {
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (reader == null) return

  while (true) {
    const { done, value } = await reader.read()
    const chunk = decoder.decode(value)
    yield chunk
    if (done) break
  }
}

export default function Home() {
  const [result, setResult] = useState('')
  const [step, setStep] = useState(STEPS.INITIAL)

  const transformToCode = async (body: string) => {

    setStep(STEPS.LOADING)
    const res = await fetch('api/generate-code-from-image', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok || res.body == null) {
      setStep(STEPS.ERROR)
      throw new Error('Error al transformar la imagen')
    }

    setStep(STEPS.PREVIEW)
    // Para leer el stream de datos
    for await (const chunk of streamReader(res)) {
      setResult((prev) => prev + chunk)
    }
  }

  const transformUrlToCode = async (url: string) => {
    transformToCode(JSON.stringify({ url }))
    // setStep(STEPS.LOADING)
    // const res = await fetch('api/generate-code-from-image', {
    //   method: 'POST',
    //   body: JSON.stringify({ url }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    // if (!res.ok || res.body == null) {
    //   setStep(STEPS.ERROR)
    //   throw new Error('Error al transformar la imagen')
    // }

    // setStep(STEPS.PREVIEW)
    // // Para leer el stream de datos
    // for await (const chunk of streamReader(res)) {
    //   setResult((prev) => prev + chunk)
    // }
  }

  const transformImageTOCode = async (file: File) => {
    const img = await toBase64(file)
    transformToCode(JSON.stringify({ img }))

    // setStep(STEPS.LOADING)
    // const res = await fetch('api/generate-code-from-image', {
    //   method: 'POST',
    //   body: JSON.stringify({ img }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    // if (!res.ok || res.body == null) {
    //   setStep(STEPS.ERROR)
    //   throw new Error('Error al transformar la imagen')
    // }

    // setStep(STEPS.PREVIEW)
    // // Para leer el stream de datos
    // for await (const chunk of streamReader(res)) {
    //   setResult((prev) => prev + chunk)
    // }
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
      <main className="">
        <section className="mx-auto p-10 max-w-5xl">
          {
            step === STEPS.LOADING && (
              <Loader />
            )
          }
          {
            step === STEPS.INITIAL && (
              <div className="flex flex-col gap-4">
                <DragAndDrop transformImageTOCode={transformImageTOCode} />
                <Form transformUrlToCode={transformUrlToCode} />
              </div>
            )
          }

          {
            step === STEPS.PREVIEW && (
              <div className="border-gray-700 rounded">
                <div className="max-w-3xl">
                  <iframe srcDoc={result} className="w-full h-screen border-0 aspect-video" />
                </div>
                <pre className="pt-10 max-w-3xl">
                  <code className="">{result}</code>
                </pre>
              </div>
            )
          }

        </section>
      </main>
    </div>
  )
}
