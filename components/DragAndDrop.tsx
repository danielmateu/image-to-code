"use client"

import { Dropzone, FileMosaic, ExtFile } from '@files-ui/react';
import { useState } from 'react';

export const DragAndDrop = ({ transformImageTOCode }:
    { transformImageTOCode: (file: File) => Promise<void> }
) => {
    const [files, setFiles] = useState<ExtFile[]>()
    const updatedFiles = (files: ExtFile[]) => {
        // if (files.length > 0) {
        //     transformImageTOCode(files[0].file)
        // }
        const file = files[0].file
        if (file === undefined || file === null) return
        transformImageTOCode(file)
        setFiles(files)
    }
    return (
        <Dropzone
            footer={false}
            header={false}
            maxFiles={1}
            label='Arrastra y suelta tus archivos aquí'
            accept='image/*'
            className='max-w-sm mx-auto'
            onChange={updatedFiles}

        >
            {
                files?.map((file, index) => {
                    return <FileMosaic key={index} {...file} preview />
                })
            }
        </Dropzone>
    )
}
