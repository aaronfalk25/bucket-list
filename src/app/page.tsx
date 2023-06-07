import Image from 'next/image'

export default function Home() {
  const logout = () => {
    localStorage.removeItem('email');
    window.location.reload();
  }

  return (
    <div>
        <h1>Home Page</h1>
        <button onClick ={logout}>Logout</button>
    </div>
  )
}
