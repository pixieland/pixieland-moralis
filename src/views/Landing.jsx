import React from 'react'
import HeroImg from '../images/hero.png'
import Pixie1 from '../images/pixie1.png'
import Pixie2 from '../images/pixie2.png'

export default function Landing() {
  return (
    <div className="home">
      <img src={HeroImg} alt="Hero" style={{ width: '100%', height: '55vh', position: 'relative' }} />
      <div className="p-5" style={{ position: 'absolute', top: '0' }}>
        <br />
        <br />
        <br />
        <h1 className='text-light h2 mt-5'>
          WELCOME TO PIXIELAND
        </h1>
        <p className='text-light' >explore, trade and play to earn cross - chain digital assets </p>
        <button className='btn btn-danger btn-lg mt-3'>
          Learn More
        </button>
      </div>

      <div className='container'>
        <div className='d-flex align-items-center'>
          <img src={Pixie1} alt="Pixie1" style={{ width: '400px', marginTop: '-2rem', zIndex: '2' }} />
          <div>
            <h2 className='mt-4'>EXPLORE PIXIELAND AND EXPERIENCE A MAGICAL WORLD FILLED WITH BEAUTIFUL AND FASCINATING CREATURES</h2>
            <button className='btn btn-danger btn-lg mt-3'>
              Explore
            </button>
          </div>
        </div>
        
        <div className='d-flex align-items-center'>
          <img src={Pixie1} alt="Pixie1" style={{ width: '400px', marginTop: '-2rem', zIndex: '2' }} />
          <div>
            <h2 className='mt-4'>EXPLORE PIXIELAND AND EXPERIENCE A MAGICAL WORLD FILLED WITH BEAUTIFUL AND FASCINATING CREATURES</h2>
            <button className='btn btn-danger btn-lg mt-3'>
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}