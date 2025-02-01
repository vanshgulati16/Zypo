import { Route, Routes } from "react-router-dom"


import { HomePage } from "./homePage"
import { ConvertFormat } from "./convert-format"
import { CountButton } from "./count-button"
import { DocxToPdf } from "./docxToPdf"
import { PhotoEditor } from "./photoEditor"
import { ImagesToPdf } from "./imagesToPdf"
export const Routing = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/convert" element={<ConvertFormat />} />
    <Route path="/count" element={<CountButton />} />
    <Route path="/photo-editor" element={<PhotoEditor />} />
    <Route path="/images-to-pdf" element={<ImagesToPdf />} />
  </Routes>
)
