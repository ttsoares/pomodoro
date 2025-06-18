import { useState } from 'react'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './index.css'

const fonts = ['nm-kumbh-14', 'nm-roboto-14', 'nm-space-13'] as const
type Font = typeof fonts[number]
const colors = ["#70F3F8", "#F87070", "#D881F8"]
type Color = typeof colors[number]


function App() {

  const [font, setFont] = useState<Font>('nm-kumbh-14')
  const [color, setColor] = useState<Color>('#70F3F8')

  const value = 66;
  const textColor = "#ffffff"
  const trailColor = "#161932"

  return (
    <main className='flex justify-center items-center h-screen bg-[#1E213F]'>
      <div className='flex justify-center items-center rounded-full shadow-[#2E325A] shadow-[-44px_-42px_59px_-20px_rgba(0,_0,_0,_0.2)] '>
        <div className='flex p-6 justify-center items-center rounded-full bg-linear-to-br from-[#0E112A] to-[#2E325A] shadow-[#0e112a]] shadow-[49px_50px_59px_-20px_rgba(0,_0,_0,_0.2)] '>
          <div className='w-[320px] h-[320px] rounded-full bg-[#161932] '>
            <div className={`w-full h-full ${font}`}>
              <CircularProgressbar value={value} text="17:50"
                styles={buildStyles({
                  textColor: textColor,
                  pathColor: color,
                  trailColor: trailColor
                })}
                strokeWidth={5} />
            </div>
          </div>
        </div>
      </div>
      <div className={`font-${font} p-4 text-white`}>
        <select
          className="border p-2 rounded"
          value={font}
          onChange={(e) => setFont(e.target.value as Font)}
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
        <p className={`mt-4 text-xl ${font}`}>
          This text uses the selected font: <strong>{font.toUpperCase()}</strong>
        </p>
      </div>
      {/* --------------------------- */}
      <div>
        <select
          style={{ color }}
          className="border p-2 rounded"
          value={color}
          onChange={(e) => setColor(e.target.value as Color)}
        >
          {colors.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
        <p
          style={{ color }}
          className={`mt-4 text-xl`}>
          This text uses the selected font: <strong>{color.toUpperCase()}</strong>
        </p>
      </div>

    </main>
  )
}

export default App
