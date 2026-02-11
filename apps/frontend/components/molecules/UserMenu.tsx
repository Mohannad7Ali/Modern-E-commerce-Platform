import React from 'react'

const UserMenu = (props: {
  user: { role: string; id: string; avatar: string; name: string }
  menuOpen: boolean
  closeMenu: () => void
}) => {
  return <div>{JSON.stringify(props)}</div>
}

export default UserMenu
