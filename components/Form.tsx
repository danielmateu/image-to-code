'use client'

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const Form = ({ transformUrlToCode }: {
    transformUrlToCode: (url: string) => Promise<void>
}) => {

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget as HTMLFormElement
                const url = form.elements.namedItem('url') as HTMLInputElement
                // console.log(url.value);
                transformUrlToCode(url.value)
            }}

        >
            <div className="flex flex-col gap-2 pb-4">
                <Label htmlFor="url">Introduce tu url de la imagen:</Label>
                <Input name="url" id="url" type="url" placeholder="https://..." />
            </div>
            <Button type="submit">Generar código</Button>
        </form>
    )
}
