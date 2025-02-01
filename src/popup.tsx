import { MemoryRouter } from "react-router-dom"
import "~style.css"
import { Routing } from "~features/index"

function IndexPopup() {
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-w-[500px]">
      <MemoryRouter>
        <Routing />
      </MemoryRouter>
    </div>
  )
}

export default IndexPopup