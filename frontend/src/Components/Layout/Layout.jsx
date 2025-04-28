import React from 'react'
import { Outlet } from 'react-router'
import Nav from '../Nav/Nav'

export default function Layout() {
  return (
    <div>
      <Nav />
      <main className="">
        <Outlet />
      </main>
    </div>
  )
}
