'use client'

import { useState } from 'react'
import { useTimerStore } from './store/useTimerStore'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useWindowWidth } from '@react-hook/window-size'

import './index.css'

import Logo from "./assets/images/logo.svg?react"
import Settings from "./assets/images/icon-settings.svg?react"
import Close from "./assets/images/icon-close.svg?react"
import Tick from "./assets/images/icon-tick.svg?react"

import TimerSwitcher from './components/TimerSwitcher';

import type { TimerId } from './store/useTimerStore'
const TIMER_IDS: TimerId[] = ['A', 'B', 'C'] as const
const TIMER_LABELS: Record<TimerId, string> = {
  A: "Pomodoro",
  B: "Long break",
  C: "Short break",
}

const fonts = ['kumbh', 'roboto', 'space'] as const
type Font = typeof fonts[number]

// Define theme color variables
const themeColors = ['var(--color-c_cyan)', 'var(--color-c_red)', 'var(--color-c_purple)'] as const
type ThemeColor = typeof themeColors[number]

// Map hover text classes
const hoverTextClassMap: Record<ThemeColor, string> = {
  'var(--color-c_cyan)': 'hover:text-[var(--color-c_cyan)]',
  'var(--color-c_red)': 'hover:text-[var(--color-c_red)]',
  'var(--color-c_purple)': 'hover:text-[var(--color-c_purple)]',
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ------------------------------------------------------Main App
export default function App() {

  // To controll clock font size as it is not via Tailwind
  let clockFontSize = 22
  const onlyWidth = useWindowWidth()
  if (onlyWidth >= 768) {
    clockFontSize = 26
  }

  const [font, setFont] = useState<Font>('kumbh')
  const [color, setColor] = useState<ThemeColor>('var(--color-c_cyan)')

  const [visibleTimer, setVisibleTimer] = useState<TimerId>('A')
  const timers = useTimerStore(state => state.timers)
  const start = useTimerStore(state => state.start)
  const stop = useTimerStore(state => state.stop)
  const reset = useTimerStore(state => state.reset)
  const updateDuration = useTimerStore(state => state.updateDuration)

  const [formValues, setFormValues] = useState<Record<TimerId, string>>({
    A: (timers.A.duration / 60).toString(),
    B: (timers.B.duration / 60).toString(),
    C: (timers.C.duration / 60).toString(),
  })

  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => {
    setFormValues({
      A: (timers.A.duration / 60).toString(),
      B: (timers.B.duration / 60).toString(),
      C: (timers.C.duration / 60).toString(),
    })
    setModalOpen(true)
  }

  /**
   * Handle the save button click of the modal dialog.
   * This function loops through each timer and if the new minutes is different
   * from the current minutes, it will call updateDuration to update the timer's
   * duration.
   * After updating the durations, the modal dialog will be closed.
   */
  const handleSaveDurations = () => {
    TIMER_IDS.forEach(id => {
      const newMinutes = parseInt(formValues[id], 10);
      const currentMinutes = timers[id].duration / 60;
      if (!isNaN(newMinutes) && newMinutes !== currentMinutes) {
        updateDuration(id, newMinutes);
      }
    });

    setModalOpen(false);
  };

  // Controlls the circular progress bar
  const timer = timers[visibleTimer]
  const progress =
    timer.remainingTime > 0
      ? ((timer.duration - timer.remainingTime) / timer.duration) * 100
      : 100

  // Controlls the label and the action of the button
  let buttonLabel: string
  let buttonAction: () => void
  if (timer.remainingTime === 0) {
    buttonLabel = 'Restart'
    buttonAction = () => reset(visibleTimer)
  } else if (timer.remainingTime === timer.duration) {
    buttonLabel = 'Start'
    buttonAction = () => start(visibleTimer)
  } else if (timer.playing) {
    buttonLabel = 'Pause'
    buttonAction = () => stop(visibleTimer)
  } else {
    buttonLabel = 'Resume'
    buttonAction = () => start(visibleTimer)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-14 p-6 relative min-h-screen bg-c_b85">
      <Logo className='mb-10 scale-75 md:scale-100' />

      {/* Switch Timer Buttons */}
      <TimerSwitcher
        visibleTimer={visibleTimer}
        setVisibleTimer={setVisibleTimer}
        color={color}
        font={font}
      />

      {/* Circular Timer Display */}
      <div className='flex justify-center items-center rounded-full shadow-[#2E325A] shadow-[-44px_-42px_59px_-20px_rgba(0,_0,_0,_0.2)]'>
        <div className='flex p-6 justify-center items-center rounded-full bg-linear-to-br from-[#0E112A] to-[#2E325A] shadow-[#0e112a] shadow-[49px_50px_59px_-20px_rgba(0,_0,_0,_0.2)] '>
          <div className='w-[227px] md:w-[360px] rounded-full bg-[#161932]  p-4'>
            <div className={`w-full h-full display-${font} relative flex hover:animate-pulse flex-com justify-center items-center`}>
              <CircularProgressbar
                value={progress}
                text={formatTime(timer.remainingTime)}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: color,
                  trailColor: "#161932",
                  textSize: `${clockFontSize}px`,
                })}
                strokeWidth={5}
              />
              <button
                onClick={buttonAction}
                className={`nm-${font}-16 top-3/4 left-1/2 -translate-x-[45%] -translate-y-1/2 absolute text-white uppercase ${hoverTextClassMap[color]}`}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal Button */}
      <div className='w-full flex justify-center items-center h-12 mt-10'>
        <button
          onClick={handleOpenModal}
          className="hover:cursor-pointer p-10 hover:animate-spin"
        >
          <Settings />
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-c_b90 flex items-center justify-center z-50 ">
          <div className="bg-white shadow-lg space-y-4 w-[34rem] h-[29.1rem] p-6 rounded-3xl relative">

            <div className='flex justify-between w-full border-b-2 border-slate-200 my-6'>
              <h2 className='set-kumbh-28 mb-2 font-extrabold'>Settings</h2>
              <button
                className='hover:cursor-pointer p-5 hover:animate-spin'
                onClick={() => setModalOpen(false)}>
                <Close />
              </button>
            </div>

            <p className='set-kumbh-13-a'>T I M E  (M I N U T E S)</p>

            <div className="grid grid-cols-3 gap-4 border-b-2 border-slate-200 pb-8">
              {TIMER_IDS.map(id => (
                <div key={id} className="flex flex-col">
                  <label className="set-kumbh-12">{TIMER_LABELS[id]}</label>
                  <input
                    type="number"
                    style={{ backgroundColor: "#eff1fa" }}
                    min="1"
                    value={formValues[id]}
                    onChange={e =>
                      setFormValues(prev => ({
                        ...prev,
                        [id]: e.target.value,
                      }))
                    }
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>

            <div className='flex flex-row justify-between items-center border-b-2 border-slate-200 pt-4 pb-6'>
              <p className='set-kumbh-13-a'>F O N T</p>
              <div className="flex flex-row ">
                {fonts.map(f => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    className={`set-${f}-16 p-2 mx-1 hover:animate-bounce hover:cursor-pointer hover:outline-2 outline-offset-2 outline-c_b5 rounded-full ${font === f ? 'bg-black text-white' : 'bg-c_b5'}`}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>
            <div className='flex flex-row justify-between items-center py-4'>
              <p className='set-kumbh-13-a'>C O L O R</p>
              <div className="flex flex-row">
                {themeColors.map(c => (
                  <button
                    key={c}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    className={`set-${c}-16 p-2 mx-1 rounded-full hover:cursor-pointer hover:outline-2 outline-offset-2 outline-c_b5 hover:animate-bounce`}
                  >
                    {color === c ? <Tick className='w-5 h-5 text-black' /> : <p className='w-5 h-5'></p>}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{ backgroundColor: color }}
              className="absolute flex justify-end -bottom-5 left-1/2 transform -translate-x-1/2  px-8 py-2 rounded-full hover:cursor-pointer hover:animate-pulse">
              <button
                onClick={handleSaveDurations}
                className="px-3 py-1 text-black font-bold hover:cursor-pointer hover:animate-pulse"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
